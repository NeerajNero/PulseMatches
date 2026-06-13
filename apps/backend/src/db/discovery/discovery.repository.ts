import { Injectable } from "@nestjs/common";
import {
  CatalogStatus,
  FixtureSetStatus,
  Prisma,
  TournamentCategoryStatus,
  TournamentStatus,
  TournamentVisibility
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const tournamentListInclude = {
  sport: true,
  city: true,
  venue: true,
  organizerProfile: true,
  categories: {
    where: { status: TournamentCategoryStatus.ACTIVE },
    orderBy: { name: "asc" as const }
  },
  media: {
    orderBy: { sortOrder: "asc" as const }
  }
} satisfies Prisma.TournamentInclude;

export type TournamentWithDiscoveryRelations = Prisma.TournamentGetPayload<{ include: typeof tournamentListInclude }>;

export const publicFixtureSetInclude = {
  tournamentCategory: true,
  rounds: {
    include: {
      matches: {
        include: {
          entrants: {
            include: {
              participant: {
                select: {
                  id: true,
                  displayName: true
                }
              },
              team: {
                select: {
                  id: true,
                  name: true,
                  seed: true
                }
              },
              score: true
            },
            orderBy: { slotNumber: "asc" as const }
          }
        },
        orderBy: { matchNumber: "asc" as const }
      }
    },
    orderBy: { roundNumber: "asc" as const }
  }
} satisfies Prisma.FixtureSetInclude;

export type PublicFixtureSetWithRelations = Prisma.FixtureSetGetPayload<{ include: typeof publicFixtureSetInclude }>;

@Injectable()
export class DiscoveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveSports() {
    return this.prisma.sport.findMany({
      where: { status: CatalogStatus.ACTIVE },
      orderBy: { name: "asc" }
    });
  }

  findActiveCities() {
    return this.prisma.city.findMany({
      where: { status: CatalogStatus.ACTIVE },
      orderBy: { name: "asc" }
    });
  }

  countPublicTournaments(where: Prisma.TournamentWhereInput) {
    return this.prisma.tournament.count({ where });
  }

  findPublicTournaments(input: {
    where: Prisma.TournamentWhereInput;
    skip: number;
    take: number;
  }) {
    return this.prisma.tournament.findMany({
      where: input.where,
      include: tournamentListInclude,
      skip: input.skip,
      take: input.take,
      orderBy: [
        { startsAt: "asc" },
        { title: "asc" }
      ]
    });
  }

  findPublicTournamentBySlug(slug: string) {
    return this.prisma.tournament.findFirst({
      where: {
        slug,
        status: TournamentStatus.PUBLISHED,
        visibility: TournamentVisibility.PUBLIC
      },
      include: tournamentListInclude
    });
  }

  findPublicTournamentById(id: string) {
    return this.prisma.tournament.findFirst({
      where: {
        id,
        status: TournamentStatus.PUBLISHED,
        visibility: TournamentVisibility.PUBLIC
      },
      include: tournamentListInclude
    });
  }

  findPublicFixtureSetsByTournament(tournamentWhere: Prisma.TournamentWhereInput) {
    return this.prisma.fixtureSet.findMany({
      where: {
        status: { not: FixtureSetStatus.ARCHIVED },
        publishedAt: { not: null },
        tournament: tournamentWhere
      },
      include: publicFixtureSetInclude,
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
        { name: "asc" }
      ]
    });
  }
}
