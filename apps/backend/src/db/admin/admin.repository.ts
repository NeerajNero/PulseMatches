import { Injectable } from "@nestjs/common";
import {
  NotificationStatus,
  PaymentIntentStatus,
  OrganizerVerificationStatus,
  PaymentRefundStatus,
  RegistrationPaymentStatus,
  Prisma
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const adminUserInclude = {
  roles: {
    select: { role: true }
  },
  organizerProfile: {
    select: {
      id: true,
      organizationName: true,
      verificationStatus: true,
      status: true
    }
  },
  _count: {
    select: { registrations: true }
  }
} satisfies Prisma.UserInclude;

export const adminOrganizerInclude = {
  user: {
    select: {
      id: true,
      email: true,
      displayName: true
    }
  },
  _count: {
    select: { tournaments: true }
  }
} satisfies Prisma.OrganizerProfileInclude;

export const adminOrganizerDetailInclude = {
  user: {
    select: {
      id: true,
      email: true,
      displayName: true
    }
  },
  tournaments: {
    orderBy: { createdAt: "desc" as const },
    take: 25,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      _count: {
        select: { registrations: true }
      }
    }
  },
  _count: {
    select: { tournaments: true }
  }
} satisfies Prisma.OrganizerProfileInclude;

export const adminTournamentInclude = {
  sport: true,
  city: true,
  organizerProfile: {
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true
        }
      }
    }
  },
  _count: {
    select: { registrations: true }
  }
} satisfies Prisma.TournamentInclude;

export const adminRegistrationInclude = {
  user: {
    select: {
      id: true,
      email: true,
      displayName: true
    }
  },
  tournament: {
    select: {
      id: true,
      title: true
    }
  },
  tournamentCategory: {
    select: {
      id: true,
      name: true
    }
  },
  paymentRecord: {
    select: {
      status: true
    }
  }
} satisfies Prisma.RegistrationInclude;

export const adminPaymentInclude = {
  registration: {
    select: {
      id: true,
      playerName: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          displayName: true
        }
      },
      tournament: {
        select: {
          id: true,
          title: true
        }
      },
      tournamentCategory: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  paymentIntents: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
    select: {
      status: true
    }
  },
  paymentRefunds: {
    orderBy: { createdAt: "desc" as const },
    select: {
      status: true,
      amount: true
    }
  },
  _count: {
    select: {
      paymentEvents: true,
      paymentRefunds: true
    }
  }
} satisfies Prisma.PaymentRecordInclude;

export const adminPaymentDetailInclude = {
  registration: {
    select: {
      id: true,
      playerName: true,
      status: true,
      user: {
        select: {
          id: true,
          email: true,
          displayName: true
        }
      },
      tournament: {
        select: {
          id: true,
          title: true
        }
      },
      tournamentCategory: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  paymentIntents: {
    orderBy: { createdAt: "desc" as const },
    include: {
      attempts: {
        orderBy: { createdAt: "desc" as const },
        take: 25
      },
      events: {
        orderBy: { createdAt: "desc" as const },
        take: 25
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
  _count: {
    select: {
      paymentEvents: true,
      paymentRefunds: true
    }
  }
} satisfies Prisma.PaymentRecordInclude;

export const adminAuditInclude = {
  actor: {
    select: {
      id: true,
      email: true,
      displayName: true
    }
  }
} satisfies Prisma.AuditLogInclude;

export type AdminUserWithRelations = Prisma.UserGetPayload<{ include: typeof adminUserInclude }>;
export type AdminOrganizerWithRelations = Prisma.OrganizerProfileGetPayload<{ include: typeof adminOrganizerInclude }>;
export type AdminOrganizerDetailWithRelations = Prisma.OrganizerProfileGetPayload<{ include: typeof adminOrganizerDetailInclude }> & {
  auditEvents: AdminAuditWithRelations[];
};
export type AdminTournamentWithRelations = Prisma.TournamentGetPayload<{ include: typeof adminTournamentInclude }>;
export type AdminRegistrationWithRelations = Prisma.RegistrationGetPayload<{ include: typeof adminRegistrationInclude }>;
export type AdminPaymentWithRelations = Prisma.PaymentRecordGetPayload<{ include: typeof adminPaymentInclude }>;
export type AdminPaymentDetailWithRelations = Prisma.PaymentRecordGetPayload<{ include: typeof adminPaymentDetailInclude }>;
export type AdminAuditWithRelations = Prisma.AuditLogGetPayload<{ include: typeof adminAuditInclude }>;

export interface PaginationInput {
  page?: number;
  limit?: number;
  skip: number;
  take: number;
}

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardCounts() {
    const [
      totalUsers,
      totalOrganizers,
      totalTournaments,
      publishedTournaments,
      draftTournaments,
      totalRegistrations,
      pendingRegistrations,
      paidPayments,
      pendingPayments,
      failedPayments,
      refundCount,
      pendingNotifications,
      failedNotifications,
      recentReconciliation
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organizerProfile.count(),
      this.prisma.tournament.count(),
      this.prisma.tournament.count({ where: { status: "PUBLISHED" } }),
      this.prisma.tournament.count({ where: { status: "DRAFT" } }),
      this.prisma.registration.count(),
      this.prisma.registration.count({ where: { status: "PENDING" } }),
      this.prisma.paymentRecord.count({ where: { status: "PAID" } }),
      this.prisma.paymentRecord.count({ where: { status: "PENDING_OFFLINE" } }),
      this.prisma.paymentRecord.count({ where: { status: "FAILED" } }),
      this.prisma.paymentRefund.count(),
      this.prisma.notificationOutbox.count({ where: { status: "PENDING" } }),
      this.prisma.notificationOutbox.count({ where: { status: "FAILED" } }),
      this.prisma.paymentReconciliationRun.findFirst({ orderBy: { startedAt: "desc" } })
    ]);

    return {
      totalUsers,
      totalOrganizers,
      totalTournaments,
      publishedTournaments,
      draftTournaments,
      totalRegistrations,
      pendingRegistrations,
      paidPayments,
      pendingPayments,
      failedPayments,
      refundCount,
      pendingNotifications,
      failedNotifications,
      recentReconciliation
    };
  }

  async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async getOperationsStatus(input: { staleNotificationBefore: Date; stalePaymentIntentBefore: Date }) {
    const [
      pendingNotifications,
      failedNotifications,
      staleProcessingNotifications,
      stalePaymentIntents,
      failedPaymentIntents,
      failedPaymentEvents,
      latestReconciliationRun
    ] = await Promise.all([
      this.prisma.notificationOutbox.count({ where: { status: NotificationStatus.PENDING } }),
      this.prisma.notificationOutbox.count({ where: { status: NotificationStatus.FAILED } }),
      this.prisma.notificationOutbox.count({
        where: {
          status: NotificationStatus.PROCESSING,
          updatedAt: { lte: input.staleNotificationBefore }
        }
      }),
      this.prisma.paymentIntent.count({
        where: {
          status: {
            in: [
              PaymentIntentStatus.CREATED,
              PaymentIntentStatus.REQUIRES_ACTION,
              PaymentIntentStatus.PROCESSING
            ]
          },
          createdAt: { lte: input.stalePaymentIntentBefore }
        }
      }),
      this.prisma.paymentIntent.count({ where: { status: PaymentIntentStatus.FAILED } }),
      this.prisma.paymentEvent.count({
        where: {
          OR: [
            { eventType: { contains: "failed", mode: "insensitive" } },
            { signatureValid: false }
          ]
        }
      }),
      this.prisma.paymentReconciliationRun.findFirst({ orderBy: { startedAt: "desc" } })
    ]);

    return {
      pendingNotifications,
      failedNotifications,
      staleProcessingNotifications,
      stalePaymentIntents,
      failedPaymentIntents,
      failedPaymentEvents,
      latestReconciliationRun
    };
  }

  async getPlatformReportSummary(createdAt?: Prisma.DateTimeFilter) {
    const userRoleWhere: Prisma.UserRoleWhereInput = createdAt ? { createdAt } : {};
    const organizerWhere: Prisma.OrganizerProfileWhereInput = createdAt ? { createdAt } : {};
    const tournamentWhere: Prisma.TournamentWhereInput = createdAt ? { createdAt } : {};
    const registrationWhere: Prisma.RegistrationWhereInput = createdAt ? { createdAt } : {};
    const paymentWhere: Prisma.PaymentRecordWhereInput = createdAt ? { createdAt } : {};
    const refundWhere: Prisma.PaymentRefundWhereInput = {
      status: { in: [PaymentRefundStatus.MANUAL_RECORDED, PaymentRefundStatus.SUCCEEDED] },
      ...(createdAt ? { createdAt } : {})
    };
    const notificationWhere: Prisma.NotificationOutboxWhereInput = createdAt ? { createdAt } : {};
    const reconciliationWhere: Prisma.PaymentReconciliationRunWhereInput = createdAt ? { startedAt: createdAt } : {};

    const [
      usersByRole,
      organizersByVerificationStatus,
      tournamentsByStatus,
      registrationsByStatus,
      paymentsByProviderStatus,
      paidAmount,
      refundedAmount,
      notificationsByStatus,
      reconciliationByStatus
    ] = await Promise.all([
      this.prisma.userRole.groupBy({
        by: ["role"],
        where: userRoleWhere,
        _count: { _all: true }
      }),
      this.prisma.organizerProfile.groupBy({
        by: ["verificationStatus"],
        where: organizerWhere,
        _count: { _all: true }
      }),
      this.prisma.tournament.groupBy({
        by: ["status"],
        where: tournamentWhere,
        _count: { _all: true }
      }),
      this.prisma.registration.groupBy({
        by: ["status"],
        where: registrationWhere,
        _count: { _all: true }
      }),
      this.prisma.paymentRecord.groupBy({
        by: ["provider", "status"],
        where: paymentWhere,
        _count: { _all: true }
      }),
      this.prisma.paymentRecord.aggregate({
        where: {
          ...paymentWhere,
          status: RegistrationPaymentStatus.PAID
        },
        _sum: { amount: true }
      }),
      this.prisma.paymentRefund.aggregate({
        where: refundWhere,
        _sum: { amount: true }
      }),
      this.prisma.notificationOutbox.groupBy({
        by: ["status"],
        where: notificationWhere,
        _count: { _all: true }
      }),
      this.prisma.paymentReconciliationRun.groupBy({
        by: ["status"],
        where: reconciliationWhere,
        _count: { _all: true }
      })
    ]);

    return {
      usersByRole,
      organizersByVerificationStatus,
      tournamentsByStatus,
      registrationsByStatus,
      paymentsByProviderStatus,
      totalPaidAmount: paidAmount._sum.amount ?? 0,
      totalRefundedAmount: refundedAmount._sum.amount ?? 0,
      notificationsByStatus,
      reconciliationByStatus
    };
  }

  async listUsers(where: Prisma.UserWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: adminUserInclude,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.user.count({ where })
    ]);
    return { items, total };
  }

  async listOrganizers(where: Prisma.OrganizerProfileWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.organizerProfile.findMany({
        where,
        include: adminOrganizerInclude,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.organizerProfile.count({ where })
    ]);
    return { items, total };
  }

  async findOrganizerDetail(organizerId: string): Promise<AdminOrganizerDetailWithRelations | null> {
    const [organizer, auditEvents] = await Promise.all([
      this.prisma.organizerProfile.findUnique({
        where: { id: organizerId },
        include: adminOrganizerDetailInclude
      }),
      this.prisma.auditLog.findMany({
        where: {
          entityType: "organizer_profile",
          entityId: organizerId
        },
        include: adminAuditInclude,
        orderBy: { createdAt: "desc" },
        take: 25
      })
    ]);

    if (!organizer) {
      return null;
    }

    return {
      ...organizer,
      auditEvents
    };
  }

  async updateOrganizerVerification(input: { organizerId: string; status: OrganizerVerificationStatus }) {
    return this.prisma.organizerProfile.update({
      where: { id: input.organizerId },
      data: { verificationStatus: input.status },
      include: adminOrganizerInclude
    });
  }

  async listTournaments(where: Prisma.TournamentWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.tournament.findMany({
        where,
        include: adminTournamentInclude,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.tournament.count({ where })
    ]);
    return { items, total };
  }

  async listRegistrations(where: Prisma.RegistrationWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.registration.findMany({
        where,
        include: adminRegistrationInclude,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.registration.count({ where })
    ]);
    return { items, total };
  }

  async listPayments(where: Prisma.PaymentRecordWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.paymentRecord.findMany({
        where,
        include: adminPaymentInclude,
        orderBy: { updatedAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.paymentRecord.count({ where })
    ]);
    return { items, total };
  }

  findPaymentDetail(paymentRecordId: string) {
    return this.prisma.paymentRecord.findUnique({
      where: { id: paymentRecordId },
      include: adminPaymentDetailInclude
    });
  }

  async listNotifications(where: Prisma.NotificationOutboxWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.notificationOutbox.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.notificationOutbox.count({ where })
    ]);
    return { items, total };
  }

  findNotification(notificationId: string) {
    return this.prisma.notificationOutbox.findUnique({ where: { id: notificationId } });
  }

  retryNotification(notificationId: string) {
    return this.prisma.notificationOutbox.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.PENDING,
        attempts: 0,
        scheduledAt: null,
        processedAt: null,
        providerMessageId: null,
        lastError: null
      }
    });
  }

  skipNotification(input: { notificationId: string; reason: string }) {
    return this.prisma.notificationOutbox.update({
      where: { id: input.notificationId },
      data: {
        status: NotificationStatus.SKIPPED,
        processedAt: new Date(),
        lastError: input.reason
      }
    });
  }

  async listReconciliationRuns(where: Prisma.PaymentReconciliationRunWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.paymentReconciliationRun.findMany({
        where,
        orderBy: { startedAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.paymentReconciliationRun.count({ where })
    ]);
    return { items, total };
  }

  async listAuditEvents(where: Prisma.AuditLogWhereInput, pagination: PaginationInput) {
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: adminAuditInclude,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      this.prisma.auditLog.count({ where })
    ]);
    return { items, total };
  }

  createAuditLog(input: Prisma.AuditLogUncheckedCreateInput) {
    return this.prisma.auditLog.create({ data: input });
  }
}
