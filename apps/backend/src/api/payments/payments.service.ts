import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  PaymentProvider,
  PaymentIntentStatus,
  Prisma,
  RegistrationPaymentStatus,
  RegistrationStatus
} from "@prisma/client";
import { PaymentsDbService } from "../../db/payments/payments-db.service";
import { PaymentIntentWithRelations, PaymentRegistrationWithRelations } from "../../db/payments/payments.repository";
import { NotificationsService } from "../../notifications/notifications.service";
import { PaymentProviderService } from "../../payments/payment-provider.service";
import { AuthenticatedUser } from "../auth/auth.types";
import {
  MockCompletePaymentRequestDto,
  MockWebhookPaymentRequestDto,
  VerifyRazorpayPaymentRequestDto
} from "./dto/payment.dto";
import { PaymentsTransform } from "./payments.transform";

const ACTIVE_INTENT_STATUSES: PaymentIntentStatus[] = [
  PaymentIntentStatus.CREATED,
  PaymentIntentStatus.REQUIRES_ACTION,
  PaymentIntentStatus.PROCESSING
];

interface PaymentWebhookContext {
  rawBody?: Buffer;
  razorpaySignature?: string;
  razorpayEventId?: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsDb: PaymentsDbService,
    private readonly provider: PaymentProviderService,
    private readonly transform: PaymentsTransform,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService
  ) {}

  async createPaymentIntent(registrationId: string, currentUser: AuthenticatedUser) {
    const configuredProvider = this.provider.getConfiguredProvider();
    if (!["mock", "razorpay"].includes(configuredProvider)) {
      throw new BadRequestException("Online payment provider is not enabled.");
    }

    const registration = await this.findOwnRegistration(registrationId, currentUser.id);
    this.assertPaymentIntentAllowed(registration);

    const activeIntent = await this.paymentsDb.findActiveIntentForRegistration({
      registrationId: registration.id,
      now: new Date()
    });
    if (activeIntent && activeIntent.provider.toLowerCase() === configuredProvider) {
      return this.transform.toIntent(activeIntent);
    }

    if (configuredProvider === "razorpay") {
      return this.createRazorpayPaymentIntent(registration);
    }

    const providerIntent = this.provider.createMockIntent({
      amount: registration.feeAmount,
      currency: registration.feeCurrency
    });

    const intent = await this.paymentsDb.createMockIntent({
      registration,
      providerIntentId: providerIntent.providerIntentId,
      providerAttemptId: providerIntent.providerAttemptId,
      checkoutUrl: providerIntent.checkoutUrl,
      expiresAt: providerIntent.expiresAt,
      idempotencyKey: `mock:${registration.id}:${providerIntent.providerIntentId}`
    });

    return this.transform.toIntent(intent);
  }

  async findRegistrationPayment(registrationId: string, currentUser: AuthenticatedUser) {
    const registration = await this.findOwnRegistration(registrationId, currentUser.id);
    const latestIntent = await this.paymentsDb.findLatestIntentForRegistration(registration.id);

    return this.transform.toPaymentDetail({
      registration,
      latestIntent,
      onlinePaymentAvailable: this.isOnlinePaymentAvailable(registration)
    });
  }

  async completeMockPayment(dto: MockCompletePaymentRequestDto, currentUser: AuthenticatedUser) {
    this.assertMockMutationAllowed();
    const intent = await this.findIntentOrThrow(dto.payment_intent_id);
    if (intent.userId !== currentUser.id) {
      throw new ForbiddenException("You can only complete your own mock payment.");
    }

    const completed = await this.completeIntent(intent, null);
    return this.transform.toIntent(completed);
  }

  async verifyRazorpayPayment(
    registrationId: string,
    dto: VerifyRazorpayPaymentRequestDto,
    currentUser: AuthenticatedUser
  ) {
    if (!this.provider.isRazorpayProviderEnabled()) {
      throw new NotFoundException("Razorpay payment verification is not available.");
    }

    const registration = await this.findOwnRegistration(registrationId, currentUser.id);
    const intent = await this.findIntentByProviderOrderOrThrow(dto.razorpay_order_id);
    if (intent.registrationId !== registration.id || intent.userId !== currentUser.id) {
      throw new ForbiddenException("You can only verify payment for your own registration.");
    }

    const signatureValid = this.provider.verifyRazorpayCheckoutSignature({
      razorpayOrderId: dto.razorpay_order_id,
      razorpayPaymentId: dto.razorpay_payment_id,
      razorpaySignature: dto.razorpay_signature
    });
    if (!signatureValid) {
      await this.recordRazorpayEvent({
        intent,
        eventType: "razorpay.checkout.signature_invalid",
        providerEventId: `checkout:${dto.razorpay_payment_id}:invalid`,
        payload: {
          razorpay_order_id: dto.razorpay_order_id,
          razorpay_payment_id: dto.razorpay_payment_id
        },
        signatureValid: false
      });
      throw new ForbiddenException("Invalid Razorpay checkout signature.");
    }

    const completed = await this.completeRazorpayIntent({
      intent,
      providerPaymentId: dto.razorpay_payment_id,
      providerEventId: `checkout:${dto.razorpay_payment_id}`,
      eventType: "razorpay.checkout.verified",
      payload: {
        razorpay_order_id: dto.razorpay_order_id,
        razorpay_payment_id: dto.razorpay_payment_id
      },
      signatureValid: true
    });

    return this.transform.toIntent(completed);
  }

  async handleWebhook(provider: string, dto: MockWebhookPaymentRequestDto | Record<string, unknown>, context: PaymentWebhookContext = {}) {
    const normalizedProvider = provider.toLowerCase();
    if (normalizedProvider === "mock") {
      return this.handleMockWebhook(dto as MockWebhookPaymentRequestDto);
    }
    if (normalizedProvider === "razorpay") {
      return this.handleRazorpayWebhook(dto as Record<string, unknown>, context);
    }
    throw new NotFoundException("Payment webhook provider is not available.");
  }

  async reconcilePayments() {
    const provider = this.toPaymentProvider(
      this.config.get<string>("PAYMENT_RECONCILIATION_PROVIDER", this.provider.getConfiguredProvider())
    );
    const limit = this.resolveReconciliationLimit();
    const run = await this.paymentsDb.createReconciliationRun(provider);
    let checkedCount = 0;
    const updatedCount = 0;
    let failedCount = 0;
    const providerStatuses: Array<Record<string, unknown>> = [];

    try {
      const intents = await this.paymentsDb.findIntentsForReconciliation({ provider, take: limit });
      for (const intent of intents) {
        checkedCount += 1;
        if (provider !== PaymentProvider.RAZORPAY) {
          providerStatuses.push({
            payment_intent_id: intent.id,
            provider_intent_id: intent.providerIntentId,
            status: intent.status
          });
          continue;
        }

        if (!intent.providerIntentId) {
          failedCount += 1;
          providerStatuses.push({
            payment_intent_id: intent.id,
            status: "missing_provider_intent_id"
          });
          continue;
        }

        try {
          const order = await this.provider.fetchRazorpayOrderStatus(intent.providerIntentId);
          providerStatuses.push({
            payment_intent_id: intent.id,
            provider_intent_id: order.providerIntentId,
            provider_status: order.status
          });
          await this.paymentsDb.createPaymentEvent({
            paymentIntentId: intent.id,
            paymentRecordId: intent.paymentRecordId,
            registrationId: intent.registrationId,
            tournamentId: intent.tournamentId,
            tournamentCategoryId: intent.tournamentCategoryId,
            provider,
            eventType: "reconciliation.checked",
            providerEventId: `reconciliation:${run.id}:${intent.id}`,
            payload: {
              reconciliation_run_id: run.id,
              provider_intent_id: order.providerIntentId,
              provider_status: order.status,
              amount: order.amount,
              currency: order.currency
            },
            processedAt: new Date()
          });
        } catch (error) {
          failedCount += 1;
          providerStatuses.push({
            payment_intent_id: intent.id,
            provider_intent_id: intent.providerIntentId,
            error: this.safeErrorMessage(error)
          });
        }
      }

      await this.paymentsDb.completeReconciliationRun({
        id: run.id,
        checkedCount,
        updatedCount,
        failedCount,
        summary: this.toJsonPayload({ provider_statuses: providerStatuses })
      });
      return {
        status: "payments_reconciled",
        run_id: run.id,
        provider: String(provider).toLowerCase(),
        checked: checkedCount,
        updated: updatedCount,
        failed: failedCount
      };
    } catch (error) {
      await this.paymentsDb.failReconciliationRun({
        id: run.id,
        checkedCount,
        updatedCount,
        failedCount,
        error: this.safeErrorMessage(error),
        summary: this.toJsonPayload({ provider_statuses: providerStatuses })
      });
      throw error;
    }
  }

  private async createRazorpayPaymentIntent(registration: PaymentRegistrationWithRelations) {
    const providerIntent = await this.provider.createRazorpayOrder({
      amount: registration.feeAmount,
      currency: registration.feeCurrency,
      receipt: registration.id,
      notes: {
        registration_id: registration.id,
        tournament_id: registration.tournamentId,
        category_id: registration.tournamentCategoryId ?? ""
      }
    });

    const intent = await this.paymentsDb.createRazorpayIntent({
      registration,
      providerIntentId: providerIntent.providerIntentId,
      providerAttemptId: providerIntent.providerAttemptId,
      providerAmount: providerIntent.providerAmount,
      expiresAt: providerIntent.expiresAt,
      idempotencyKey: `razorpay:${registration.id}:${providerIntent.providerIntentId}`
    });

    return this.transform.toIntent(intent);
  }

  private async handleMockWebhook(dto: MockWebhookPaymentRequestDto) {
    this.assertMockMutationAllowed();
    const signatureValid = this.provider.verifyMockWebhook({
      paymentIntentId: dto.payment_intent_id,
      signature: dto.signature
    });
    if (signatureValid === false) {
      throw new ForbiddenException("Invalid mock payment webhook signature.");
    }

    const intent = await this.findIntentOrThrow(dto.payment_intent_id);
    const completed = await this.completeIntent(intent, signatureValid);
    return this.transform.toIntent(completed);
  }

  private async handleRazorpayWebhook(dto: Record<string, unknown>, context: PaymentWebhookContext) {
    if (!this.provider.isRazorpayProviderEnabled()) {
      throw new NotFoundException("Razorpay payment webhook is not available.");
    }
    if (!context.rawBody) {
      throw new BadRequestException("Raw webhook body is required for Razorpay signature verification.");
    }
    if (!this.provider.verifyRazorpayWebhook({
      rawBody: context.rawBody,
      signature: context.razorpaySignature
    })) {
      throw new ForbiddenException("Invalid Razorpay webhook signature.");
    }

    const eventType = this.readString(dto, "event") ?? "razorpay.webhook";
    const payment = this.readNestedRecord(dto, ["payload", "payment", "entity"]);
    const order = this.readNestedRecord(dto, ["payload", "order", "entity"]);
    const razorpayOrderId = this.readString(payment, "order_id") ?? this.readString(order, "id");
    const razorpayPaymentId = this.readString(payment, "id") ?? this.readString(order, "id") ?? razorpayOrderId;
    const providerEventId = context.razorpayEventId
      ?? this.readString(dto, "id")
      ?? `${eventType}:${razorpayPaymentId ?? razorpayOrderId ?? Date.now()}`;

    if (await this.paymentsDb.findEventByProviderEventId(PaymentProvider.RAZORPAY, providerEventId)) {
      const existingIntent = razorpayOrderId
        ? await this.paymentsDb.findIntentByProviderIntentId(razorpayOrderId)
        : null;
      if (!existingIntent) {
        throw new NotFoundException("Razorpay payment intent not found.");
      }
      return this.transform.toIntent(existingIntent);
    }

    if (!razorpayOrderId) {
      await this.paymentsDb.createPaymentEvent({
        provider: PaymentProvider.RAZORPAY,
        eventType,
        providerEventId,
        payload: this.toJsonPayload(dto),
        signatureValid: true,
        processedAt: new Date()
      });
      throw new BadRequestException("Razorpay webhook does not include an order id.");
    }

    const intent = await this.findIntentByProviderOrderOrThrow(razorpayOrderId);
    const payload = this.toJsonPayload(dto);

    if (eventType === "order.paid" || eventType === "payment.captured") {
      const completed = await this.completeRazorpayIntent({
        intent,
        providerPaymentId: razorpayPaymentId ?? razorpayOrderId,
        providerEventId,
        eventType,
        payload,
        signatureValid: true
      });
      return this.transform.toIntent(completed);
    }

    if (eventType === "payment.failed") {
      const alreadyFailed = intent.status === PaymentIntentStatus.FAILED
        || intent.registration.paymentRecord?.status === RegistrationPaymentStatus.FAILED
        || intent.registration.paymentStatus === RegistrationPaymentStatus.FAILED;
      const failed = await this.paymentsDb.failRazorpayIntent({
        paymentIntentId: intent.id,
        providerPaymentId: razorpayPaymentId,
        providerEventId,
        eventType,
        payload,
        signatureValid: true,
        errorMessage: this.readString(payment, "error_description")
          ?? this.readString(payment, "error_reason")
          ?? "Razorpay payment failed"
      });
      if (!alreadyFailed && failed.status === PaymentIntentStatus.FAILED) {
        await this.notifications.enqueuePaymentStatusChanged({
          registrationId: failed.registrationId,
          recipientUserId: failed.registration.userId,
          recipientEmail: failed.registration.user.email,
          recipientName: failed.registration.user.displayName,
          tournamentId: failed.registration.tournamentId,
          tournamentCategoryId: failed.registration.tournamentCategoryId,
          tournamentTitle: failed.registration.tournament.title,
          tournamentSlug: failed.registration.tournament.slug,
          categoryName: failed.registration.tournamentCategory?.name ?? null,
          status: RegistrationPaymentStatus.FAILED,
          amount: failed.amount,
          currency: failed.currency
        });
      }
      return this.transform.toIntent(failed);
    }

    await this.recordRazorpayEvent({
      intent,
      eventType,
      providerEventId,
      payload,
      signatureValid: true
    });

    return this.transform.toIntent(intent);
  }

  private async findOwnRegistration(registrationId: string, userId: string) {
    const registration = await this.paymentsDb.findRegistrationForUser(registrationId, userId);
    if (!registration) {
      throw new NotFoundException("Registration not found.");
    }
    return registration;
  }

  private async findIntentOrThrow(paymentIntentId: string) {
    const intent = await this.paymentsDb.findIntentById(paymentIntentId);
    if (!intent) {
      throw new NotFoundException("Payment intent not found.");
    }
    return intent;
  }

  private async findIntentByProviderOrderOrThrow(providerIntentId: string) {
    const intent = await this.paymentsDb.findIntentByProviderIntentId(providerIntentId);
    if (!intent) {
      throw new NotFoundException("Payment intent not found.");
    }
    if (intent.provider !== PaymentProvider.RAZORPAY) {
      throw new BadRequestException("Payment intent does not belong to Razorpay.");
    }
    return intent;
  }

  private assertPaymentIntentAllowed(registration: PaymentRegistrationWithRelations) {
    const currentPaymentStatus = registration.paymentRecord?.status ?? registration.paymentStatus;
    const amount = registration.paymentRecord?.amount ?? registration.feeAmount;

    if (amount <= 0 || currentPaymentStatus === RegistrationPaymentStatus.NOT_REQUIRED) {
      throw new BadRequestException("Payment is not required for this registration.");
    }
    if (registration.status === RegistrationStatus.CANCELLED || registration.status === RegistrationStatus.REJECTED) {
      throw new BadRequestException("Payment cannot be started for cancelled or rejected registrations.");
    }
    if (
      currentPaymentStatus === RegistrationPaymentStatus.PAID
      || currentPaymentStatus === RegistrationPaymentStatus.WAIVED
    ) {
      throw new BadRequestException("This registration is already settled.");
    }
  }

  private isOnlinePaymentAvailable(registration: PaymentRegistrationWithRelations) {
    const status = registration.paymentRecord?.status ?? registration.paymentStatus;
    const amount = registration.paymentRecord?.amount ?? registration.feeAmount;
    return ["mock", "razorpay"].includes(this.provider.getConfiguredProvider())
      && amount > 0
      && status !== RegistrationPaymentStatus.NOT_REQUIRED
      && status !== RegistrationPaymentStatus.PAID
      && status !== RegistrationPaymentStatus.WAIVED
      && registration.status !== RegistrationStatus.CANCELLED
      && registration.status !== RegistrationStatus.REJECTED;
  }

  private assertMockMutationAllowed() {
    if (!this.provider.isMockMutationAllowed()) {
      throw new NotFoundException("Mock payment completion is not available.");
    }
  }

  private async completeIntent(intent: PaymentIntentWithRelations, signatureValid: boolean | null) {
    if (!ACTIVE_INTENT_STATUSES.includes(intent.status)) {
      if (intent.status === PaymentIntentStatus.SUCCEEDED) {
        return intent;
      }
      throw new BadRequestException("Payment intent cannot be completed from its current state.");
    }
    if (intent.expiresAt && intent.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException("Payment intent has expired.");
    }

    const completed = await this.paymentsDb.completeMockIntent({
      paymentIntentId: intent.id,
      providerEventId: `mock_evt_${intent.id}`,
      signatureValid
    });

    await this.notifications.enqueuePaymentStatusChanged({
      registrationId: completed.registrationId,
      recipientUserId: completed.registration.userId,
      recipientEmail: completed.registration.user.email,
      recipientName: completed.registration.user.displayName,
      tournamentId: completed.registration.tournamentId,
      tournamentCategoryId: completed.registration.tournamentCategoryId,
      tournamentTitle: completed.registration.tournament.title,
      tournamentSlug: completed.registration.tournament.slug,
      categoryName: completed.registration.tournamentCategory?.name ?? null,
      status: RegistrationPaymentStatus.PAID,
      amount: completed.amount,
      currency: completed.currency
    });

    return completed;
  }

  private async completeRazorpayIntent(input: {
    intent: PaymentIntentWithRelations;
    providerPaymentId: string;
    providerEventId: string;
    eventType: string;
    payload: Prisma.InputJsonValue;
    signatureValid: boolean;
  }) {
    this.assertIntentCanComplete(input.intent);
    const alreadyPaid = input.intent.status === PaymentIntentStatus.SUCCEEDED
      || input.intent.registration.paymentRecord?.status === RegistrationPaymentStatus.PAID
      || input.intent.registration.paymentStatus === RegistrationPaymentStatus.PAID;

    const completed = await this.paymentsDb.completeRazorpayIntent({
      paymentIntentId: input.intent.id,
      providerPaymentId: input.providerPaymentId,
      providerEventId: input.providerEventId,
      eventType: input.eventType,
      payload: input.payload,
      signatureValid: input.signatureValid
    });

    if (!alreadyPaid) {
      await this.notifications.enqueuePaymentStatusChanged({
        registrationId: completed.registrationId,
        recipientUserId: completed.registration.userId,
        recipientEmail: completed.registration.user.email,
        recipientName: completed.registration.user.displayName,
        tournamentId: completed.registration.tournamentId,
        tournamentCategoryId: completed.registration.tournamentCategoryId,
        tournamentTitle: completed.registration.tournament.title,
        tournamentSlug: completed.registration.tournament.slug,
        categoryName: completed.registration.tournamentCategory?.name ?? null,
        status: RegistrationPaymentStatus.PAID,
        amount: completed.amount,
        currency: completed.currency
      });
    }

    return completed;
  }

  private assertIntentCanComplete(intent: PaymentIntentWithRelations) {
    if (!ACTIVE_INTENT_STATUSES.includes(intent.status)) {
      if (intent.status === PaymentIntentStatus.SUCCEEDED) {
        return;
      }
      throw new BadRequestException("Payment intent cannot be completed from its current state.");
    }
    if (intent.expiresAt && intent.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException("Payment intent has expired.");
    }
  }

  private async recordRazorpayEvent(input: {
    intent: PaymentIntentWithRelations;
    eventType: string;
    providerEventId: string;
    payload: Prisma.InputJsonValue;
    signatureValid: boolean;
  }) {
    await this.paymentsDb.createPaymentEvent({
      paymentIntentId: input.intent.id,
      paymentRecordId: input.intent.paymentRecordId,
      registrationId: input.intent.registrationId,
      tournamentId: input.intent.tournamentId,
      tournamentCategoryId: input.intent.tournamentCategoryId,
      provider: PaymentProvider.RAZORPAY,
      eventType: input.eventType,
      providerEventId: input.providerEventId,
      payload: input.payload,
      signatureValid: input.signatureValid,
      processedAt: new Date()
    });
  }

  private readNestedRecord(value: unknown, path: string[]) {
    let current: unknown = value;
    for (const key of path) {
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        return null;
      }
      current = (current as Record<string, unknown>)[key];
    }
    return current && typeof current === "object" && !Array.isArray(current)
      ? current as Record<string, unknown>
      : null;
  }

  private readString(value: unknown, key: string) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }
    const result = (value as Record<string, unknown>)[key];
    return typeof result === "string" && result.trim() ? result : null;
  }

  private toPaymentProvider(value?: string | null): PaymentProvider {
    const normalized = value?.trim().toUpperCase();
    if (normalized === "MOCK") {
      return PaymentProvider.MOCK;
    }
    if (normalized === "RAZORPAY") {
      return PaymentProvider.RAZORPAY;
    }
    return PaymentProvider.MANUAL;
  }

  private resolveReconciliationLimit() {
    const limit = Number(this.config.get<string>("PAYMENT_RECONCILIATION_LIMIT", "25"));
    return Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : 25;
  }

  private safeErrorMessage(error: unknown) {
    return error instanceof Error ? error.message.slice(0, 500) : "Unknown payment reconciliation error";
  }

  private toJsonPayload(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
