import { Injectable } from "@nestjs/common";
import {
  PaymentProvider,
  PaymentRefundStatus,
  ParticipantSource,
  Prisma,
  RegistrationPaymentMode,
  RegistrationPaymentStatus,
  RegistrationStatus,
  RosterParticipantStatus,
  TeamStatus
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const organizerRegistrationInclude = {
  user: true,
  tournamentCategory: true,
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
  participant: {
    select: { id: true }
  }
} satisfies Prisma.RegistrationInclude;

export const organizerPaymentDetailInclude = {
  user: true,
  tournamentCategory: true,
  paymentRecord: {
    include: {
      paymentRefunds: {
        orderBy: { createdAt: "desc" as const }
      }
    }
  },
  paymentIntents: {
    orderBy: { createdAt: "desc" as const },
    include: {
      attempts: {
        orderBy: { createdAt: "desc" as const }
      },
      events: {
        orderBy: { createdAt: "desc" as const },
        take: 25
      },
      refunds: {
        orderBy: { createdAt: "desc" as const }
      },
      _count: {
        select: {
          events: true,
          attempts: true
        }
      }
    }
  },
  paymentEvents: {
    orderBy: { createdAt: "desc" as const },
    take: 50
  },
  paymentRefunds: {
    orderBy: { createdAt: "desc" as const }
  },
  participant: {
    select: { id: true }
  }
} satisfies Prisma.RegistrationInclude;

export const organizerParticipantInclude = {
  user: true,
  tournamentCategory: true,
  registration: {
    select: {
      id: true,
      status: true
    }
  }
} satisfies Prisma.ParticipantInclude;

export const organizerTeamMemberInclude = {
  participant: true,
  user: true
} satisfies Prisma.TeamMemberInclude;

export const organizerTeamInclude = {
  tournamentCategory: true,
  members: {
    include: organizerTeamMemberInclude,
    orderBy: [
      { role: "asc" as const },
      { displayName: "asc" as const }
    ]
  }
} satisfies Prisma.TeamInclude;

export type OrganizerRegistrationWithRelations = Prisma.RegistrationGetPayload<{
  include: typeof organizerRegistrationInclude;
}>;

export type OrganizerPaymentDetailWithRelations = Prisma.RegistrationGetPayload<{
  include: typeof organizerPaymentDetailInclude;
}>;

export type OrganizerParticipantWithRelations = Prisma.ParticipantGetPayload<{
  include: typeof organizerParticipantInclude;
}>;

export type OrganizerTeamWithRelations = Prisma.TeamGetPayload<{
  include: typeof organizerTeamInclude;
}>;

export type OrganizerTeamMemberWithRelations = Prisma.TeamMemberGetPayload<{
  include: typeof organizerTeamMemberInclude;
}>;

@Injectable()
export class OrganizerRostersRepository {
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

  countRegistrations(where: Prisma.RegistrationWhereInput) {
    return this.prisma.registration.count({ where });
  }

  findRegistrations(where: Prisma.RegistrationWhereInput, take?: number) {
    return this.prisma.registration.findMany({
      where,
      include: organizerRegistrationInclude,
      orderBy: [
        { createdAt: "desc" },
        { playerName: "asc" }
      ],
      take
    });
  }

  findPayments(where: Prisma.RegistrationWhereInput, take?: number) {
    return this.prisma.registration.findMany({
      where,
      include: organizerRegistrationInclude,
      orderBy: [
        { updatedAt: "desc" },
        { createdAt: "desc" },
        { playerName: "asc" }
      ],
      take
    });
  }

  findRegistrationById(registrationId: string) {
    return this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: organizerRegistrationInclude
    });
  }

  findPaymentDetailByRegistrationId(registrationId: string) {
    return this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: organizerPaymentDetailInclude
    });
  }

  approveRegistrationAndCreateParticipant(input: {
    registrationId: string;
    participant: Prisma.ParticipantUncheckedCreateInput;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.registration.update({
        where: { id: input.registrationId },
        data: { status: RegistrationStatus.CONFIRMED },
        include: organizerRegistrationInclude
      });

      await transaction.participant.upsert({
        where: { registrationId: input.registrationId },
        update: { status: RosterParticipantStatus.ACTIVE },
        create: input.participant
      });

      return transaction.registration.findUniqueOrThrow({
        where: { id: input.registrationId },
        include: organizerRegistrationInclude
      });
    });
  }

  updateRegistrationStatus(registrationId: string, data: Prisma.RegistrationUncheckedUpdateInput) {
    return this.prisma.registration.update({
      where: { id: registrationId },
      data,
      include: organizerRegistrationInclude
    });
  }

  updateRegistrationPayment(input: {
    registrationId: string;
    status: RegistrationPaymentStatus;
    reference?: string | null;
    internalNotes?: string | null;
    paidAt?: Date | null;
    verifiedByOrganizerUserId: string;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const registration = await transaction.registration.update({
        where: { id: input.registrationId },
        data: {
          paymentMode: RegistrationPaymentMode.OFFLINE,
          paymentStatus: input.status
        }
      });

      await transaction.paymentRecord.upsert({
        where: { registrationId: input.registrationId },
        update: {
          status: input.status,
          provider: PaymentProvider.MANUAL,
          mode: RegistrationPaymentMode.OFFLINE,
          amount: registration.feeAmount,
          currency: registration.feeCurrency,
          reference: input.reference,
          internalNotes: input.internalNotes,
          paidAt: input.paidAt,
          verifiedByOrganizerUserId: input.verifiedByOrganizerUserId
        },
        create: {
          registrationId: registration.id,
          tournamentId: registration.tournamentId,
          tournamentCategoryId: registration.tournamentCategoryId,
          userId: registration.userId,
          provider: PaymentProvider.MANUAL,
          mode: RegistrationPaymentMode.OFFLINE,
          status: input.status,
          amount: registration.feeAmount,
          currency: registration.feeCurrency,
          reference: input.reference,
          internalNotes: input.internalNotes,
          paidAt: input.paidAt,
          verifiedByOrganizerUserId: input.verifiedByOrganizerUserId
        }
      });

      return transaction.registration.findUniqueOrThrow({
        where: { id: input.registrationId },
        include: organizerRegistrationInclude
      });
    });
  }

  createPaymentRefund(input: {
    registrationId: string;
    amount: number;
    status: PaymentRefundStatus;
    reason?: string | null;
    internalNotes?: string | null;
    requestedByUserId: string;
    processedByUserId?: string | null;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const registration = await transaction.registration.findUniqueOrThrow({
        where: { id: input.registrationId },
        include: organizerPaymentDetailInclude
      });
      const paymentRecord = registration.paymentRecord;
      if (!paymentRecord) {
        throw new Error("Payment record not found");
      }
      const latestIntent = registration.paymentIntents[0] ?? null;
      const processedAt = input.status === PaymentRefundStatus.MANUAL_RECORDED
        || input.status === PaymentRefundStatus.SUCCEEDED
        ? new Date()
        : null;

      const refund = await transaction.paymentRefund.create({
        data: {
          paymentRecordId: paymentRecord.id,
          paymentIntentId: latestIntent?.id ?? null,
          registrationId: registration.id,
          tournamentId: registration.tournamentId,
          tournamentCategoryId: registration.tournamentCategoryId,
          userId: registration.userId,
          provider: paymentRecord.provider,
          status: input.status,
          amount: input.amount,
          currency: paymentRecord.currency,
          reason: input.reason,
          internalNotes: input.internalNotes,
          requestedByUserId: input.requestedByUserId,
          processedByUserId: input.processedByUserId ?? null,
          processedAt
        }
      });

      await transaction.paymentEvent.create({
        data: {
          paymentIntentId: latestIntent?.id ?? null,
          paymentRecordId: paymentRecord.id,
          registrationId: registration.id,
          tournamentId: registration.tournamentId,
          tournamentCategoryId: registration.tournamentCategoryId,
          provider: paymentRecord.provider,
          eventType: input.status === PaymentRefundStatus.MANUAL_RECORDED
            ? "refund.manual_recorded"
            : "refund.requested",
          providerEventId: refund.id,
          payload: {
            refund_id: refund.id,
            amount: refund.amount,
            currency: refund.currency,
            status: refund.status
          },
          processedAt
        }
      });

      if (input.status === PaymentRefundStatus.MANUAL_RECORDED) {
        const aggregate = await transaction.paymentRefund.aggregate({
          where: {
            paymentRecordId: paymentRecord.id,
            status: { in: [PaymentRefundStatus.MANUAL_RECORDED, PaymentRefundStatus.SUCCEEDED] }
          },
          _sum: { amount: true }
        });
        const refundedAmount = aggregate._sum.amount ?? 0;
        if (refundedAmount >= paymentRecord.amount) {
          await transaction.paymentRecord.update({
            where: { id: paymentRecord.id },
            data: { status: RegistrationPaymentStatus.REFUNDED }
          });
          await transaction.registration.update({
            where: { id: registration.id },
            data: { paymentStatus: RegistrationPaymentStatus.REFUNDED }
          });
        }
      }

      return transaction.registration.findUniqueOrThrow({
        where: { id: registration.id },
        include: organizerPaymentDetailInclude
      });
    });
  }

  countParticipants(where: Prisma.ParticipantWhereInput) {
    return this.prisma.participant.count({ where });
  }

  findParticipants(where: Prisma.ParticipantWhereInput, take?: number) {
    return this.prisma.participant.findMany({
      where,
      include: organizerParticipantInclude,
      orderBy: [
        { createdAt: "desc" },
        { displayName: "asc" }
      ],
      take
    });
  }

  findParticipantById(participantId: string) {
    return this.prisma.participant.findUnique({
      where: { id: participantId },
      include: organizerParticipantInclude
    });
  }

  createParticipant(input: Prisma.ParticipantUncheckedCreateInput) {
    return this.prisma.participant.create({
      data: input,
      include: organizerParticipantInclude
    });
  }

  updateParticipant(participantId: string, input: Prisma.ParticipantUncheckedUpdateInput) {
    return this.prisma.participant.update({
      where: { id: participantId },
      data: input,
      include: organizerParticipantInclude
    });
  }

  countTeams(where: Prisma.TeamWhereInput) {
    return this.prisma.team.count({ where });
  }

  findTeams(where: Prisma.TeamWhereInput, take?: number) {
    return this.prisma.team.findMany({
      where,
      include: organizerTeamInclude,
      orderBy: [
        { createdAt: "desc" },
        { name: "asc" }
      ],
      take
    });
  }

  findTeamById(teamId: string) {
    return this.prisma.team.findUnique({
      where: { id: teamId },
      include: organizerTeamInclude
    });
  }

  findActiveTeamByName(input: {
    tournamentId: string;
    tournamentCategoryId: string | null;
    name: string;
  }) {
    return this.prisma.team.findFirst({
      where: {
        tournamentId: input.tournamentId,
        tournamentCategoryId: input.tournamentCategoryId,
        name: { equals: input.name, mode: "insensitive" },
        status: TeamStatus.ACTIVE
      },
      select: { id: true }
    });
  }

  createTeam(input: Prisma.TeamUncheckedCreateInput) {
    return this.prisma.team.create({
      data: input,
      include: organizerTeamInclude
    });
  }

  updateTeam(teamId: string, input: Prisma.TeamUncheckedUpdateInput) {
    return this.prisma.team.update({
      where: { id: teamId },
      data: input,
      include: organizerTeamInclude
    });
  }

  findTeamMemberById(memberId: string) {
    return this.prisma.teamMember.findUnique({
      where: { id: memberId },
      include: {
        ...organizerTeamMemberInclude,
        team: true
      }
    });
  }

  findTeamMemberByParticipant(teamId: string, participantId: string) {
    return this.prisma.teamMember.findFirst({
      where: { teamId, participantId },
      select: { id: true }
    });
  }

  createTeamMember(input: Prisma.TeamMemberUncheckedCreateInput) {
    return this.prisma.teamMember.create({
      data: input,
      include: organizerTeamMemberInclude
    });
  }

  updateTeamMember(memberId: string, input: Prisma.TeamMemberUncheckedUpdateInput) {
    return this.prisma.teamMember.update({
      where: { id: memberId },
      data: input,
      include: organizerTeamMemberInclude
    });
  }

  deleteTeamMember(memberId: string) {
    return this.prisma.teamMember.delete({
      where: { id: memberId },
      include: organizerTeamMemberInclude
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

  getManualParticipantSource() {
    return ParticipantSource.MANUAL;
  }
}
