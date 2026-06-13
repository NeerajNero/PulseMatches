import { Injectable } from "@nestjs/common";
import {
  PaymentProvider,
  Prisma,
  RegistrationStatus,
  TournamentCategoryStatus,
  TournamentStatus,
  TournamentVisibility
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const registrationInclude = {
  paymentRecord: {
    include: {
      paymentRefunds: {
        orderBy: { createdAt: "desc" as const }
      }
    }
  },
  paymentIntents: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    include: {
      _count: {
        select: {
          events: true,
          attempts: true
        }
      }
    }
  },
  tournament: {
    include: {
      sport: true,
      city: true,
      venue: true,
      organizerProfile: true
    }
  },
  tournamentCategory: true
} satisfies Prisma.RegistrationInclude;

export const tournamentRegistrationInclude = {
  sport: true,
  city: true,
  venue: true,
  organizerProfile: true,
  categories: {
    where: { status: TournamentCategoryStatus.ACTIVE },
    orderBy: { name: "asc" as const }
  }
} satisfies Prisma.TournamentInclude;

export type RegistrationWithRelations = Prisma.RegistrationGetPayload<{ include: typeof registrationInclude }>;
export type TournamentWithRegistrationRelations = Prisma.TournamentGetPayload<{
  include: typeof tournamentRegistrationInclude;
}>;

@Injectable()
export class RegistrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        displayName: true,
        email: true,
        status: true
      }
    });
  }

  findPublicTournamentBySlug(slug: string) {
    return this.prisma.tournament.findFirst({
      where: {
        slug,
        status: TournamentStatus.PUBLISHED,
        visibility: TournamentVisibility.PUBLIC
      },
      include: tournamentRegistrationInclude
    });
  }

  findPublicTournamentById(id: string) {
    return this.prisma.tournament.findFirst({
      where: {
        id,
        status: TournamentStatus.PUBLISHED,
        visibility: TournamentVisibility.PUBLIC
      },
      include: tournamentRegistrationInclude
    });
  }

  findActiveRegistration(input: {
    userId: string;
    tournamentId: string;
    tournamentCategoryId: string | null;
    statuses: RegistrationStatus[];
  }) {
    return this.prisma.registration.findFirst({
      where: {
        userId: input.userId,
        tournamentId: input.tournamentId,
        tournamentCategoryId: input.tournamentCategoryId,
        status: { in: input.statuses }
      },
      include: registrationInclude
    });
  }

  countActiveCategoryRegistrations(input: { tournamentCategoryId: string; statuses: RegistrationStatus[] }) {
    return this.prisma.registration.count({
      where: {
        tournamentCategoryId: input.tournamentCategoryId,
        status: { in: input.statuses }
      }
    });
  }

  createRegistration(input: Prisma.RegistrationUncheckedCreateInput) {
    return this.prisma.$transaction(async (transaction) => {
      const registration = await transaction.registration.create({
        data: input
      });

      await transaction.paymentRecord.create({
        data: {
          registrationId: registration.id,
          tournamentId: registration.tournamentId,
          tournamentCategoryId: registration.tournamentCategoryId,
          userId: registration.userId,
          provider: PaymentProvider.MANUAL,
          mode: registration.paymentMode,
          status: registration.paymentStatus,
          amount: registration.feeAmount,
          currency: registration.feeCurrency
        }
      });

      return transaction.registration.findUniqueOrThrow({
        where: { id: registration.id },
        include: registrationInclude
      });
    });
  }

  findRegistrationsByUser(userId: string) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: registrationInclude,
      orderBy: { createdAt: "desc" }
    });
  }

  findRegistrationById(id: string) {
    return this.prisma.registration.findUnique({
      where: { id },
      include: registrationInclude
    });
  }

  cancelRegistration(id: string) {
    return this.prisma.registration.update({
      where: { id },
      data: {
        status: RegistrationStatus.CANCELLED,
        cancelledAt: new Date()
      },
      include: registrationInclude
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
}
