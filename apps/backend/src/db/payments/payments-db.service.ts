import { Injectable } from "@nestjs/common";
import { PaymentProvider, Prisma } from "@prisma/client";
import { PaymentsRepository, PaymentRegistrationWithRelations } from "./payments.repository";

@Injectable()
export class PaymentsDbService {
  constructor(private readonly repository: PaymentsRepository) {}

  findRegistrationForUser(registrationId: string, userId: string) {
    return this.repository.findRegistrationForUser(registrationId, userId);
  }

  findLatestIntentForRegistration(registrationId: string) {
    return this.repository.findLatestIntentForRegistration(registrationId);
  }

  findActiveIntentForRegistration(input: { registrationId: string; now: Date }) {
    return this.repository.findActiveIntentForRegistration(input);
  }

  createMockIntent(input: {
    registration: PaymentRegistrationWithRelations;
    providerIntentId: string;
    providerAttemptId: string;
    checkoutUrl: string;
    expiresAt: Date;
    idempotencyKey?: string | null;
  }) {
    return this.repository.createMockIntent(input);
  }

  createRazorpayIntent(input: {
    registration: PaymentRegistrationWithRelations;
    providerIntentId: string;
    providerAttemptId: string;
    providerAmount: number;
    expiresAt: Date;
    idempotencyKey?: string | null;
  }) {
    return this.repository.createRazorpayIntent(input);
  }

  findIntentById(id: string) {
    return this.repository.findIntentById(id);
  }

  findIntentByProviderIntentId(providerIntentId: string) {
    return this.repository.findIntentByProviderIntentId(providerIntentId);
  }

  findEventByProviderEventId(provider: PaymentProvider, providerEventId: string) {
    return this.repository.findEventByProviderEventId(provider, providerEventId);
  }

  createPaymentEvent(input: Prisma.PaymentEventUncheckedCreateInput) {
    return this.repository.createPaymentEvent(input);
  }

  findIntentsForReconciliation(input: {
    provider: PaymentProvider;
    take: number;
  }) {
    return this.repository.findIntentsForReconciliation(input);
  }

  createReconciliationRun(provider: PaymentProvider) {
    return this.repository.createReconciliationRun(provider);
  }

  completeReconciliationRun(input: {
    id: string;
    checkedCount: number;
    updatedCount: number;
    failedCount: number;
    summary?: Prisma.InputJsonValue;
  }) {
    return this.repository.completeReconciliationRun(input);
  }

  failReconciliationRun(input: {
    id: string;
    checkedCount: number;
    updatedCount: number;
    failedCount: number;
    error: string;
    summary?: Prisma.InputJsonValue;
  }) {
    return this.repository.failReconciliationRun(input);
  }

  completeMockIntent(input: {
    paymentIntentId: string;
    providerEventId: string;
    signatureValid?: boolean | null;
  }) {
    return this.repository.completeMockIntent(input);
  }

  completeRazorpayIntent(input: {
    paymentIntentId: string;
    providerPaymentId: string;
    providerEventId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
    signatureValid: boolean;
  }) {
    return this.repository.completeRazorpayIntent(input);
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
    return this.repository.failRazorpayIntent(input);
  }
}
