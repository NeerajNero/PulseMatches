import { Injectable } from "@nestjs/common";
import {
  FixtureEntrantType,
  FixtureFormat,
  FixtureRoundStage,
  FixtureSetStatus,
  MatchStatus,
  Prisma,
  RegistrationStatus
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const organizerFixtureSetListInclude = {
  tournamentCategory: true,
  matches: {
    select: {
      id: true,
      status: true,
      scheduledAt: true,
      completedAt: true
    }
  }
} satisfies Prisma.FixtureSetInclude;

export const organizerFixtureEntrantInclude = {
  participant: true,
  team: true,
  score: true
} satisfies Prisma.MatchEntrantInclude;

export const organizerFixtureMatchInclude = {
  entrants: {
    include: organizerFixtureEntrantInclude,
    orderBy: { slotNumber: "asc" as const }
  }
} satisfies Prisma.MatchInclude;

export const organizerFixtureRoundInclude = {
  matches: {
    include: organizerFixtureMatchInclude,
    orderBy: { matchNumber: "asc" as const }
  }
} satisfies Prisma.FixtureRoundInclude;

export const organizerFixtureSetDetailInclude = {
  tournamentCategory: true,
  rounds: {
    include: organizerFixtureRoundInclude,
    orderBy: { roundNumber: "asc" as const }
  },
  matches: {
    include: organizerFixtureMatchInclude,
    orderBy: { matchNumber: "asc" as const }
  }
} satisfies Prisma.FixtureSetInclude;

export type OrganizerFixtureSetListItem = Prisma.FixtureSetGetPayload<{
  include: typeof organizerFixtureSetListInclude;
}>;

export type OrganizerFixtureSetDetail = Prisma.FixtureSetGetPayload<{
  include: typeof organizerFixtureSetDetailInclude;
}>;

export type OrganizerFixtureMatch = Prisma.MatchGetPayload<{
  include: typeof organizerFixtureMatchInclude;
}>;

export type OrganizerFixtureParticipantEntrant = Prisma.ParticipantGetPayload<{
  include: { tournamentCategory: true };
}>;

export type OrganizerFixtureTeamEntrant = Prisma.TeamGetPayload<{
  include: { tournamentCategory: true };
}>;

export type ResultsNotificationRecipient = Prisma.RegistrationGetPayload<{
  select: {
    id: true;
    userId: true;
    playerName: true;
    user: {
      select: {
        email: true;
        displayName: true;
      };
    };
  };
}>;

export interface GeneratedRoundInput {
  name: string;
  stage: Prisma.FixtureRoundCreateInput["stage"];
  matches: Array<{
    matchNumber: number;
    roundPosition: number;
    entrants: Array<{
      participantId?: string;
      teamId?: string;
      slotNumber: number;
      isBye: boolean;
    }>;
  }>;
}

@Injectable()
export class OrganizerFixturesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOrganizerProfileByUserId(userId: string) {
    return this.prisma.organizerProfile.findUnique({
      where: { userId }
    });
  }

  findOwnedTournament(id: string, organizerProfileId: string) {
    return this.prisma.tournament.findFirst({
      where: { id, organizerProfileId },
      include: {
        categories: true
      }
    });
  }

  findCategoryById(categoryId: string) {
    return this.prisma.tournamentCategory.findUnique({
      where: { id: categoryId }
    });
  }

  findActiveParticipantsForCategory(tournamentId: string, tournamentCategoryId: string) {
    return this.prisma.participant.findMany({
      where: {
        tournamentId,
        tournamentCategoryId,
        status: "ACTIVE"
      },
      include: { tournamentCategory: true },
      orderBy: [
        { createdAt: "asc" },
        { displayName: "asc" }
      ]
    });
  }

  findActiveTeamsForCategory(tournamentId: string, tournamentCategoryId: string) {
    return this.prisma.team.findMany({
      where: {
        tournamentId,
        tournamentCategoryId,
        status: "ACTIVE"
      },
      include: { tournamentCategory: true },
      orderBy: [
        { seed: { sort: "asc", nulls: "last" } },
        { createdAt: "asc" },
        { name: "asc" }
      ]
    });
  }

  findFixtureSetsByTournament(tournamentId: string) {
    return this.prisma.fixtureSet.findMany({
      where: { tournamentId },
      include: organizerFixtureSetListInclude,
      orderBy: [
        { createdAt: "desc" },
        { name: "asc" }
      ]
    });
  }

  findActiveFixtureSets(input: {
    tournamentId: string;
    tournamentCategoryId: string;
    format: FixtureFormat;
    entrantType: FixtureEntrantType;
  }) {
    return this.prisma.fixtureSet.findMany({
      where: {
        tournamentId: input.tournamentId,
        tournamentCategoryId: input.tournamentCategoryId,
        format: input.format,
        entrantType: input.entrantType,
        status: { not: FixtureSetStatus.ARCHIVED }
      },
      include: organizerFixtureSetListInclude,
      orderBy: { createdAt: "desc" }
    });
  }

  findFixtureSetById(fixtureSetId: string) {
    return this.prisma.fixtureSet.findUnique({
      where: { id: fixtureSetId },
      include: organizerFixtureSetDetailInclude
    });
  }

  findMatchById(matchId: string) {
    return this.prisma.match.findUnique({
      where: { id: matchId },
      include: organizerFixtureMatchInclude
    });
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
    return this.prisma.$transaction(async (transaction) => {
      if (input.archiveFixtureSetIds.length > 0) {
        await transaction.fixtureSet.updateMany({
          where: { id: { in: input.archiveFixtureSetIds } },
          data: { status: FixtureSetStatus.ARCHIVED }
        });
      }

      const fixtureSet = await transaction.fixtureSet.create({
        data: {
          tournamentId: input.tournamentId,
          tournamentCategoryId: input.tournamentCategoryId,
          format: input.format,
          entrantType: input.entrantType,
          status: FixtureSetStatus.GENERATED,
          name: input.name,
          generatedAt: new Date()
        }
      });

      for (let roundIndex = 0; roundIndex < input.rounds.length; roundIndex += 1) {
        const roundInput = input.rounds[roundIndex];
        const round = await transaction.fixtureRound.create({
          data: {
            fixtureSetId: fixtureSet.id,
            roundNumber: roundIndex + 1,
            name: roundInput.name,
            stage: roundInput.stage
          }
        });

        for (const matchInput of roundInput.matches) {
          await transaction.match.create({
            data: {
              fixtureSetId: fixtureSet.id,
              fixtureRoundId: round.id,
              tournamentId: input.tournamentId,
              tournamentCategoryId: input.tournamentCategoryId,
              matchNumber: matchInput.matchNumber,
              roundPosition: matchInput.roundPosition,
              entrants: {
                create: matchInput.entrants.map((entrant) => ({
                  participantId: entrant.participantId,
                  teamId: entrant.teamId,
                  slotNumber: entrant.slotNumber,
                  isBye: entrant.isBye
                }))
              }
            }
          });
        }
      }

      return transaction.fixtureSet.findUniqueOrThrow({
        where: { id: fixtureSet.id },
        include: organizerFixtureSetDetailInclude
      });
    });
  }

  updateMatchSchedule(matchId: string, input: Prisma.MatchUncheckedUpdateInput) {
    return this.prisma.match.update({
      where: { id: matchId },
      data: input,
      include: organizerFixtureMatchInclude
    });
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
    return this.prisma.$transaction(async (transaction) => {
      for (const scoreInput of input.scores) {
        await transaction.matchScore.upsert({
          where: { matchEntrantId: scoreInput.matchEntrantId },
          create: {
            matchId: input.matchId,
            matchEntrantId: scoreInput.matchEntrantId,
            score: scoreInput.score,
            isWinner: scoreInput.isWinner
          },
          update: {
            score: scoreInput.score,
            isWinner: scoreInput.isWinner
          }
        });
      }

      return transaction.match.update({
        where: { id: input.matchId },
        data: {
          resultNotes: input.resultNotes
        },
        include: organizerFixtureMatchInclude
      });
    });
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
    return this.prisma.$transaction(async (transaction) => {
      for (const scoreInput of input.scores) {
        await transaction.matchScore.upsert({
          where: { matchEntrantId: scoreInput.matchEntrantId },
          create: {
            matchId: input.matchId,
            matchEntrantId: scoreInput.matchEntrantId,
            score: scoreInput.score,
            isWinner: scoreInput.isWinner
          },
          update: {
            score: scoreInput.score,
            isWinner: scoreInput.isWinner
          }
        });
      }

      return transaction.match.update({
        where: { id: input.matchId },
        data: {
          status: MatchStatus.COMPLETED,
          completedAt: new Date(),
          winnerParticipantId: input.winnerParticipantId ?? null,
          winnerTeamId: input.winnerTeamId ?? null,
          resultNotes: input.resultNotes
        },
        include: organizerFixtureMatchInclude
      });
    });
  }

  reopenMatch(matchId: string, status: MatchStatus) {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.matchScore.updateMany({
        where: { matchId },
        data: { isWinner: false }
      });

      return transaction.match.update({
        where: { id: matchId },
        data: {
          status,
          completedAt: null,
          winnerParticipantId: null,
          winnerTeamId: null,
          resultNotes: null
        },
        include: organizerFixtureMatchInclude
      });
    });
  }

  findNextRound(input: { fixtureSetId: string; roundNumber: number }) {
    return this.prisma.fixtureRound.findUnique({
      where: {
        fixtureSetId_roundNumber: {
          fixtureSetId: input.fixtureSetId,
          roundNumber: input.roundNumber
        }
      },
      include: organizerFixtureRoundInclude
    });
  }

  findMatchByRoundPosition(input: { fixtureRoundId: string; roundPosition: number }) {
    return this.prisma.match.findUnique({
      where: {
        fixtureRoundId_roundPosition: {
          fixtureRoundId: input.fixtureRoundId,
          roundPosition: input.roundPosition
        }
      },
      include: organizerFixtureMatchInclude
    });
  }

  findMaxMatchNumber(fixtureSetId: string) {
    return this.prisma.match.aggregate({
      where: { fixtureSetId },
      _max: { matchNumber: true }
    });
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
    return this.prisma.$transaction(async (transaction) => {
      const nextRound = await transaction.fixtureRound.upsert({
        where: {
          fixtureSetId_roundNumber: {
            fixtureSetId: input.fixtureSetId,
            roundNumber: input.nextRoundNumber
          }
        },
        create: {
          fixtureSetId: input.fixtureSetId,
          roundNumber: input.nextRoundNumber,
          name: input.nextRoundName,
          stage: input.nextRoundStage
        },
        update: {
          name: input.nextRoundName,
          stage: input.nextRoundStage
        }
      });

      let nextMatch = await transaction.match.findUnique({
        where: {
          fixtureRoundId_roundPosition: {
            fixtureRoundId: nextRound.id,
            roundPosition: input.nextMatchPosition
          }
        },
        include: organizerFixtureMatchInclude
      });

      if (!nextMatch) {
        const maxMatch = await transaction.match.aggregate({
          where: { fixtureSetId: input.fixtureSetId },
          _max: { matchNumber: true }
        });

        nextMatch = await transaction.match.create({
          data: {
            fixtureSetId: input.fixtureSetId,
            fixtureRoundId: nextRound.id,
            tournamentId: input.tournamentId,
            tournamentCategoryId: input.tournamentCategoryId,
            matchNumber: (maxMatch._max.matchNumber ?? 0) + 1,
            roundPosition: input.nextMatchPosition,
            status: MatchStatus.UNSCHEDULED
          },
          include: organizerFixtureMatchInclude
        });
      }

      const existingSlot = nextMatch.entrants.find((entrant) => entrant.slotNumber === input.nextSlotNumber);
      if (existingSlot) {
        const sameParticipant = Boolean(input.participantId) && existingSlot.participantId === input.participantId;
        const sameTeam = Boolean(input.teamId) && existingSlot.teamId === input.teamId;
        if (!sameParticipant && !sameTeam) {
          throw new Error("next_slot_occupied");
        }
        return nextMatch;
      }

      await transaction.matchEntrant.create({
        data: {
          matchId: nextMatch.id,
          participantId: input.participantId ?? undefined,
          teamId: input.teamId ?? undefined,
          slotNumber: input.nextSlotNumber,
          isBye: false
        }
      });

      return transaction.match.findUniqueOrThrow({
        where: { id: nextMatch.id },
        include: organizerFixtureMatchInclude
      });
    });
  }

  countDownstreamEntrants(input: {
    fixtureSetId: string;
    sourceFixtureRoundId: string;
    participantId?: string | null;
    teamId?: string | null;
  }) {
    const entrantWhere: Prisma.MatchEntrantWhereInput[] = [];
    if (input.participantId) {
      entrantWhere.push({ participantId: input.participantId });
    }
    if (input.teamId) {
      entrantWhere.push({ teamId: input.teamId });
    }
    if (entrantWhere.length === 0) {
      return Promise.resolve(0);
    }

    return this.prisma.matchEntrant.count({
      where: {
        OR: entrantWhere,
        match: {
          fixtureSetId: input.fixtureSetId,
          fixtureRoundId: { not: input.sourceFixtureRoundId }
        }
      }
    });
  }

  updateFixtureSet(fixtureSetId: string, input: Prisma.FixtureSetUncheckedUpdateInput) {
    return this.prisma.fixtureSet.update({
      where: { id: fixtureSetId },
      data: input,
      include: organizerFixtureSetDetailInclude
    });
  }

  findResultsNotificationRecipients(input: { tournamentId: string; tournamentCategoryId: string }) {
    return this.prisma.registration.findMany({
      where: {
        tournamentId: input.tournamentId,
        tournamentCategoryId: input.tournamentCategoryId,
        status: RegistrationStatus.CONFIRMED
      },
      select: {
        id: true,
        userId: true,
        playerName: true,
        user: {
          select: {
            email: true,
            displayName: true
          }
        }
      },
      orderBy: [
        { registeredAt: "asc" },
        { playerName: "asc" }
      ]
    });
  }

  createAuditLog(input: Prisma.AuditLogUncheckedCreateInput) {
    return this.prisma.auditLog.create({ data: input });
  }
}
