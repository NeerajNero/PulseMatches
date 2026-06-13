import { Injectable } from "@nestjs/common";
import {
  PaymentAttemptStatus,
  PaymentIntentMode,
  PaymentIntentStatus,
  PaymentProvider,
  Prisma,
  PaymentReconciliationStatus,
  RegistrationPaymentMode,
  RegistrationPaymentStatus
} from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const paymentRegistrationInclude = {
  user: true,
  tournament: {
    include: {
      sport: true,
      city: true,
      venue: true,
      organizerProfile: true
    }
  },
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
  }
} satisfies Prisma.RegistrationInclude;

export const paymentIntentInclude = {
  registration: {
    include: {
      user: true,
      tournament: true,
      tournamentCategory: true,
      paymentRecord: {
        include: {
            paymentRefunds: {
            orderBy: { createdAt: "desc" as const }
          }
        }
      }
    }
  },
  paymentRecord: {
    include: {
      paymentRefunds: {
        orderBy: { createdAt: "desc" as const }
      }
    }
  },
  events: true,
  attempts: {
    orderBy: { createdAt: "desc" as const }
  },
  _count: {
    select: {
      events: true,
      attempts: true
    }
  }
} satisfies Prisma.PaymentIntentInclude;

export type PaymentRegistrationWithRelations = Prisma.RegistrationGetPayload<{
  include: typeof paymentRegistrationInclude;
}>;

export type PaymentIntentWithRelations = Prisma.PaymentIntentGetPayload<{
  include: typeof paymentIntentInclude;
}>;

const ACTIVE_INTENT_STATUSES = [
  PaymentIntentStatus.CREATED,
  PaymentIntentStatus.REQUIRES_ACTION,
  PaymentIntentStatus.PROCESSING
];

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRegistrationForUser(registrationId: string, userId: string) {
    return this.prisma.registration.findFirst({
      where: { id: registrationId, userId },
      include: paymentRegistrationInclude
    });
  }

  findLatestIntentForRegistration(registrationId: string) {
    return this.prisma.paymentIntent.findFirst({
      where: { registrationId },
      include: paymentIntentInclude,
      orderBy: { createdAt: "desc" }
    });
  }

  findActiveIntentForRegistration(input: { registrationId: string; now: Date }) {
    return this.prisma.paymentIntent.findFirst({
      where: {
        registrationId: input.registrationId,
        status: { in: ACTIVE_INTENT_STATUSES },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: input.now } }
        ]
      },
      include: paymentIntentInclude,
      orderBy: { createdAt: "desc" }
    });
  }

  createMockIntent(input: {
    registration: PaymentRegistrationWithRelations;
    providerIntentId: string;
    providerAttemptId: string;
    checkoutUrl: string;
    expiresAt: Date;
    idempotencyKey?: string | null;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const paymentRecord = await transaction.paymentRecord.upsert({
        where: { registrationId: input.registration.id },
        update: {
          provider: PaymentProvider.MOCK,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PENDING_OFFLINE,
          amount: input.registration.feeAmount,
          currency: input.registration.feeCurrency
        },
        create: {
          registrationId: input.registration.id,
          tournamentId: input.registration.tournamentId,
          tournamentCategoryId: input.registration.tournamentCategoryId,
          userId: input.registration.userId,
          provider: PaymentProvider.MOCK,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PENDING_OFFLINE,
          amount: input.registration.feeAmount,
          currency: input.registration.feeCurrency
        }
      });

      await transaction.registration.update({
        where: { id: input.registration.id },
        data: {
          paymentMode: RegistrationPaymentMode.ONLINE_PROVIDER,
          paymentStatus: RegistrationPaymentStatus.PENDING_OFFLINE
        }
      });

      const intent = await transaction.paymentIntent.create({
        data: {
          registrationId: input.registration.id,
          paymentRecordId: paymentRecord.id,
          tournamentId: input.registration.tournamentId,
          tournamentCategoryId: input.registration.tournamentCategoryId,
          userId: input.registration.userId,
          provider: PaymentProvider.MOCK,
          mode: PaymentIntentMode.ONLINE,
          status: PaymentIntentStatus.REQUIRES_ACTION,
          amount: input.registration.feeAmount,
          currency: input.registration.feeCurrency,
          providerIntentId: input.providerIntentId,
          providerCheckoutUrl: input.checkoutUrl,
          idempotencyKey: input.idempotencyKey ?? null,
          expiresAt: input.expiresAt
        }
      });

      await transaction.paymentAttempt.create({
        data: {
          paymentIntentId: intent.id,
          registrationId: input.registration.id,
          provider: PaymentProvider.MOCK,
          status: PaymentAttemptStatus.REDIRECTED,
          providerAttemptId: input.providerAttemptId
        }
      });

      await transaction.paymentEvent.create({
        data: {
          paymentIntentId: intent.id,
          paymentRecordId: paymentRecord.id,
          registrationId: input.registration.id,
          tournamentId: input.registration.tournamentId,
          tournamentCategoryId: input.registration.tournamentCategoryId,
          provider: PaymentProvider.MOCK,
          eventType: "payment_intent.created",
          providerEventId: input.providerIntentId,
          payload: {
            provider_intent_id: input.providerIntentId,
            checkout_url: input.checkoutUrl,
            amount: input.registration.feeAmount,
            currency: input.registration.feeCurrency
          }
        }
      });

      return transaction.paymentIntent.findUniqueOrThrow({
        where: { id: intent.id },
        include: paymentIntentInclude
      });
    });
  }

  createRazorpayIntent(input: {
    registration: PaymentRegistrationWithRelations;
    providerIntentId: string;
    providerAttemptId: string;
    providerAmount: number;
    expiresAt: Date;
    idempotencyKey?: string | null;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const paymentRecord = await transaction.paymentRecord.upsert({
        where: { registrationId: input.registration.id },
        update: {
          provider: PaymentProvider.RAZORPAY,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PENDING_OFFLINE,
          amount: input.registration.feeAmount,
          currency: input.registration.feeCurrency,
          reference: input.providerIntentId
        },
        create: {
          registrationId: input.registration.id,
          tournamentId: input.registration.tournamentId,
          tournamentCategoryId: input.registration.tournamentCategoryId,
          userId: input.registration.userId,
          provider: PaymentProvider.RAZORPAY,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PENDING_OFFLINE,
          amount: input.registration.feeAmount,
          currency: input.registration.feeCurrency,
          reference: input.providerIntentId
        }
      });

      await transaction.registration.update({
        where: { id: input.registration.id },
        data: {
          paymentMode: RegistrationPaymentMode.ONLINE_PROVIDER,
          paymentStatus: RegistrationPaymentStatus.PENDING_OFFLINE
        }
      });

      const intent = await transaction.paymentIntent.create({
        data: {
          registrationId: input.registration.id,
          paymentRecordId: paymentRecord.id,
          tournamentId: input.registration.tournamentId,
          tournamentCategoryId: input.registration.tournamentCategoryId,
          userId: input.registration.userId,
          provider: PaymentProvider.RAZORPAY,
          mode: PaymentIntentMode.ONLINE,
          status: PaymentIntentStatus.REQUIRES_ACTION,
          amount: input.registration.feeAmount,
          currency: input.registration.feeCurrency,
          providerIntentId: input.providerIntentId,
          idempotencyKey: input.idempotencyKey ?? null,
          expiresAt: input.expiresAt
        }
      });

      await transaction.paymentAttempt.create({
        data: {
          paymentIntentId: intent.id,
          registrationId: input.registration.id,
          provider: PaymentProvider.RAZORPAY,
          status: PaymentAttemptStatus.REDIRECTED,
          providerAttemptId: input.providerAttemptId
        }
      });

      await transaction.paymentEvent.create({
        data: {
          paymentIntentId: intent.id,
          paymentRecordId: paymentRecord.id,
          registrationId: input.registration.id,
          tournamentId: input.registration.tournamentId,
          tournamentCategoryId: input.registration.tournamentCategoryId,
          provider: PaymentProvider.RAZORPAY,
          eventType: "razorpay.order.created",
          providerEventId: input.providerIntentId,
          payload: {
            razorpay_order_id: input.providerIntentId,
            provider_amount: input.providerAmount,
            amount: input.registration.feeAmount,
            currency: input.registration.feeCurrency
          }
        }
      });

      return transaction.paymentIntent.findUniqueOrThrow({
        where: { id: intent.id },
        include: paymentIntentInclude
      });
    });
  }

  findIntentById(id: string) {
    return this.prisma.paymentIntent.findUnique({
      where: { id },
      include: paymentIntentInclude
    });
  }

  findIntentByProviderIntentId(providerIntentId: string) {
    return this.prisma.paymentIntent.findFirst({
      where: { providerIntentId },
      include: paymentIntentInclude
    });
  }

  findEventByProviderEventId(provider: PaymentProvider, providerEventId: string) {
    return this.prisma.paymentEvent.findFirst({
      where: { provider, providerEventId },
      orderBy: { createdAt: "desc" }
    });
  }

  createPaymentEvent(input: Prisma.PaymentEventUncheckedCreateInput) {
    return this.prisma.paymentEvent.create({ data: input });
  }

  findIntentsForReconciliation(input: {
    provider: PaymentProvider;
    take: number;
  }) {
    return this.prisma.paymentIntent.findMany({
      where: {
        provider: input.provider,
        status: {
          in: [
            PaymentIntentStatus.CREATED,
            PaymentIntentStatus.REQUIRES_ACTION,
            PaymentIntentStatus.PROCESSING,
            PaymentIntentStatus.FAILED
          ]
        }
      },
      include: paymentIntentInclude,
      orderBy: { updatedAt: "desc" },
      take: input.take
    });
  }

  createReconciliationRun(provider: PaymentProvider) {
    return this.prisma.paymentReconciliationRun.create({
      data: { provider, status: PaymentReconciliationStatus.STARTED }
    });
  }

  completeReconciliationRun(input: {
    id: string;
    checkedCount: number;
    updatedCount: number;
    failedCount: number;
    summary?: Prisma.InputJsonValue;
  }) {
    return this.prisma.paymentReconciliationRun.update({
      where: { id: input.id },
      data: {
        status: PaymentReconciliationStatus.COMPLETED,
        completedAt: new Date(),
        checkedCount: input.checkedCount,
        updatedCount: input.updatedCount,
        failedCount: input.failedCount,
        summary: input.summary ?? Prisma.JsonNull
      }
    });
  }

  failReconciliationRun(input: {
    id: string;
    checkedCount: number;
    updatedCount: number;
    failedCount: number;
    error: string;
    summary?: Prisma.InputJsonValue;
  }) {
    return this.prisma.paymentReconciliationRun.update({
      where: { id: input.id },
      data: {
        status: PaymentReconciliationStatus.FAILED,
        completedAt: new Date(),
        checkedCount: input.checkedCount,
        updatedCount: input.updatedCount,
        failedCount: input.failedCount,
        error: input.error,
        summary: input.summary ?? Prisma.JsonNull
      }
    });
  }

  completeMockIntent(input: {
    paymentIntentId: string;
    providerEventId: string;
    signatureValid?: boolean | null;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const intent = await transaction.paymentIntent.findUniqueOrThrow({
        where: { id: input.paymentIntentId },
        include: paymentIntentInclude
      });

      const paymentRecord = await transaction.paymentRecord.upsert({
        where: { registrationId: intent.registrationId },
        update: {
          provider: PaymentProvider.MOCK,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PAID,
          amount: intent.amount,
          currency: intent.currency,
          reference: intent.providerIntentId,
          paidAt: new Date()
        },
        create: {
          registrationId: intent.registrationId,
          tournamentId: intent.tournamentId,
          tournamentCategoryId: intent.tournamentCategoryId,
          userId: intent.userId,
          provider: PaymentProvider.MOCK,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PAID,
          amount: intent.amount,
          currency: intent.currency,
          reference: intent.providerIntentId,
          paidAt: new Date()
        }
      });

      await transaction.registration.update({
        where: { id: intent.registrationId },
        data: {
          paymentMode: RegistrationPaymentMode.ONLINE_PROVIDER,
          paymentStatus: RegistrationPaymentStatus.PAID
        }
      });

      await transaction.paymentIntent.update({
        where: { id: intent.id },
        data: {
          paymentRecordId: paymentRecord.id,
          status: PaymentIntentStatus.SUCCEEDED
        }
      });

      await transaction.paymentAttempt.updateMany({
        where: {
          paymentIntentId: intent.id,
          status: { in: [PaymentAttemptStatus.STARTED, PaymentAttemptStatus.REDIRECTED] }
        },
        data: { status: PaymentAttemptStatus.SUCCEEDED }
      });

      await transaction.paymentEvent.create({
        data: {
          paymentIntentId: intent.id,
          paymentRecordId: paymentRecord.id,
          registrationId: intent.registrationId,
          tournamentId: intent.tournamentId,
          tournamentCategoryId: intent.tournamentCategoryId,
          provider: PaymentProvider.MOCK,
          eventType: "payment_intent.succeeded",
          providerEventId: input.providerEventId,
          payload: {
            provider_intent_id: intent.providerIntentId,
            amount: intent.amount,
            currency: intent.currency
          },
          signatureValid: input.signatureValid ?? null,
          processedAt: new Date()
        }
      });

      return transaction.paymentIntent.findUniqueOrThrow({
        where: { id: intent.id },
        include: paymentIntentInclude
      });
    });
  }

  completeRazorpayIntent(input: {
    paymentIntentId: string;
    providerPaymentId: string;
    providerEventId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
    signatureValid: boolean;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.paymentIntent.findUniqueOrThrow({
        where: { id: input.paymentIntentId },
        include: paymentIntentInclude
      });

      if (existing.status === PaymentIntentStatus.SUCCEEDED) {
        return existing;
      }

      const paymentRecord = await transaction.paymentRecord.upsert({
        where: { registrationId: existing.registrationId },
        update: {
          provider: PaymentProvider.RAZORPAY,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PAID,
          amount: existing.amount,
          currency: existing.currency,
          reference: input.providerPaymentId,
          paidAt: new Date()
        },
        create: {
          registrationId: existing.registrationId,
          tournamentId: existing.tournamentId,
          tournamentCategoryId: existing.tournamentCategoryId,
          userId: existing.userId,
          provider: PaymentProvider.RAZORPAY,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.PAID,
          amount: existing.amount,
          currency: existing.currency,
          reference: input.providerPaymentId,
          paidAt: new Date()
        }
      });

      await transaction.registration.update({
        where: { id: existing.registrationId },
        data: {
          paymentMode: RegistrationPaymentMode.ONLINE_PROVIDER,
          paymentStatus: RegistrationPaymentStatus.PAID
        }
      });

      await transaction.paymentIntent.update({
        where: { id: existing.id },
        data: {
          paymentRecordId: paymentRecord.id,
          status: PaymentIntentStatus.SUCCEEDED
        }
      });

      await transaction.paymentAttempt.updateMany({
        where: {
          paymentIntentId: existing.id,
          status: { in: [PaymentAttemptStatus.STARTED, PaymentAttemptStatus.REDIRECTED] }
        },
        data: {
          status: PaymentAttemptStatus.SUCCEEDED,
          providerAttemptId: input.providerPaymentId
        }
      });

      await transaction.paymentEvent.create({
        data: {
          paymentIntentId: existing.id,
          paymentRecordId: paymentRecord.id,
          registrationId: existing.registrationId,
          tournamentId: existing.tournamentId,
          tournamentCategoryId: existing.tournamentCategoryId,
          provider: PaymentProvider.RAZORPAY,
          eventType: input.eventType,
          providerEventId: input.providerEventId,
          payload: input.payload,
          signatureValid: input.signatureValid,
          processedAt: new Date()
        }
      });

      return transaction.paymentIntent.findUniqueOrThrow({
        where: { id: existing.id },
        include: paymentIntentInclude
      });
    });
  }

  failRazorpayIntent(input: {
    paymentIntentId: string;
    providerPaymentId?: string | null;
    providerEventId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
    signatureValid: boolean;
    errorMessage?: string | null;
  }) {
    return this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.paymentIntent.findUniqueOrThrow({
        where: { id: input.paymentIntentId },
        include: paymentIntentInclude
      });

      if (existing.status === PaymentIntentStatus.SUCCEEDED) {
        return existing;
      }

      const paymentRecord = await transaction.paymentRecord.upsert({
        where: { registrationId: existing.registrationId },
        update: {
          provider: PaymentProvider.RAZORPAY,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.FAILED,
          amount: existing.amount,
          currency: existing.currency,
          reference: input.providerPaymentId ?? existing.providerIntentId
        },
        create: {
          registrationId: existing.registrationId,
          tournamentId: existing.tournamentId,
          tournamentCategoryId: existing.tournamentCategoryId,
          userId: existing.userId,
          provider: PaymentProvider.RAZORPAY,
          mode: RegistrationPaymentMode.ONLINE_PROVIDER,
          status: RegistrationPaymentStatus.FAILED,
          amount: existing.amount,
          currency: existing.currency,
          reference: input.providerPaymentId ?? existing.providerIntentId
        }
      });

      await transaction.registration.update({
        where: { id: existing.registrationId },
        data: {
          paymentMode: RegistrationPaymentMode.ONLINE_PROVIDER,
          paymentStatus: RegistrationPaymentStatus.FAILED
        }
      });

      await transaction.paymentIntent.update({
        where: { id: existing.id },
        data: {
          paymentRecordId: paymentRecord.id,
          status: PaymentIntentStatus.FAILED
        }
      });

      await transaction.paymentAttempt.updateMany({
        where: {
          paymentIntentId: existing.id,
          status: { in: [PaymentAttemptStatus.STARTED, PaymentAttemptStatus.REDIRECTED] }
        },
        data: {
          status: PaymentAttemptStatus.FAILED,
          providerAttemptId: input.providerPaymentId ?? undefined,
          errorMessage: input.errorMessage ?? null
        }
      });

      await transaction.paymentEvent.create({
        data: {
          paymentIntentId: existing.id,
          paymentRecordId: paymentRecord.id,
          registrationId: existing.registrationId,
          tournamentId: existing.tournamentId,
          tournamentCategoryId: existing.tournamentCategoryId,
          provider: PaymentProvider.RAZORPAY,
          eventType: input.eventType,
          providerEventId: input.providerEventId,
          payload: input.payload,
          signatureValid: input.signatureValid,
          processedAt: new Date()
        }
      });

      return transaction.paymentIntent.findUniqueOrThrow({
        where: { id: existing.id },
        include: paymentIntentInclude
      });
    });
  }
}
