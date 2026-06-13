import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  AdminAuditEventDto,
  AdminDashboardDto,
  AdminListDto,
  AdminNotificationDto,
  AdminOrganizerDetailDto,
  AdminOrganizerDto,
  AdminPaymentAttemptDto,
  AdminPaymentDetailDto,
  AdminPaymentDto,
  AdminPaymentEventDto,
  AdminPaymentIntentDto,
  AdminPaymentRefundDto,
  AdminPaginationDto,
  AdminReconciliationRunDto,
  AdminRegistrationDto,
  AdminTournamentDto,
  AdminUserDto,
  AdminUserSummaryDto
} from "./dto/admin.dto";
import {
  AdminAuditWithRelations,
  AdminOrganizerDetailWithRelations,
  AdminOrganizerWithRelations,
  AdminPaymentDetailWithRelations,
  AdminPaymentWithRelations,
  AdminRegistrationWithRelations,
  AdminTournamentWithRelations,
  AdminUserWithRelations
} from "../../db/admin/admin.repository";

@Injectable()
export class AdminTransform {
  toDashboard(input: Awaited<ReturnType<import("../../db/admin/admin-db.service").AdminDbService["getDashboardCounts"]>>): AdminDashboardDto {
    return {
      total_users: input.totalUsers,
      total_organizers: input.totalOrganizers,
      total_tournaments: input.totalTournaments,
      published_tournaments: input.publishedTournaments,
      draft_tournaments: input.draftTournaments,
      total_registrations: input.totalRegistrations,
      pending_registrations: input.pendingRegistrations,
      paid_payments: input.paidPayments,
      pending_payments: input.pendingPayments,
      failed_payments: input.failedPayments,
      refund_count: input.refundCount,
      pending_notifications: input.pendingNotifications,
      failed_notifications: input.failedNotifications,
      recent_reconciliation_status: input.recentReconciliation ? this.toApiEnum(input.recentReconciliation.status) : null,
      recent_reconciliation_provider: input.recentReconciliation ? this.toApiEnum(input.recentReconciliation.provider) : null,
      recent_reconciliation_started_at: input.recentReconciliation?.startedAt.toISOString() ?? null
    };
  }

  toList<TItem>(items: TItem[], page: number, limit: number, total: number): AdminListDto<TItem> {
    return {
      items,
      pagination: this.toPagination(page, limit, total)
    };
  }

  toUser(user: AdminUserWithRelations): AdminUserDto {
    return {
      id: user.id,
      email: user.email,
      display_name: user.displayName,
      roles: user.roles.map((role) => role.role),
      status: this.toApiEnum(user.status),
      organizer: user.organizerProfile
        ? {
          id: user.organizerProfile.id,
          organization_name: user.organizerProfile.organizationName,
          verification_status: this.toApiEnum(user.organizerProfile.verificationStatus),
          status: this.toApiEnum(user.organizerProfile.status)
        }
        : null,
      registration_count: user._count.registrations,
      created_at: user.createdAt.toISOString()
    };
  }

  toOrganizer(organizer: AdminOrganizerWithRelations): AdminOrganizerDto {
    return {
      id: organizer.id,
      organization_name: organizer.organizationName,
      slug: organizer.slug,
      verification_status: this.toApiEnum(organizer.verificationStatus),
      status: this.toApiEnum(organizer.status),
      user: this.toUserSummary(organizer.user),
      tournament_count: organizer._count.tournaments,
      created_at: organizer.createdAt.toISOString()
    };
  }

  toOrganizerDetail(organizer: AdminOrganizerDetailWithRelations): AdminOrganizerDetailDto {
    return {
      ...this.toOrganizer(organizer),
      tournaments: organizer.tournaments.map((tournament) => ({
        id: tournament.id,
        title: tournament.title,
        slug: tournament.slug,
        status: this.toApiEnum(tournament.status),
        registration_count: tournament._count.registrations,
        created_at: tournament.createdAt.toISOString()
      })),
      audit_events: organizer.auditEvents.map((audit) => this.toAuditEvent(audit))
    };
  }

  toTournament(tournament: AdminTournamentWithRelations): AdminTournamentDto {
    return {
      id: tournament.id,
      title: tournament.title,
      slug: tournament.slug,
      status: this.toApiEnum(tournament.status),
      visibility: this.toApiEnum(tournament.visibility),
      sport: tournament.sport.name,
      city: tournament.city.name,
      organizer: {
        id: tournament.organizerProfile.id,
        organization_name: tournament.organizerProfile.organizationName,
        verification_status: this.toApiEnum(tournament.organizerProfile.verificationStatus),
        user: this.toUserSummary(tournament.organizerProfile.user)
      },
      registration_count: tournament._count.registrations,
      created_at: tournament.createdAt.toISOString()
    };
  }

  toRegistration(registration: AdminRegistrationWithRelations): AdminRegistrationDto {
    return {
      id: registration.id,
      player: this.toUserSummary(registration.user),
      player_name: registration.playerName,
      tournament_id: registration.tournament.id,
      tournament_title: registration.tournament.title,
      category_name: registration.tournamentCategory?.name ?? null,
      status: this.toApiEnum(registration.status),
      payment_status: this.toApiEnum(registration.paymentRecord?.status ?? registration.paymentStatus),
      created_at: registration.createdAt.toISOString()
    };
  }

  toPayment(payment: AdminPaymentWithRelations): AdminPaymentDto {
    const refundedAmount = this.getRefundedAmount(payment.paymentRefunds);
    return {
      id: payment.id,
      registration_id: payment.registrationId,
      tournament_id: payment.tournamentId,
      tournament_title: payment.registration.tournament.title,
      player: this.toUserSummary(payment.registration.user),
      provider: this.toApiEnum(payment.provider),
      mode: this.toApiEnum(payment.mode),
      status: this.toApiEnum(payment.status),
      amount: payment.amount,
      currency: payment.currency,
      paid_at: payment.paidAt?.toISOString() ?? null,
      refund_count: payment._count.paymentRefunds,
      refunded_amount: refundedAmount,
      latest_intent_status: payment.paymentIntents[0] ? this.toApiEnum(payment.paymentIntents[0].status) : null,
      event_count: payment._count.paymentEvents,
      updated_at: payment.updatedAt.toISOString()
    };
  }

  toPaymentDetail(payment: AdminPaymentDetailWithRelations): AdminPaymentDetailDto {
    const base = this.toPayment({
      ...payment,
      paymentIntents: payment.paymentIntents.slice(0, 1).map((intent) => ({ status: intent.status })),
      paymentRefunds: payment.paymentRefunds,
      _count: payment._count
    } as AdminPaymentWithRelations);

    return {
      ...base,
      reference: payment.reference,
      category_name: payment.registration.tournamentCategory?.name ?? null,
      intents: payment.paymentIntents.map((intent) => this.toPaymentIntent(intent)),
      events: payment.paymentEvents.map((event) => this.toPaymentEvent(event)),
      refunds: payment.paymentRefunds.map((refund) => this.toPaymentRefund(refund))
    };
  }

  toNotification(notification: {
    id: string;
    type: string;
    channel: string;
    status: string;
    recipientEmail: string | null;
    attempts: number;
    provider: string | null;
    lastError: string | null;
    processedAt: Date | null;
    createdAt: Date;
  }): AdminNotificationDto {
    return {
      id: notification.id,
      type: this.toApiEnum(notification.type),
      channel: this.toApiEnum(notification.channel),
      status: this.toApiEnum(notification.status),
      recipient_email: this.maskEmail(notification.recipientEmail),
      attempts: notification.attempts,
      provider: notification.provider,
      last_error: this.truncate(notification.lastError, 300),
      processed_at: notification.processedAt?.toISOString() ?? null,
      created_at: notification.createdAt.toISOString()
    };
  }

  toReconciliationRun(run: {
    id: string;
    provider: string;
    status: string;
    checkedCount: number;
    updatedCount: number;
    failedCount: number;
    error: string | null;
    startedAt: Date;
    completedAt: Date | null;
  }): AdminReconciliationRunDto {
    return {
      id: run.id,
      provider: this.toApiEnum(run.provider),
      status: this.toApiEnum(run.status),
      checked_count: run.checkedCount,
      updated_count: run.updatedCount,
      failed_count: run.failedCount,
      error: this.truncate(run.error, 300),
      started_at: run.startedAt.toISOString(),
      completed_at: run.completedAt?.toISOString() ?? null
    };
  }

  toAuditEvent(audit: AdminAuditWithRelations): AdminAuditEventDto {
    return {
      id: audit.id,
      actor: audit.actor ? this.toUserSummary(audit.actor) : null,
      entity_type: audit.entityType,
      entity_id: audit.entityId,
      action: audit.action,
      metadata_summary: this.toSafePayloadSummary(audit.metadata),
      created_at: audit.createdAt.toISOString()
    };
  }

  private toPaymentIntent(intent: AdminPaymentDetailWithRelations["paymentIntents"][number]): AdminPaymentIntentDto {
    return {
      id: intent.id,
      provider: this.toApiEnum(intent.provider),
      mode: this.toApiEnum(intent.mode),
      status: this.toApiEnum(intent.status),
      amount: intent.amount,
      currency: intent.currency,
      provider_intent_id: intent.providerIntentId,
      expires_at: intent.expiresAt?.toISOString() ?? null,
      attempts: intent.attempts.map((attempt) => this.toPaymentAttempt(attempt)),
      events: intent.events.map((event) => this.toPaymentEvent(event)),
      created_at: intent.createdAt.toISOString()
    };
  }

  private toPaymentAttempt(attempt: AdminPaymentDetailWithRelations["paymentIntents"][number]["attempts"][number]): AdminPaymentAttemptDto {
    return {
      id: attempt.id,
      provider: this.toApiEnum(attempt.provider),
      status: this.toApiEnum(attempt.status),
      provider_attempt_id: attempt.providerAttemptId,
      error_code: attempt.errorCode,
      error_message: this.truncate(attempt.errorMessage, 300),
      created_at: attempt.createdAt.toISOString()
    };
  }

  private toPaymentEvent(event: AdminPaymentDetailWithRelations["paymentEvents"][number]): AdminPaymentEventDto {
    return {
      id: event.id,
      provider: this.toApiEnum(event.provider),
      event_type: event.eventType,
      provider_event_id: event.providerEventId,
      signature_valid: event.signatureValid,
      payload_summary: this.toSafePayloadSummary(event.payload),
      created_at: event.createdAt.toISOString()
    };
  }

  private toPaymentRefund(refund: AdminPaymentDetailWithRelations["paymentRefunds"][number]): AdminPaymentRefundDto {
    return {
      id: refund.id,
      provider: this.toApiEnum(refund.provider),
      status: this.toApiEnum(refund.status),
      amount: refund.amount,
      currency: refund.currency,
      reason: refund.reason,
      provider_refund_id: refund.providerRefundId,
      processed_at: refund.processedAt?.toISOString() ?? null,
      created_at: refund.createdAt.toISOString()
    };
  }

  private toPagination(page: number, limit: number, total: number): AdminPaginationDto {
    return {
      page,
      limit,
      total,
      total_pages: Math.max(1, Math.ceil(total / limit))
    };
  }

  private toUserSummary(user: { id: string; email: string; displayName: string }): AdminUserSummaryDto {
    return {
      id: user.id,
      email: user.email,
      display_name: user.displayName
    };
  }

  private toSafePayloadSummary(payload: Prisma.JsonValue): Record<string, unknown> {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return {};
    }

    const allowedKeys = [
      "action",
      "amount",
      "currency",
      "event",
      "provider",
      "provider_event_id",
      "provider_intent_id",
      "provider_payment_id",
      "razorpay_order_id",
      "razorpay_payment_id",
      "admin_user_id",
      "actor_user_id",
      "export_type",
      "exported_at",
      "fixture_set_id",
      "notification_id",
      "organizer_profile_id",
      "organizer_user_id",
      "previous_status",
      "next_status",
      "reason",
      "refund_id",
      "registration_id",
      "role",
      "row_count",
      "status",
      "tournament_id",
      "updated_status"
    ];
    const source = payload as Record<string, unknown>;
    return allowedKeys.reduce<Record<string, unknown>>((summary, key) => {
      const value = source[key];
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        summary[key] = value;
      }
      return summary;
    }, {});
  }

  private getRefundedAmount(refunds: Array<{ status: string; amount: number }>): number {
    return refunds
      .filter((refund) => refund.status === "MANUAL_RECORDED" || refund.status === "SUCCEEDED")
      .reduce((total, refund) => total + refund.amount, 0);
  }

  private maskEmail(email: string | null): string | null {
    if (!email) {
      return null;
    }
    const [local, domain] = email.split("@");
    if (!local || !domain) {
      return "***";
    }
    return `${local.slice(0, 1)}***@${domain}`;
  }

  private truncate(value: string | null, maxLength: number): string | null {
    if (!value || value.length <= maxLength) {
      return value;
    }
    return `${value.slice(0, maxLength)}...`;
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
