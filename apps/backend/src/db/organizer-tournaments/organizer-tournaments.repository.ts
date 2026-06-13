import { Injectable } from "@nestjs/common";
import {
  CatalogStatus,
  Prisma,
  RegistrationStatus,
  TournamentCategoryStatus,
  TournamentStatus,
  TournamentVisibility
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const organizerTournamentInclude = {
  sport: true,
  city: true,
  venue: true,
  organizerProfile: true,
  categories: {
    orderBy: { name: "asc" as const }
  },
  registrations: {
    where: { status: RegistrationStatus.PENDING },
    select: { id: true }
  },
  _count: {
    select: { registrations: true }
  }
} satisfies Prisma.TournamentInclude;

export type OrganizerTournamentWithRelations = Prisma.TournamentGetPayload<{
  include: typeof organizerTournamentInclude;
}>;

@Injectable()
export class OrganizerTournamentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOrganizerProfileByUserId(userId: string) {
    return this.prisma.organizerProfile.findUnique({
      where: { userId }
    });
  }

  findSportById(id: string) {
    return this.prisma.sport.findFirst({
      where: { id, status: CatalogStatus.ACTIVE }
    });
  }

  findCityById(id: string) {
    return this.prisma.city.findFirst({
      where: { id, status: CatalogStatus.ACTIVE }
    });
  }

  findVenueById(id: string) {
    return this.prisma.venue.findFirst({
      where: { id, status: CatalogStatus.ACTIVE }
    });
  }

  findTournamentBySlug(slug: string) {
    return this.prisma.tournament.findUnique({
      where: { slug },
      select: { id: true }
    });
  }

  countTournaments(where: Prisma.TournamentWhereInput) {
    return this.prisma.tournament.count({ where });
  }

  findOrganizerTournaments(input: {
    where: Prisma.TournamentWhereInput;
    skip: number;
    take: number;
  }) {
    return this.prisma.tournament.findMany({
      where: input.where,
      include: organizerTournamentInclude,
      skip: input.skip,
      take: input.take,
      orderBy: [
        { updatedAt: "desc" },
        { startsAt: "asc" }
      ]
    });
  }

  findOwnedTournament(id: string, organizerProfileId: string) {
    return this.prisma.tournament.findFirst({
      where: { id, organizerProfileId },
      include: organizerTournamentInclude
    });
  }

  createTournament(input: Prisma.TournamentUncheckedCreateInput) {
    return this.prisma.tournament.create({
      data: input,
      include: organizerTournamentInclude
    });
  }

  updateTournament(id: string, input: Prisma.TournamentUncheckedUpdateInput) {
    return this.prisma.tournament.update({
      where: { id },
      data: input,
      include: organizerTournamentInclude
    });
  }

  countOrganizerRegistrations(organizerProfileId: string, status?: RegistrationStatus) {
    return this.prisma.registration.count({
      where: {
        status,
        tournament: { organizerProfileId }
      }
    });
  }

  countActiveTournamentRegistrations(tournamentId: string) {
    return this.prisma.registration.count({
      where: {
        tournamentId,
        status: { in: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED] }
      }
    });
  }

  countActiveCategoryRegistrations(tournamentCategoryId: string) {
    return this.prisma.registration.count({
      where: {
        tournamentCategoryId,
        status: { in: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED] }
      }
    });
  }

  findCategoryById(categoryId: string) {
    return this.prisma.tournamentCategory.findUnique({
      where: { id: categoryId },
      include: {
        tournament: {
          select: {
            id: true,
            organizerProfileId: true
          }
        },
        registrations: {
          where: { status: RegistrationStatus.PENDING },
          select: { id: true }
        }
      }
    });
  }

  findCategoryByCode(tournamentId: string, code: string) {
    return this.prisma.tournamentCategory.findUnique({
      where: {
        tournamentId_code: {
          tournamentId,
          code
        }
      },
      select: { id: true }
    });
  }

  createCategory(input: Prisma.TournamentCategoryUncheckedCreateInput) {
    return this.prisma.tournamentCategory.create({
      data: input
    });
  }

  updateCategory(id: string, input: Prisma.TournamentCategoryUncheckedUpdateInput) {
    return this.prisma.tournamentCategory.update({
      where: { id },
      data: input
    });
  }

  deactivateCategory(id: string) {
    return this.prisma.tournamentCategory.update({
      where: { id },
      data: { status: TournamentCategoryStatus.INACTIVE }
    });
  }

  createAuditLog(input: {
    actorId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        metadata: input.metadata
      }
    });
  }

  getPublishedStatusData() {
    return {
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      publishedAt: new Date()
    };
  }
}
