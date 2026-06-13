import { Injectable } from "@nestjs/common";
import {
  NotificationChannel,
  NotificationOutbox,
  NotificationType,
  Prisma,
  RegistrationPaymentStatus
} from "@prisma/client";
import { NotificationsDbService } from "../db/notifications/notifications-db.service";
import { NotificationEmailProvider } from "./notification-email.provider";
import { NotificationTemplateService } from "./notification-template.service";

interface RegistrationNotificationInput {
  registrationId: string;
  recipientUserId: string;
  recipientEmail: string | null;
  recipientName: string | null;
  tournamentId: string;
  tournamentCategoryId?: string | null;
  tournamentTitle: string;
  tournamentSlug?: string | null;
  categoryName?: string | null;
  reason?: string | null;
}

interface PaymentStatusNotificationInput extends RegistrationNotificationInput {
  status: RegistrationPaymentStatus;
  amount: number;
  currency: string;
}

interface ResultsPublishedRecipientInput {
  registrationId: string;
  recipientUserId: string;
  recipientEmail: string | null;
  recipientName: string | null;
}

interface ResultsPublishedNotificationInput {
  tournamentId: string;
  tournamentCategoryId: string;
  fixtureSetId: string;
  tournamentTitle: string;
  tournamentSlug?: string | null;
  categoryName?: string | null;
  fixtureSetName?: string | null;
  recipients: ResultsPublishedRecipientInput[];
}

export interface NotificationProcessResult {
  selected: number;
  processed: number;
  sent: number;
  skipped: number;
  failed: number;
  retried: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsDb: NotificationsDbService,
    private readonly templates: NotificationTemplateService,
    private readonly emailProvider: NotificationEmailProvider
  ) {}

  enqueueRegistrationCreated(input: RegistrationNotificationInput) {
    return this.enqueueRegistrationNotification(NotificationType.REGISTRATION_CREATED, input);
  }

  enqueueRegistrationApproved(input: RegistrationNotificationInput) {
    return this.enqueueRegistrationNotification(NotificationType.REGISTRATION_APPROVED, input);
  }

  enqueueRegistrationRejected(input: RegistrationNotificationInput) {
    return this.enqueueRegistrationNotification(NotificationType.REGISTRATION_REJECTED, input);
  }

  enqueueRegistrationCancelled(input: RegistrationNotificationInput) {
    return this.enqueueRegistrationNotification(NotificationType.REGISTRATION_CANCELLED, input);
  }

  enqueuePaymentStatusChanged(input: PaymentStatusNotificationInput) {
    const type = this.paymentNotificationType(input.status);
    if (!type) {
      return null;
    }

    const template = this.templates.render({
      type,
      recipientName: input.recipientName,
      tournamentTitle: input.tournamentTitle,
      tournamentSlug: input.tournamentSlug,
      categoryName: input.categoryName,
      actionPath: "/account/registrations",
      paymentStatus: input.status,
      amount: input.amount,
      currency: input.currency
    });

    return this.createNotificationIgnoringDuplicate({
      type,
      channel: NotificationChannel.EMAIL,
      recipientUserId: input.recipientUserId,
      recipientEmail: this.cleanEmail(input.recipientEmail),
      recipientName: input.recipientName,
      tournamentId: input.tournamentId,
      tournamentCategoryId: input.tournamentCategoryId,
      registrationId: input.registrationId,
      subject: template.subject,
      payload: this.buildPayload(template, {
        tournament_title: input.tournamentTitle,
        tournament_slug: input.tournamentSlug ?? null,
        tournament_category_name: input.categoryName ?? null,
        payment_status: input.status,
        amount: input.amount,
        currency: input.currency
      }),
      idempotencyKey: `${type}:${input.registrationId}:${input.status}`
    });
  }

  async enqueueResultsPublished(input: ResultsPublishedNotificationInput) {
    if (input.recipients.length === 0) {
      return { count: 0 };
    }

    const rows = input.recipients.map((recipient) => {
      const template = this.templates.render({
        type: NotificationType.RESULTS_PUBLISHED,
        recipientName: recipient.recipientName,
        tournamentTitle: input.tournamentTitle,
        tournamentSlug: input.tournamentSlug,
        categoryName: input.categoryName,
        fixtureSetName: input.fixtureSetName,
        actionPath: input.tournamentSlug ? `/tournaments/${input.tournamentSlug}` : null
      });

      return {
        type: NotificationType.RESULTS_PUBLISHED,
        channel: NotificationChannel.EMAIL,
        recipientUserId: recipient.recipientUserId,
        recipientEmail: this.cleanEmail(recipient.recipientEmail),
        recipientName: recipient.recipientName,
        tournamentId: input.tournamentId,
        tournamentCategoryId: input.tournamentCategoryId,
        registrationId: recipient.registrationId,
        fixtureSetId: input.fixtureSetId,
        subject: template.subject,
        payload: this.buildPayload(template, {
          tournament_title: input.tournamentTitle,
          tournament_slug: input.tournamentSlug ?? null,
          tournament_category_name: input.categoryName ?? null,
          fixture_set_name: input.fixtureSetName ?? null
        }),
        idempotencyKey: `RESULTS_PUBLISHED:${input.fixtureSetId}:${recipient.registrationId}`
      } satisfies Prisma.NotificationOutboxCreateManyInput;
    });

    return this.notificationsDb.createNotifications(rows);
  }

  async processPendingNotifications(limit = 20): Promise<NotificationProcessResult> {
    const selected = await this.notificationsDb.findPendingNotifications({ now: new Date(), limit });
    const result: NotificationProcessResult = {
      selected: selected.length,
      processed: 0,
      sent: 0,
      skipped: 0,
      failed: 0,
      retried: 0
    };

    for (const notification of selected) {
      const claimed = await this.notificationsDb.markProcessing(notification.id);
      if (!claimed) {
        continue;
      }

      result.processed += 1;
      const processResult = await this.processOne(claimed);
      result[processResult] += 1;
    }

    return result;
  }

  private async enqueueRegistrationNotification(type: NotificationType, input: RegistrationNotificationInput) {
    const template = this.templates.render({
      type,
      recipientName: input.recipientName,
      tournamentTitle: input.tournamentTitle,
      tournamentSlug: input.tournamentSlug,
      categoryName: input.categoryName,
      reason: input.reason,
      actionPath: input.tournamentSlug ? `/tournaments/${input.tournamentSlug}` : "/account/registrations"
    });

    return this.createNotificationIgnoringDuplicate({
      type,
      channel: NotificationChannel.EMAIL,
      recipientUserId: input.recipientUserId,
      recipientEmail: this.cleanEmail(input.recipientEmail),
      recipientName: input.recipientName,
      tournamentId: input.tournamentId,
      tournamentCategoryId: input.tournamentCategoryId,
      registrationId: input.registrationId,
      subject: template.subject,
      payload: this.buildPayload(template, {
        tournament_title: input.tournamentTitle,
        tournament_slug: input.tournamentSlug ?? null,
        tournament_category_name: input.categoryName ?? null,
        reason: input.reason ?? null
      }),
      idempotencyKey: `${type}:${input.registrationId}`
    });
  }

  private paymentNotificationType(status: RegistrationPaymentStatus): NotificationType | null {
    switch (status) {
      case RegistrationPaymentStatus.PAID:
        return NotificationType.PAYMENT_MARKED_PAID;
      case RegistrationPaymentStatus.FAILED:
        return NotificationType.PAYMENT_MARKED_FAILED;
      case RegistrationPaymentStatus.WAIVED:
        return NotificationType.PAYMENT_WAIVED;
      default:
        return null;
    }
  }

  private async createNotificationIgnoringDuplicate(input: Prisma.NotificationOutboxUncheckedCreateInput) {
    try {
      return await this.notificationsDb.createNotification(input);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        return null;
      }
      throw error;
    }
  }

  private async processOne(notification: NotificationOutbox): Promise<"sent" | "skipped" | "failed" | "retried"> {
    const providerName = this.emailProvider.getProviderName();
    if (!notification.recipientEmail) {
      await this.notificationsDb.markSkipped({
        id: notification.id,
        provider: providerName,
        reason: "Recipient email is missing"
      });
      return "skipped";
    }

    try {
      const payload = this.extractPayload(notification.payload);
      const delivery = await this.emailProvider.send({
        notificationId: notification.id,
        to: notification.recipientEmail,
        recipientName: notification.recipientName,
        subject: notification.subject ?? "Tournament update",
        text: payload.text,
        html: payload.html
      });

      await this.notificationsDb.markSent({
        id: notification.id,
        provider: delivery.provider,
        providerMessageId: delivery.providerMessageId
      });
      return "sent";
    } catch (error) {
      const message = this.cleanError(error);
      if (notification.attempts >= notification.maxAttempts) {
        await this.notificationsDb.markFailed({ id: notification.id, error: message });
        return "failed";
      }

      await this.notificationsDb.markRetry({
        id: notification.id,
        error: message,
        nextScheduledAt: new Date(Date.now() + 60_000)
      });
      return "retried";
    }
  }

  private buildPayload(template: ReturnType<NotificationTemplateService["render"]>, metadata: Prisma.InputJsonObject) {
    return {
      text: template.text,
      html: template.html,
      action_url: template.actionUrl,
      metadata
    } satisfies Prisma.InputJsonObject;
  }

  private extractPayload(payload: Prisma.JsonValue) {
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const record = payload as Record<string, unknown>;
      return {
        text: typeof record.text === "string" ? record.text : "Tournament update",
        html: typeof record.html === "string" ? record.html : "<p>Tournament update</p>"
      };
    }

    return {
      text: "Tournament update",
      html: "<p>Tournament update</p>"
    };
  }

  private cleanEmail(value?: string | null) {
    return value?.trim().toLowerCase() || null;
  }

  private isUniqueConstraintError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }

  private cleanError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return message.slice(0, 1000);
  }
}
