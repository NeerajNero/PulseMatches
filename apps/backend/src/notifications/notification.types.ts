import { NotificationType } from "@prisma/client";

export interface NotificationTemplateInput {
  type: NotificationType;
  recipientName?: string | null;
  tournamentTitle?: string | null;
  tournamentSlug?: string | null;
  categoryName?: string | null;
  fixtureSetName?: string | null;
  actionPath?: string | null;
  reason?: string | null;
  paymentStatus?: string | null;
  amount?: number | null;
  currency?: string | null;
}

export interface RenderedNotificationTemplate {
  subject: string;
  text: string;
  html: string;
  actionUrl: string | null;
}

export interface EmailDeliveryInput {
  notificationId: string;
  to: string;
  recipientName?: string | null;
  subject: string;
  text: string;
  html: string;
}

export interface EmailDeliveryResult {
  provider: string;
  providerMessageId?: string | null;
}
