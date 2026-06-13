import { Injectable } from "@nestjs/common";
import { FixtureEntrantType, FixtureFormat, MatchEntrant, MatchStatus, Participant, Team, TournamentCategory } from "@prisma/client";
import { RegistrationCategorySummaryDto } from "../registrations/dto/registration.dto";
import {
  FixtureEntrantDto,
  FixtureMatchDto,
  FixtureRoundDto,
  RoundRobinStandingDto,
  FixtureSetDetailDto,
  FixtureSetDto
} from "./dto/organizer-fixture.dto";
import {
  OrganizerFixtureMatch,
  OrganizerFixtureSetDetail,
  OrganizerFixtureSetListItem
} from "../../db/organizer-fixtures/organizer-fixtures.repository";

@Injectable()
export class OrganizerFixturesTransform {
  toFixtureSetListItem(fixtureSet: OrganizerFixtureSetListItem): FixtureSetDto {
    return {
      id: fixtureSet.id,
      tournament_id: fixtureSet.tournamentId,
      category: this.toCategorySummary(fixtureSet.tournamentCategory),
      format: this.toApiEnum(fixtureSet.format),
      entrant_type: this.toApiEnum(fixtureSet.entrantType),
      status: this.toApiEnum(fixtureSet.status),
      name: fixtureSet.name,
      match_count: fixtureSet.matches.length,
      scheduled_match_count: fixtureSet.matches.filter((match) => Boolean(match.scheduledAt)).length,
      generated_at: fixtureSet.generatedAt?.toISOString() ?? null,
      published_at: fixtureSet.publishedAt?.toISOString() ?? null,
      created_at: fixtureSet.createdAt.toISOString(),
      updated_at: fixtureSet.updatedAt.toISOString()
    };
  }

  toFixtureSetDetail(fixtureSet: OrganizerFixtureSetDetail): FixtureSetDetailDto {
    const matches = fixtureSet.rounds.flatMap((round) => round.matches);
    return {
      id: fixtureSet.id,
      tournament_id: fixtureSet.tournamentId,
      category: this.toCategorySummary(fixtureSet.tournamentCategory),
      format: this.toApiEnum(fixtureSet.format),
      entrant_type: this.toApiEnum(fixtureSet.entrantType),
      status: this.toApiEnum(fixtureSet.status),
      name: fixtureSet.name,
      match_count: matches.length,
      scheduled_match_count: matches.filter((match) => Boolean(match.scheduledAt)).length,
      generated_at: fixtureSet.generatedAt?.toISOString() ?? null,
      published_at: fixtureSet.publishedAt?.toISOString() ?? null,
      created_at: fixtureSet.createdAt.toISOString(),
      updated_at: fixtureSet.updatedAt.toISOString(),
      rounds: fixtureSet.rounds.map((round) => ({
        id: round.id,
        round_number: round.roundNumber,
        name: round.name,
        stage: this.toApiEnum(round.stage),
        matches: round.matches.map((match) => this.toMatch(match)),
        created_at: round.createdAt.toISOString(),
        updated_at: round.updatedAt.toISOString()
      } satisfies FixtureRoundDto)),
      standings: this.toRoundRobinStandings(fixtureSet)
    };
  }

  toMatch(match: OrganizerFixtureMatch): FixtureMatchDto {
    return {
      id: match.id,
      match_number: match.matchNumber,
      round_position: match.roundPosition,
      status: this.toApiEnum(match.status),
      scheduled_at: match.scheduledAt?.toISOString() ?? null,
      venue_name: match.venueName,
      court_name: match.courtName,
      notes: match.notes,
      completed_at: match.completedAt?.toISOString() ?? null,
      winner_match_entrant_id: this.findWinnerEntrantId(match),
      result_notes: match.resultNotes,
      entrants: match.entrants.map((entrant) => this.toEntrant(entrant)),
      created_at: match.createdAt.toISOString(),
      updated_at: match.updatedAt.toISOString()
    };
  }

  private toEntrant(
    entrant: MatchEntrant & {
      participant: Participant | null;
      team: Team | null;
      score: { score: number; isWinner: boolean } | null;
    }
  ): FixtureEntrantDto {
    return {
      id: entrant.id,
      slot_number: entrant.slotNumber,
      is_bye: entrant.isBye,
      participant_id: entrant.participantId,
      team_id: entrant.teamId,
      display_name: entrant.isBye
        ? "BYE"
        : entrant.participant?.displayName ?? entrant.team?.name ?? "Unassigned",
      seed: entrant.team?.seed ?? null,
      score: entrant.score?.score ?? null,
      is_winner: entrant.score?.isWinner ?? false
    };
  }

  private findWinnerEntrantId(match: OrganizerFixtureMatch): string | null {
    return match.entrants.find((entrant) => entrant.score?.isWinner)?.id ?? null;
  }

  private toRoundRobinStandings(fixtureSet: OrganizerFixtureSetDetail): RoundRobinStandingDto[] {
    if (fixtureSet.format !== FixtureFormat.ROUND_ROBIN) {
      return [];
    }

    const standings = new Map<string, RoundRobinStandingDto>();
    const getEntrantKey = (entrant: OrganizerFixtureMatch["entrants"][number]) => {
      if (fixtureSet.entrantType === FixtureEntrantType.PARTICIPANT && entrant.participantId) {
        return entrant.participantId;
      }
      if (fixtureSet.entrantType === FixtureEntrantType.TEAM && entrant.teamId) {
        return entrant.teamId;
      }
      return null;
    };

    const ensureStanding = (entrant: OrganizerFixtureMatch["entrants"][number]) => {
      const key = getEntrantKey(entrant);
      if (!key) {
        return null;
      }
      const existing = standings.get(key);
      if (existing) {
        return existing;
      }
      const standing: RoundRobinStandingDto = {
        entrant_id: key,
        entrant_type: this.toApiEnum(fixtureSet.entrantType),
        display_name: entrant.participant?.displayName ?? entrant.team?.name ?? "Unassigned",
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        score_for: 0,
        score_against: 0,
        score_difference: 0
      };
      standings.set(key, standing);
      return standing;
    };

    const matches = fixtureSet.rounds.flatMap((round) => round.matches);
    for (const match of matches) {
      const realEntrants = match.entrants.filter((entrant) => !entrant.isBye);
      realEntrants.forEach((entrant) => ensureStanding(entrant));

      if (match.status !== MatchStatus.COMPLETED) {
        continue;
      }

      const scoredEntrants = realEntrants.filter((entrant) => entrant.score);
      if (scoredEntrants.length < 2) {
        continue;
      }

      const winnerEntrantId = this.findWinnerEntrantId(match);
      for (const entrant of scoredEntrants) {
        const standing = ensureStanding(entrant);
        if (!standing || !entrant.score) {
          continue;
        }

        const opponentScore = scoredEntrants
          .filter((opponent) => opponent.id !== entrant.id)
          .reduce((total, opponent) => total + (opponent.score?.score ?? 0), 0);
        standing.played += 1;
        standing.score_for += entrant.score.score;
        standing.score_against += opponentScore;
        standing.score_difference = standing.score_for - standing.score_against;

        if (!winnerEntrantId) {
          standing.draws += 1;
          standing.points += 1;
        } else if (winnerEntrantId === entrant.id) {
          standing.wins += 1;
          standing.points += 3;
        } else {
          standing.losses += 1;
        }
      }
    }

    return Array.from(standings.values()).sort((first, second) => {
      if (second.points !== first.points) return second.points - first.points;
      if (second.wins !== first.wins) return second.wins - first.wins;
      if (second.score_difference !== first.score_difference) return second.score_difference - first.score_difference;
      if (second.score_for !== first.score_for) return second.score_for - first.score_for;
      return first.display_name.localeCompare(second.display_name);
    });
  }

  private toCategorySummary(category: TournamentCategory): RegistrationCategorySummaryDto {
    return {
      id: category.id,
      name: category.name,
      code: category.code,
      format_type: this.toApiEnum(category.formatType),
      participant_type: this.toApiEnum(category.participantType),
      gender_type: this.toApiEnum(category.genderType),
      entry_fee_amount: category.entryFeeAmount,
      entry_fee_currency: category.entryFeeCurrency
    };
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
