import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  FixtureEntrantType,
  FixtureFormat,
  FixtureRoundStage,
  FixtureSetStatus,
  MatchStatus,
  ParticipantType,
  Prisma,
  TournamentStatus,
  TournamentVisibility,
  TournamentCategory,
  TournamentCategoryStatus
} from "@prisma/client";
import { createCsv, type CsvRow } from "../../common/utils/csv.util";
import { OrganizerFixturesDbService } from "../../db/organizer-fixtures/organizer-fixtures-db.service";
import { GeneratedRoundInput, OrganizerFixtureMatch } from "../../db/organizer-fixtures/organizer-fixtures.repository";
import { NotificationsService } from "../../notifications/notifications.service";
import { AuthenticatedUser } from "../auth/auth.types";
import {
  GenerateFixtureSetRequestDto,
  UpdateMatchScoreRequestDto,
  UpdateMatchScheduleRequestDto
} from "./dto/organizer-fixture.dto";
import { OrganizerFixturesTransform } from "./organizer-fixtures.transform";

interface FixtureEntrantInput {
  id: string;
  displayName: string;
  entrantType: FixtureEntrantType;
  seed: number | null;
  createdAt: Date;
}

interface ValidatedScoreInput {
  matchEntrantId: string;
  score: number;
  isWinner: boolean;
}

@Injectable()
export class OrganizerFixturesService {
  constructor(
    private readonly organizerFixturesDb: OrganizerFixturesDbService,
    private readonly notifications: NotificationsService,
    private readonly transform: OrganizerFixturesTransform,
    private readonly config: ConfigService
  ) {}

  async findFixtureSets(currentUser: AuthenticatedUser, tournamentId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSets = await this.organizerFixturesDb.findFixtureSetsByTournament(tournamentId);
    return fixtureSets.map((fixtureSet) => this.transform.toFixtureSetListItem(fixtureSet));
  }

  async generateFixtureSet(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    categoryId: string,
    dto: GenerateFixtureSetRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const category = await this.requireOwnedCategory(categoryId, tournamentId);
    this.assertEntrantTypeMatchesCategory(category, dto.entrant_type);

    const existingFixtureSets = await this.organizerFixturesDb.findActiveFixtureSets({
      tournamentId,
      tournamentCategoryId: categoryId,
      format: dto.format,
      entrantType: dto.entrant_type
    });

    if (existingFixtureSets.length > 0 && !dto.replace_existing) {
      throw new ConflictException("A fixture set already exists for this category, format, and entrant type");
    }

    const entrants = await this.loadEntrants(tournamentId, categoryId, dto.entrant_type);
    if (entrants.length < 2) {
      throw new BadRequestException("At least two active entrants are required to generate fixtures");
    }

    const rounds = dto.format === FixtureFormat.KNOCKOUT
      ? this.generateKnockoutRounds(entrants)
      : this.generateRoundRobinRounds(entrants);

    const fixtureSet = await this.organizerFixturesDb.createGeneratedFixtureSet({
      tournamentId,
      tournamentCategoryId: categoryId,
      format: dto.format,
      entrantType: dto.entrant_type,
      name: this.cleanOptionalString(dto.name),
      archiveFixtureSetIds: dto.replace_existing ? existingFixtureSets.map((fixtureSet) => fixtureSet.id) : [],
      rounds
    });

    await this.audit(currentUser.id, "fixture_set", fixtureSet.id, "fixture_set.generated", {
      tournament_id: tournamentId,
      tournament_category_id: categoryId,
      format: dto.format,
      entrant_type: dto.entrant_type,
      entrant_count: entrants.length,
      replaced_fixture_set_ids: dto.replace_existing ? existingFixtureSets.map((existing) => existing.id) : []
    });

    return this.transform.toFixtureSetDetail(fixtureSet);
  }

  async findFixtureSet(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    return this.transform.toFixtureSetDetail(fixtureSet);
  }

  async findFixtureResults(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    return this.transform.toFixtureSetDetail(fixtureSet);
  }

  async exportFixtureResults(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    const limit = this.getExportLimit();
    const rows = fixtureSet.rounds.flatMap((round) => round.matches.map((match) => {
      const entrants = match.entrants
        .slice()
        .sort((first, second) => first.slotNumber - second.slotNumber);
      const first = entrants[0] ?? null;
      const second = entrants[1] ?? null;
      const winner = entrants.find((entrant) => entrant.score?.isWinner) ?? null;
      return {
        fixtureSet: fixtureSet.name ?? `${fixtureSet.format} fixtures`,
        round: round.name,
        matchNumber: match.matchNumber,
        entrant1: this.getEntrantDisplayName(first),
        entrant1Score: first?.score?.score ?? "",
        entrant2: this.getEntrantDisplayName(second),
        entrant2Score: second?.score?.score ?? "",
        winner: this.getEntrantDisplayName(winner),
        status: this.toApiEnum(match.status),
        scheduledAt: match.scheduledAt?.toISOString() ?? ""
      } satisfies CsvRow;
    }));

    this.assertExportLimit(rows.length, limit);
    await this.audit(currentUser.id, "fixture_set", fixtureSetId, "organizer.export_results", {
      actor_user_id: currentUser.id,
      role: "ORGANIZER",
      export_type: "organizer.export_results",
      tournament_id: tournamentId,
      fixture_set_id: fixtureSetId,
      row_count: rows.length,
      exported_at: new Date().toISOString()
    });
    return {
      filename: `tournament-${tournamentId}-fixture-${fixtureSetId}-results.csv`,
      rowCount: rows.length,
      content: createCsv([
        "fixtureSet",
        "round",
        "matchNumber",
        "entrant1",
        "entrant1Score",
        "entrant2",
        "entrant2Score",
        "winner",
        "status",
        "scheduledAt"
      ], rows)
    };
  }

  async updateMatchSchedule(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    fixtureSetId: string,
    matchId: string,
    dto: UpdateMatchScheduleRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    if (fixtureSet.status === FixtureSetStatus.ARCHIVED) {
      throw new BadRequestException("Archived fixture sets cannot be scheduled");
    }
    const match = await this.requireOwnedMatch(matchId, fixtureSetId, tournamentId);
    if (match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException("Completed matches must be reopened before schedule fields can be edited");
    }

    const nextScheduledAt = dto.scheduled_at === undefined
      ? match.scheduledAt
      : dto.scheduled_at
        ? new Date(dto.scheduled_at)
        : null;
    let nextStatus = dto.status ?? match.status;
    if (dto.scheduled_at !== undefined && !dto.status) {
      nextStatus = nextScheduledAt ? MatchStatus.SCHEDULED : MatchStatus.UNSCHEDULED;
    }

    this.assertScheduleState(nextStatus, nextScheduledAt);

    const updated = await this.organizerFixturesDb.updateMatchSchedule(matchId, {
      scheduledAt: dto.scheduled_at === undefined ? undefined : nextScheduledAt,
      venueName: this.cleanNullableString(dto.venue_name),
      courtName: this.cleanNullableString(dto.court_name),
      notes: this.cleanNullableString(dto.notes),
      status: nextStatus
    });

    await this.refreshFixtureSetScheduleStatus(fixtureSetId);
    await this.audit(currentUser.id, "match", matchId, "match.schedule_updated", {
      tournament_id: tournamentId,
      fixture_set_id: fixtureSetId,
      scheduled_at: nextScheduledAt?.toISOString() ?? null,
      status: nextStatus
    });

    return this.transform.toMatch(updated);
  }

  async updateMatchScore(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    fixtureSetId: string,
    matchId: string,
    dto: UpdateMatchScoreRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    this.assertFixtureSetCanReceiveScores(fixtureSet.status);
    const match = await this.requireOwnedMatch(matchId, fixtureSetId, tournamentId);
    this.assertMatchCanReceiveScores(match.status);
    const { scores } = this.validateScorePayload(fixtureSet, match, dto, false);

    const updated = await this.organizerFixturesDb.saveMatchScores({
      matchId,
      scores,
      resultNotes: this.cleanNullableString(dto.result_notes)
    });

    await this.audit(currentUser.id, "match", matchId, "match.score_updated", {
      tournament_id: tournamentId,
      fixture_set_id: fixtureSetId,
      score_count: scores.length
    });

    return this.transform.toMatch(updated);
  }

  async completeMatch(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    fixtureSetId: string,
    matchId: string,
    dto: UpdateMatchScoreRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    this.assertFixtureSetCanReceiveScores(fixtureSet.status);
    const match = await this.requireOwnedMatch(matchId, fixtureSetId, tournamentId);
    this.assertMatchCanReceiveScores(match.status);
    const { scores, winnerEntrant, isDraw } = this.validateScorePayload(fixtureSet, match, dto, true);

    await this.organizerFixturesDb.completeMatch({
      matchId,
      scores,
      winnerParticipantId: winnerEntrant?.participantId ?? null,
      winnerTeamId: winnerEntrant?.teamId ?? null,
      resultNotes: this.cleanNullableString(dto.result_notes)
    });

    if (fixtureSet.format === FixtureFormat.KNOCKOUT && winnerEntrant && !isDraw) {
      await this.advanceKnockoutWinner(fixtureSetId, tournamentId, match, winnerEntrant);
    }

    await this.audit(currentUser.id, "match", matchId, "match.completed", {
      tournament_id: tournamentId,
      fixture_set_id: fixtureSetId,
      winner_match_entrant_id: winnerEntrant?.id ?? null,
      is_draw: isDraw
    });

    const refreshed = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    return this.transform.toFixtureSetDetail(refreshed);
  }

  async reopenMatch(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string, matchId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    this.assertFixtureSetCanReceiveScores(fixtureSet.status);
    const match = await this.requireOwnedMatch(matchId, fixtureSetId, tournamentId);
    if (match.status !== MatchStatus.COMPLETED) {
      throw new BadRequestException("Only completed matches can be reopened");
    }
    await this.assertSafeToReopen(fixtureSet, match);

    const nextStatus = match.scheduledAt ? MatchStatus.SCHEDULED : MatchStatus.UNSCHEDULED;
    await this.organizerFixturesDb.reopenMatch(matchId, nextStatus);

    await this.audit(currentUser.id, "match", matchId, "match.reopened", {
      tournament_id: tournamentId,
      fixture_set_id: fixtureSetId
    });

    const refreshed = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    return this.transform.toFixtureSetDetail(refreshed);
  }

  async archiveFixtureSet(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);

    if (fixtureSet.status === FixtureSetStatus.ARCHIVED) {
      return this.transform.toFixtureSetDetail(fixtureSet);
    }

    const archived = await this.organizerFixturesDb.updateFixtureSet(fixtureSetId, {
      status: FixtureSetStatus.ARCHIVED,
      publishedAt: null
    });

    await this.audit(currentUser.id, "fixture_set", fixtureSetId, "fixture_set.archived", {
      tournament_id: tournamentId,
      tournament_category_id: fixtureSet.tournamentCategoryId
    });

    return this.transform.toFixtureSetDetail(archived);
  }

  async publishFixtureResults(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    this.assertTournamentCanExposeResults(tournament);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);
    if (fixtureSet.status === FixtureSetStatus.ARCHIVED) {
      throw new BadRequestException("Archived fixture sets cannot be published publicly");
    }

    if (fixtureSet.publishedAt) {
      return this.transform.toFixtureSetDetail(fixtureSet);
    }

    const published = await this.organizerFixturesDb.updateFixtureSet(fixtureSetId, {
      publishedAt: new Date()
    });

    await this.audit(currentUser.id, "fixture_set", fixtureSetId, "fixture_set.results_published", {
      tournament_id: tournamentId,
      tournament_category_id: fixtureSet.tournamentCategoryId,
      notification_ready: true,
      notification_delivery: "outbox"
    });

    const recipients = await this.organizerFixturesDb.findResultsNotificationRecipients({
      tournamentId,
      tournamentCategoryId: fixtureSet.tournamentCategoryId
    });
    await this.notifications.enqueueResultsPublished({
      tournamentId,
      tournamentCategoryId: fixtureSet.tournamentCategoryId,
      fixtureSetId,
      tournamentTitle: tournament.title,
      tournamentSlug: tournament.slug,
      categoryName: fixtureSet.tournamentCategory.name,
      fixtureSetName: fixtureSet.name,
      recipients: recipients.map((registration) => ({
        registrationId: registration.id,
        recipientUserId: registration.userId,
        recipientEmail: registration.user.email,
        recipientName: registration.playerName
      }))
    });

    return this.transform.toFixtureSetDetail(published);
  }

  async unpublishFixtureResults(currentUser: AuthenticatedUser, tournamentId: string, fixtureSetId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const fixtureSet = await this.requireOwnedFixtureSet(fixtureSetId, tournamentId);

    if (!fixtureSet.publishedAt) {
      return this.transform.toFixtureSetDetail(fixtureSet);
    }

    const unpublished = await this.organizerFixturesDb.updateFixtureSet(fixtureSetId, {
      publishedAt: null
    });

    await this.audit(currentUser.id, "fixture_set", fixtureSetId, "fixture_set.results_unpublished", {
      tournament_id: tournamentId,
      tournament_category_id: fixtureSet.tournamentCategoryId,
      notification_ready: true,
      notification_delivery: "deferred"
    });

    return this.transform.toFixtureSetDetail(unpublished);
  }

  private async requireOrganizerProfile(userId: string) {
    const profile = await this.organizerFixturesDb.findOrganizerProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException("Organizer profile not found");
    }
    return profile;
  }

  private async requireOwnedTournament(id: string, organizerProfileId: string) {
    const tournament = await this.organizerFixturesDb.findOwnedTournament(id, organizerProfileId);
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }
    return tournament;
  }

  private async requireOwnedCategory(categoryId: string, tournamentId: string) {
    const category = await this.organizerFixturesDb.findCategoryById(categoryId);
    if (!category || category.tournamentId !== tournamentId) {
      throw new NotFoundException("Category not found");
    }
    if (category.status !== TournamentCategoryStatus.ACTIVE) {
      throw new BadRequestException("Category is not active");
    }
    return category;
  }

  private async requireOwnedFixtureSet(fixtureSetId: string, tournamentId: string) {
    const fixtureSet = await this.organizerFixturesDb.findFixtureSetById(fixtureSetId);
    if (!fixtureSet || fixtureSet.tournamentId !== tournamentId) {
      throw new NotFoundException("Fixture set not found");
    }
    return fixtureSet;
  }

  private async requireOwnedMatch(matchId: string, fixtureSetId: string, tournamentId: string) {
    const match = await this.organizerFixturesDb.findMatchById(matchId);
    if (!match || match.fixtureSetId !== fixtureSetId || match.tournamentId !== tournamentId) {
      throw new NotFoundException("Match not found");
    }
    return match;
  }

  private assertEntrantTypeMatchesCategory(category: TournamentCategory, entrantType: FixtureEntrantType) {
    if (entrantType === FixtureEntrantType.PARTICIPANT && category.participantType !== ParticipantType.SINGLES) {
      throw new BadRequestException("Participant fixtures are only available for singles categories");
    }
    if (entrantType === FixtureEntrantType.TEAM && category.participantType === ParticipantType.SINGLES) {
      throw new BadRequestException("Team fixtures are only available for doubles or team categories");
    }
  }

  private assertTournamentCanExposeResults(tournament: Awaited<ReturnType<OrganizerFixturesService["requireOwnedTournament"]>>) {
    if (tournament.status !== TournamentStatus.PUBLISHED || tournament.visibility !== TournamentVisibility.PUBLIC) {
      throw new BadRequestException("Only published public tournaments can expose fixture results publicly");
    }
  }

  private async loadEntrants(tournamentId: string, categoryId: string, entrantType: FixtureEntrantType) {
    if (entrantType === FixtureEntrantType.PARTICIPANT) {
      const participants = await this.organizerFixturesDb.findActiveParticipantsForCategory(tournamentId, categoryId);
      return participants.map((participant) => ({
        id: participant.id,
        displayName: participant.displayName,
        entrantType,
        seed: null,
        createdAt: participant.createdAt
      } satisfies FixtureEntrantInput));
    }

    const teams = await this.organizerFixturesDb.findActiveTeamsForCategory(tournamentId, categoryId);
    return teams.map((team) => ({
      id: team.id,
      displayName: team.name,
      entrantType,
      seed: team.seed,
      createdAt: team.createdAt
    } satisfies FixtureEntrantInput));
  }

  private generateKnockoutRounds(entrants: FixtureEntrantInput[]): GeneratedRoundInput[] {
    const bracketSize = this.nextPowerOfTwo(entrants.length);
    if (bracketSize > 32) {
      throw new BadRequestException("Knockout generation currently supports up to 32 entrants");
    }

    const stage = this.getKnockoutStage(bracketSize);
    const slots: Array<FixtureEntrantInput | null> = [...entrants];
    while (slots.length < bracketSize) {
      slots.push(null);
    }

    const matches: GeneratedRoundInput["matches"] = [];
    for (let index = 0; index < slots.length; index += 2) {
      const first = slots[index];
      const second = slots[index + 1] ?? null;
      matches.push({
        matchNumber: matches.length + 1,
        roundPosition: matches.length + 1,
        entrants: [
          this.toGeneratedEntrant(first, 1),
          this.toGeneratedEntrant(second, 2)
        ]
      });
    }

    return [{
      name: this.getStageName(stage),
      stage,
      matches
    }];
  }

  private generateRoundRobinRounds(entrants: FixtureEntrantInput[]): GeneratedRoundInput[] {
    const slots: Array<FixtureEntrantInput | null> = [...entrants];
    if (slots.length % 2 === 1) {
      slots.push(null);
    }

    const rounds: GeneratedRoundInput[] = [];
    let matchNumber = 1;
    const rotatingSlots = [...slots];
    const roundCount = rotatingSlots.length - 1;
    const matchesPerRound = rotatingSlots.length / 2;

    for (let roundIndex = 0; roundIndex < roundCount; roundIndex += 1) {
      const matches: GeneratedRoundInput["matches"] = [];
      for (let pairIndex = 0; pairIndex < matchesPerRound; pairIndex += 1) {
        const first = rotatingSlots[pairIndex];
        const second = rotatingSlots[rotatingSlots.length - 1 - pairIndex];
        if (first && second) {
          matches.push({
            matchNumber,
            roundPosition: matches.length + 1,
            entrants: [
              this.toGeneratedEntrant(first, 1),
              this.toGeneratedEntrant(second, 2)
            ]
          });
          matchNumber += 1;
        }
      }
      rounds.push({
        name: `Round ${roundIndex + 1}`,
        stage: FixtureRoundStage.ROUND_ROBIN,
        matches
      });
      rotatingSlots.splice(1, 0, rotatingSlots.pop() ?? null);
    }

    return rounds;
  }

  private toGeneratedEntrant(entrant: FixtureEntrantInput | null, slotNumber: number) {
    if (!entrant) {
      return {
        slotNumber,
        isBye: true
      };
    }
    return {
      participantId: entrant.entrantType === FixtureEntrantType.PARTICIPANT ? entrant.id : undefined,
      teamId: entrant.entrantType === FixtureEntrantType.TEAM ? entrant.id : undefined,
      slotNumber,
      isBye: false
    };
  }

  private getKnockoutStage(bracketSize: number) {
    if (bracketSize <= 2) {
      return FixtureRoundStage.FINAL;
    }
    if (bracketSize <= 4) {
      return FixtureRoundStage.SEMI_FINAL;
    }
    if (bracketSize <= 8) {
      return FixtureRoundStage.QUARTER_FINAL;
    }
    if (bracketSize <= 16) {
      return FixtureRoundStage.ROUND_OF_16;
    }
    return FixtureRoundStage.ROUND_OF_32;
  }

  private getStageName(stage: FixtureRoundStage) {
    switch (stage) {
      case FixtureRoundStage.FINAL:
        return "Final";
      case FixtureRoundStage.SEMI_FINAL:
        return "Semi Final";
      case FixtureRoundStage.QUARTER_FINAL:
        return "Quarter Final";
      case FixtureRoundStage.ROUND_OF_16:
        return "Round of 16";
      case FixtureRoundStage.ROUND_OF_32:
        return "Round of 32";
      case FixtureRoundStage.THIRD_PLACE:
        return "Third Place";
      case FixtureRoundStage.ROUND_ROBIN:
      default:
        return "Round Robin";
    }
  }

  private nextPowerOfTwo(value: number) {
    let power = 1;
    while (power < value) {
      power *= 2;
    }
    return Math.max(power, 2);
  }

  private assertScheduleState(status: MatchStatus, scheduledAt: Date | null) {
    const scheduleStatuses: MatchStatus[] = [
      MatchStatus.UNSCHEDULED,
      MatchStatus.SCHEDULED,
      MatchStatus.POSTPONED,
      MatchStatus.CANCELLED
    ];
    if (!scheduleStatuses.includes(status)) {
      throw new BadRequestException("Use scoring endpoints to move matches into progress or completed states");
    }
    if (status === MatchStatus.SCHEDULED && !scheduledAt) {
      throw new BadRequestException("Scheduled matches require a scheduled date and time");
    }
    if (status === MatchStatus.UNSCHEDULED && scheduledAt) {
      throw new BadRequestException("Clear the scheduled date before marking a match unscheduled");
    }
  }

  private assertFixtureSetCanReceiveScores(status: FixtureSetStatus) {
    if (status === FixtureSetStatus.ARCHIVED) {
      throw new BadRequestException("Archived fixture sets cannot be scored");
    }
  }

  private assertMatchCanReceiveScores(status: MatchStatus) {
    if (status === MatchStatus.CANCELLED) {
      throw new BadRequestException("Cancelled matches must be reopened before scores can be entered");
    }
  }

  private validateScorePayload(
    fixtureSet: Awaited<ReturnType<OrganizerFixturesService["requireOwnedFixtureSet"]>>,
    match: Awaited<ReturnType<OrganizerFixturesService["requireOwnedMatch"]>>,
    dto: UpdateMatchScoreRequestDto,
    completing: boolean
  ) {
    const realEntrants = match.entrants.filter((entrant) => !entrant.isBye);
    if (completing && realEntrants.length < 1) {
      throw new BadRequestException("A match must have at least one real entrant before it can be completed");
    }

    const scoreByEntrant = new Map<string, number>();
    for (const input of dto.scores ?? []) {
      if (scoreByEntrant.has(input.match_entrant_id)) {
        throw new BadRequestException("Duplicate score entry for match entrant");
      }
      scoreByEntrant.set(input.match_entrant_id, input.score);
    }

    const matchEntrantIds = new Set(match.entrants.map((entrant) => entrant.id));
    for (const inputId of scoreByEntrant.keys()) {
      if (!matchEntrantIds.has(inputId)) {
        throw new BadRequestException("Score entry references an entrant outside this match");
      }
    }

    let winnerEntrant = dto.winner_match_entrant_id
      ? match.entrants.find((entrant) => entrant.id === dto.winner_match_entrant_id)
      : undefined;
    const hasBye = match.entrants.some((entrant) => entrant.isBye);
    if (completing && !winnerEntrant && realEntrants.length === 1 && hasBye) {
      winnerEntrant = realEntrants[0];
      scoreByEntrant.set(winnerEntrant.id, scoreByEntrant.get(winnerEntrant.id) ?? 0);
    }

    if (dto.winner_match_entrant_id && !winnerEntrant) {
      throw new BadRequestException("Winner must belong to the match");
    }
    if (winnerEntrant?.isBye) {
      throw new BadRequestException("BYE entrants cannot be selected as winners");
    }

    if (completing) {
      for (const entrant of realEntrants) {
        if (!scoreByEntrant.has(entrant.id)) {
          throw new BadRequestException("Completed matches require a score for every real entrant");
        }
      }
    }

    const realScores = realEntrants
      .map((entrant) => scoreByEntrant.get(entrant.id))
      .filter((score): score is number => score !== undefined);
    const isDrawByScore = realScores.length >= 2 && new Set(realScores).size === 1;
    const isDraw = completing && Boolean(dto.allow_draw) && isDrawByScore && !winnerEntrant;

    if (isDraw && fixtureSet.format !== FixtureFormat.ROUND_ROBIN) {
      throw new BadRequestException("Draws are only supported for round-robin fixtures");
    }
    if (completing && fixtureSet.format === FixtureFormat.KNOCKOUT && isDrawByScore) {
      throw new BadRequestException("Knockout matches require a non-draw result");
    }
    if (completing && !isDraw && !winnerEntrant) {
      throw new BadRequestException("Completed matches require a winner unless a round-robin draw is allowed");
    }

    const scores: ValidatedScoreInput[] = Array.from(scoreByEntrant.entries()).map(([matchEntrantId, score]) => ({
      matchEntrantId,
      score,
      isWinner: !isDraw && winnerEntrant?.id === matchEntrantId
    }));

    return { scores, winnerEntrant, isDraw };
  }

  private async advanceKnockoutWinner(
    fixtureSetId: string,
    tournamentId: string,
    match: Awaited<ReturnType<OrganizerFixturesService["requireOwnedMatch"]>>,
    winnerEntrant: Awaited<ReturnType<OrganizerFixturesService["requireOwnedMatch"]>>["entrants"][number]
  ) {
    const currentRound = await this.organizerFixturesDb.findFixtureSetById(fixtureSetId)
      .then((fixtureSet) => fixtureSet?.rounds.find((round) => round.id === match.fixtureRoundId));
    if (!currentRound || currentRound.stage === FixtureRoundStage.FINAL) {
      return;
    }

    const nextStage = this.getNextKnockoutStage(currentRound.stage);
    if (!nextStage) {
      return;
    }

    try {
      await this.organizerFixturesDb.advanceKnockoutWinner({
        fixtureSetId,
        tournamentId,
        tournamentCategoryId: match.tournamentCategoryId,
        nextRoundNumber: currentRound.roundNumber + 1,
        nextRoundName: this.getStageName(nextStage),
        nextRoundStage: nextStage,
        nextMatchPosition: Math.ceil(match.roundPosition / 2),
        nextSlotNumber: match.roundPosition % 2 === 1 ? 1 : 2,
        participantId: winnerEntrant.participantId,
        teamId: winnerEntrant.teamId
      });
    } catch (error) {
      if (error instanceof Error && error.message === "next_slot_occupied") {
        throw new ConflictException("Winner has already advanced into a different next-round slot");
      }
      throw error;
    }
  }

  private async assertSafeToReopen(
    fixtureSet: Awaited<ReturnType<OrganizerFixturesService["requireOwnedFixtureSet"]>>,
    match: Awaited<ReturnType<OrganizerFixturesService["requireOwnedMatch"]>>
  ) {
    if (fixtureSet.format !== FixtureFormat.KNOCKOUT) {
      return;
    }

    const winnerParticipantId = match.winnerParticipantId
      ?? match.entrants.find((entrant) => entrant.score?.isWinner)?.participantId
      ?? null;
    const winnerTeamId = match.winnerTeamId
      ?? match.entrants.find((entrant) => entrant.score?.isWinner)?.teamId
      ?? null;
    if (!winnerParticipantId && !winnerTeamId) {
      return;
    }

    const downstreamEntrants = await this.organizerFixturesDb.countDownstreamEntrants({
      fixtureSetId: fixtureSet.id,
      sourceFixtureRoundId: match.fixtureRoundId,
      participantId: winnerParticipantId,
      teamId: winnerTeamId
    });

    if (downstreamEntrants > 0) {
      throw new ConflictException("Reopening this match is blocked because its winner has advanced to a later round");
    }
  }

  private getNextKnockoutStage(stage: FixtureRoundStage) {
    switch (stage) {
      case FixtureRoundStage.ROUND_OF_32:
        return FixtureRoundStage.ROUND_OF_16;
      case FixtureRoundStage.ROUND_OF_16:
        return FixtureRoundStage.QUARTER_FINAL;
      case FixtureRoundStage.QUARTER_FINAL:
        return FixtureRoundStage.SEMI_FINAL;
      case FixtureRoundStage.SEMI_FINAL:
        return FixtureRoundStage.FINAL;
      default:
        return null;
    }
  }

  private async refreshFixtureSetScheduleStatus(fixtureSetId: string) {
    const fixtureSet = await this.organizerFixturesDb.findFixtureSetById(fixtureSetId);
    if (!fixtureSet || fixtureSet.status === FixtureSetStatus.ARCHIVED) {
      return;
    }
    const matches = fixtureSet.rounds.flatMap((round) => round.matches);
    const allScheduled = matches.length > 0 && matches.every((match) => match.status === MatchStatus.SCHEDULED && match.scheduledAt);
    const nextStatus = allScheduled ? FixtureSetStatus.SCHEDULED : FixtureSetStatus.GENERATED;
    if (fixtureSet.status !== nextStatus) {
      await this.organizerFixturesDb.updateFixtureSet(fixtureSetId, { status: nextStatus });
    }
  }

  private cleanOptionalString(value?: string | null): string | undefined {
    const cleanValue = value?.trim();
    return cleanValue ? cleanValue : undefined;
  }

  private cleanNullableString(value?: string | null): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }
    const cleanValue = value?.trim();
    return cleanValue ? cleanValue : null;
  }

  private audit(actorId: string, entityType: string, entityId: string, action: string, metadata: Prisma.InputJsonObject) {
    return this.organizerFixturesDb.createAuditLog({
      actorId,
      entityType,
      entityId,
      action,
      metadata
    });
  }

  private getEntrantDisplayName(entrant: OrganizerFixtureMatch["entrants"][number] | null): string {
    if (!entrant) {
      return "";
    }
    if (entrant.isBye) {
      return "BYE";
    }
    return entrant.participant?.displayName ?? entrant.team?.name ?? "Unassigned";
  }

  private assertExportLimit(rowCount: number, limit: number) {
    if (rowCount > limit) {
      throw new BadRequestException(`Export exceeds the configured ${limit} row limit. Refine filters and try again.`);
    }
  }

  private getExportLimit() {
    return this.config.get<number>("EXPORT_MAX_ROWS") ?? 5000;
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
