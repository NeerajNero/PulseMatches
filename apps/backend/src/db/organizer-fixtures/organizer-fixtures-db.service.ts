import { Injectable } from "@nestjs/common";
import { FixtureEntrantType, FixtureFormat, FixtureRoundStage, MatchStatus, Prisma } from "@prisma/client";
import { GeneratedRoundInput, OrganizerFixturesRepository } from "./organizer-fixtures.repository";

@Injectable()
export class OrganizerFixturesDbService {
  constructor(private readonly organizerFixturesRepository: OrganizerFixturesRepository) {}

  findOrganizerProfileByUserId(userId: string) {
    return this.organizerFixturesRepository.findOrganizerProfileByUserId(userId);
  }

  findOwnedTournament(id: string, organizerProfileId: string) {
    return this.organizerFixturesRepository.findOwnedTournament(id, organizerProfileId);
  }

  findCategoryById(categoryId: string) {
    return this.organizerFixturesRepository.findCategoryById(categoryId);
  }

  findActiveParticipantsForCategory(tournamentId: string, tournamentCategoryId: string) {
    return this.organizerFixturesRepository.findActiveParticipantsForCategory(tournamentId, tournamentCategoryId);
  }

  findActiveTeamsForCategory(tournamentId: string, tournamentCategoryId: string) {
    return this.organizerFixturesRepository.findActiveTeamsForCategory(tournamentId, tournamentCategoryId);
  }

  findFixtureSetsByTournament(tournamentId: string) {
    return this.organizerFixturesRepository.findFixtureSetsByTournament(tournamentId);
  }

  findActiveFixtureSets(input: {
    tournamentId: string;
    tournamentCategoryId: string;
    format: FixtureFormat;
    entrantType: FixtureEntrantType;
  }) {
    return this.organizerFixturesRepository.findActiveFixtureSets(input);
  }

  findFixtureSetById(fixtureSetId: string) {
    return this.organizerFixturesRepository.findFixtureSetById(fixtureSetId);
  }

  findMatchById(matchId: string) {
    return this.organizerFixturesRepository.findMatchById(matchId);
  }

  createGeneratedFixtureSet(input: {
    tournamentId: string;
    tournamentCategoryId: string;
    format: FixtureFormat;
    entrantType: FixtureEntrantType;
    name?: string;
    archiveFixtureSetIds: string[];
    rounds: GeneratedRoundInput[];
  }) {
    return this.organizerFixturesRepository.createGeneratedFixtureSet(input);
  }

  updateMatchSchedule(matchId: string, input: Prisma.MatchUncheckedUpdateInput) {
    return this.organizerFixturesRepository.updateMatchSchedule(matchId, input);
  }

  saveMatchScores(input: {
    matchId: string;
    scores: Array<{
      matchEntrantId: string;
      score: number;
      isWinner: boolean;
    }>;
    resultNotes?: string | null;
  }) {
    return this.organizerFixturesRepository.saveMatchScores(input);
  }

  completeMatch(input: {
    matchId: string;
    scores: Array<{
      matchEntrantId: string;
      score: number;
      isWinner: boolean;
    }>;
    winnerParticipantId?: string | null;
    winnerTeamId?: string | null;
    resultNotes?: string | null;
  }) {
    return this.organizerFixturesRepository.completeMatch(input);
  }

  reopenMatch(matchId: string, status: MatchStatus) {
    return this.organizerFixturesRepository.reopenMatch(matchId, status);
  }

  advanceKnockoutWinner(input: {
    fixtureSetId: string;
    tournamentId: string;
    tournamentCategoryId: string;
    nextRoundNumber: number;
    nextRoundName: string;
    nextRoundStage: FixtureRoundStage;
    nextMatchPosition: number;
    nextSlotNumber: number;
    participantId?: string | null;
    teamId?: string | null;
  }) {
    return this.organizerFixturesRepository.advanceKnockoutWinner(input);
  }

  countDownstreamEntrants(input: {
    fixtureSetId: string;
    sourceFixtureRoundId: string;
    participantId?: string | null;
    teamId?: string | null;
  }) {
    return this.organizerFixturesRepository.countDownstreamEntrants(input);
  }

  updateFixtureSet(fixtureSetId: string, input: Prisma.FixtureSetUncheckedUpdateInput) {
    return this.organizerFixturesRepository.updateFixtureSet(fixtureSetId, input);
  }

  findResultsNotificationRecipients(input: { tournamentId: string; tournamentCategoryId: string }) {
    return this.organizerFixturesRepository.findResultsNotificationRecipients(input);
  }

  createAuditLog(input: Prisma.AuditLogUncheckedCreateInput) {
    return this.organizerFixturesRepository.createAuditLog(input);
  }
}
