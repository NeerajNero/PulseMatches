import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NotificationType } from "@prisma/client";
import { NotificationTemplateInput, RenderedNotificationTemplate } from "./notification.types";

@Injectable()
export class NotificationTemplateService {
  constructor(private readonly config: ConfigService) {}

  render(input: NotificationTemplateInput): RenderedNotificationTemplate {
    const appName = this.config.get<string>("NEXT_PUBLIC_APP_NAME", "MatchFlow Arena");
    const tournamentTitle = input.tournamentTitle ?? "your tournament";
    const categoryPart = input.categoryName ? ` (${input.categoryName})` : "";
    const actionUrl = this.buildActionUrl(input.actionPath);
    const greeting = input.recipientName ? `Hi ${input.recipientName},` : "Hi,";
    const message = this.messageFor(
      input.type,
      tournamentTitle,
      categoryPart,
      input.fixtureSetName,
      input.reason,
      input.amount,
      input.currency
    );
    const actionLine = actionUrl ? `\n\nView details: ${actionUrl}` : "";
    const text = `${greeting}\n\n${message}${actionLine}\n\n${appName}`;
    const html = [
      `<p>${this.escapeHtml(greeting)}</p>`,
      `<p>${this.escapeHtml(message)}</p>`,
      actionUrl ? `<p><a href="${this.escapeHtml(actionUrl)}">View details</a></p>` : "",
      `<p>${this.escapeHtml(appName)}</p>`
    ].filter(Boolean).join("");

    return {
      subject: this.subjectFor(input.type, tournamentTitle),
      text,
      html,
      actionUrl
    };
  }

  private subjectFor(type: NotificationType, tournamentTitle: string) {
    switch (type) {
      case NotificationType.REGISTRATION_CREATED:
        return `Registration received for ${tournamentTitle}`;
      case NotificationType.REGISTRATION_APPROVED:
        return `Registration approved for ${tournamentTitle}`;
      case NotificationType.REGISTRATION_REJECTED:
        return `Registration update for ${tournamentTitle}`;
      case NotificationType.REGISTRATION_CANCELLED:
        return `Registration cancelled for ${tournamentTitle}`;
      case NotificationType.RESULTS_PUBLISHED:
        return `Fixtures and results published for ${tournamentTitle}`;
      case NotificationType.MATCH_SCHEDULE_UPDATED:
        return `Match schedule updated for ${tournamentTitle}`;
      case NotificationType.PAYMENT_MARKED_PAID:
        return `Payment marked paid for ${tournamentTitle}`;
      case NotificationType.PAYMENT_MARKED_FAILED:
        return `Payment update for ${tournamentTitle}`;
      case NotificationType.PAYMENT_WAIVED:
        return `Payment waived for ${tournamentTitle}`;
      default:
        return `Tournament update for ${tournamentTitle}`;
    }
  }

  private messageFor(
    type: NotificationType,
    tournamentTitle: string,
    categoryPart: string,
    fixtureSetName?: string | null,
    reason?: string | null,
    amount?: number | null,
    currency?: string | null
  ) {
    const amountPart = amount && amount > 0 ? ` (${currency ?? "INR"} ${amount})` : "";
    switch (type) {
      case NotificationType.REGISTRATION_CREATED:
        return `Your registration for ${tournamentTitle}${categoryPart} has been received and is pending organizer review.`;
      case NotificationType.REGISTRATION_APPROVED:
        return `Your registration for ${tournamentTitle}${categoryPart} has been approved.`;
      case NotificationType.REGISTRATION_REJECTED:
        return `Your registration for ${tournamentTitle}${categoryPart} was not approved.${reason ? ` Reason: ${reason}` : ""}`;
      case NotificationType.REGISTRATION_CANCELLED:
        return `Your registration for ${tournamentTitle}${categoryPart} has been cancelled.`;
      case NotificationType.RESULTS_PUBLISHED:
        return `${fixtureSetName ?? "Fixtures and results"} for ${tournamentTitle}${categoryPart} are now available.`;
      case NotificationType.MATCH_SCHEDULE_UPDATED:
        return `A match schedule was updated for ${tournamentTitle}${categoryPart}.`;
      case NotificationType.PAYMENT_MARKED_PAID:
        return `Your offline payment${amountPart} for ${tournamentTitle}${categoryPart} has been marked as paid by the organizer.`;
      case NotificationType.PAYMENT_MARKED_FAILED:
        return `Your offline payment${amountPart} for ${tournamentTitle}${categoryPart} could not be verified. Please contact the organizer for next steps.`;
      case NotificationType.PAYMENT_WAIVED:
        return `The organizer has waived your offline payment${amountPart} for ${tournamentTitle}${categoryPart}.`;
      default:
        return `There is an update for ${tournamentTitle}${categoryPart}.`;
    }
  }

  private buildActionUrl(path?: string | null) {
    if (!path) {
      return null;
    }
    const baseUrl = this.config.get<string>("FE_APP_URL", "http://localhost:3002").replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
}
