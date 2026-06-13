import { Injectable } from "@nestjs/common";
import { Prisma, TournamentCategory, User } from "@prisma/client";
import {
  OrganizerPaymentAttemptDiagnosticDto,
  OrganizerPaymentDetailDto,
  OrganizerParticipantDto,
  OrganizerPaymentEventDiagnosticDto,
  OrganizerPaymentDto,
  OrganizerPaymentIntentDiagnosticDto,
  OrganizerPaymentRefundDto,
  OrganizerRegistrationDto,
  OrganizerRosterUserSummaryDto,
  OrganizerTeamDto,
  OrganizerTeamMemberDto
} from "./dto/organizer-roster.dto";
import {
  OrganizerPaymentDetailWithRelations,
  OrganizerParticipantWithRelations,
  OrganizerRegistrationWithRelations,
  OrganizerTeamMemberWithRelations,
  OrganizerTeamWithRelations
} from "../../db/organizer-rosters/organizer-rosters.repository";
import { RegistrationCategorySummaryDto } from "../registrations/dto/registration.dto";

type OrganizerPaymentIntentDiagnostic = OrganizerPaymentDetailWithRelations["paymentIntents"][number];
type OrganizerPaymentAttemptDiagnostic = OrganizerPaymentIntentDiagnostic["attempts"][number];
type OrganizerPaymentEventDiagnostic = OrganizerPaymentIntentDiagnostic["events"][number] | OrganizerPaymentDetailWithRelations["paymentEvents"][number];
type OrganizerPaymentRefundDiagnostic = OrganizerPaymentDetailWithRelations["paymentRefunds"][number];

@Injectable()
export class OrganizerRostersTransform {
  toRegistration(registration: OrganizerRegistrationWithRelations): OrganizerRegistrationDto {
    return {
      id: registration.id,
      status: this.toApiEnum(registration.status),
      payment_mode: this.toApiEnum(registration.paymentRecord?.mode ?? registration.paymentMode),
      payment_status: this.toApiEnum(registration.paymentRecord?.status ?? registration.paymentStatus),
      fee_amount: registration.paymentRecord?.amount ?? registration.feeAmount,
      fee_currency: registration.paymentRecord?.currency ?? registration.feeCurrency,
      player_name: registration.playerName,
      phone: registration.phone,
      notes: registration.notes,
      user: this.toUserSummary(registration.user),
      category: registration.tournamentCategory ? this.toCategorySummary(registration.tournamentCategory) : null,
      participant_id: registration.participant?.id ?? null,
      registered_at: registration.registeredAt.toISOString(),
      created_at: registration.createdAt.toISOString(),
      updated_at: registration.updatedAt.toISOString()
    };
  }

  toPayment(registration: OrganizerRegistrationWithRelations): OrganizerPaymentDto {
    const latestIntent = registration.paymentIntents[0] ?? null;
    const refunds = registration.paymentRecord?.paymentRefunds ?? [];
    const refundedAmount = refunds
      .filter((refund) => refund.status === "MANUAL_RECORDED" || refund.status === "SUCCEEDED")
      .reduce((total, refund) => total + refund.amount, 0);

    return {
      id: registration.paymentRecord?.id ?? registration.id,
      registration_id: registration.id,
      user: this.toUserSummary(registration.user),
      category: registration.tournamentCategory ? this.toCategorySummary(registration.tournamentCategory) : null,
      registration_status: this.toApiEnum(registration.status),
      payment_mode: this.toApiEnum(registration.paymentRecord?.mode ?? registration.paymentMode),
      payment_status: this.toApiEnum(registration.paymentRecord?.status ?? registration.paymentStatus),
      amount: registration.paymentRecord?.amount ?? registration.feeAmount,
      currency: registration.paymentRecord?.currency ?? registration.feeCurrency,
      player_name: registration.playerName,
      player_email: registration.user.email,
      reference: registration.paymentRecord?.reference ?? null,
      internal_notes: registration.paymentRecord?.internalNotes ?? null,
      paid_at: registration.paymentRecord?.paidAt?.toISOString() ?? null,
      payment_provider: registration.paymentRecord?.provider ? this.toApiEnum(registration.paymentRecord.provider) : null,
      latest_intent_status: latestIntent ? this.toApiEnum(latestIntent.status) : null,
      latest_intent_provider: latestIntent ? this.toApiEnum(latestIntent.provider) : null,
      latest_intent_reference: latestIntent?.providerIntentId ?? null,
      latest_intent_event_count: latestIntent?._count.events ?? 0,
      refund_count: refunds.length,
      refunded_amount: refundedAmount,
      latest_refund_status: refunds[0] ? this.toApiEnum(refunds[0].status) : null,
      created_at: (registration.paymentRecord?.createdAt ?? registration.createdAt).toISOString(),
      updated_at: (registration.paymentRecord?.updatedAt ?? registration.updatedAt).toISOString()
    };
  }

  toPaymentDetail(registration: OrganizerPaymentDetailWithRelations): OrganizerPaymentDetailDto {
    return {
      ...this.toPayment(registration),
      intents: registration.paymentIntents.map((intent) => this.toPaymentIntentDiagnostic(intent)),
      events: registration.paymentEvents.map((event) => this.toPaymentEventDiagnostic(event)),
      refunds: registration.paymentRefunds.map((refund) => this.toPaymentRefund(refund))
    };
  }

  toParticipant(participant: OrganizerParticipantWithRelations): OrganizerParticipantDto {
    return {
      id: participant.id,
      tournament_id: participant.tournamentId,
      category: participant.tournamentCategory ? this.toCategorySummary(participant.tournamentCategory) : null,
      registration_id: participant.registrationId,
      user: participant.user ? this.toUserSummary(participant.user) : null,
      display_name: participant.displayName,
      email: participant.email,
      phone: participant.phone,
      source: this.toApiEnum(participant.source),
      status: this.toApiEnum(participant.status),
      created_at: participant.createdAt.toISOString(),
      updated_at: participant.updatedAt.toISOString()
    };
  }

  toTeam(team: OrganizerTeamWithRelations): OrganizerTeamDto {
    return {
      id: team.id,
      tournament_id: team.tournamentId,
      category: team.tournamentCategory ? this.toCategorySummary(team.tournamentCategory) : null,
      name: team.name,
      status: this.toApiEnum(team.status),
      seed: team.seed,
      member_count: team.members.length,
      members: team.members.map((member) => this.toTeamMember(member)),
      created_at: team.createdAt.toISOString(),
      updated_at: team.updatedAt.toISOString()
    };
  }

  toTeamMember(member: OrganizerTeamMemberWithRelations): OrganizerTeamMemberDto {
    return {
      id: member.id,
      team_id: member.teamId,
      participant_id: member.participantId,
      user_id: member.userId,
      display_name: member.displayName,
      email: member.email,
      phone: member.phone,
      role: this.toApiEnum(member.role),
      created_at: member.createdAt.toISOString(),
      updated_at: member.updatedAt.toISOString()
    };
  }

  private toPaymentIntentDiagnostic(intent: OrganizerPaymentIntentDiagnostic): OrganizerPaymentIntentDiagnosticDto {
    return {
      id: intent.id,
      provider: this.toApiEnum(intent.provider),
      mode: this.toApiEnum(intent.mode),
      status: this.toApiEnum(intent.status),
      amount: intent.amount,
      currency: intent.currency,
      provider_intent_id: intent.providerIntentId,
      expires_at: intent.expiresAt?.toISOString() ?? null,
      event_count: intent._count.events,
      attempt_count: intent._count.attempts,
      attempts: intent.attempts.map((attempt) => this.toPaymentAttemptDiagnostic(attempt)),
      events: intent.events.map((event) => this.toPaymentEventDiagnostic(event)),
      refunds: intent.refunds.map((refund) => this.toPaymentRefund(refund)),
      created_at: intent.createdAt.toISOString(),
      updated_at: intent.updatedAt.toISOString()
    };
  }

  private toPaymentAttemptDiagnostic(attempt: OrganizerPaymentAttemptDiagnostic): OrganizerPaymentAttemptDiagnosticDto {
    return {
      id: attempt.id,
      provider: this.toApiEnum(attempt.provider),
      status: this.toApiEnum(attempt.status),
      provider_attempt_id: attempt.providerAttemptId,
      error_code: attempt.errorCode,
      error_message: attempt.errorMessage,
      created_at: attempt.createdAt.toISOString(),
      updated_at: attempt.updatedAt.toISOString()
    };
  }

  private toPaymentEventDiagnostic(event: OrganizerPaymentEventDiagnostic): OrganizerPaymentEventDiagnosticDto {
    return {
      id: event.id,
      provider: this.toApiEnum(event.provider),
      event_type: event.eventType,
      provider_event_id: event.providerEventId,
      signature_valid: event.signatureValid,
      processed_at: event.processedAt?.toISOString() ?? null,
      payload_summary: this.toSafePayloadSummary(event.payload),
      created_at: event.createdAt.toISOString()
    };
  }

  private toPaymentRefund(refund: OrganizerPaymentRefundDiagnostic): OrganizerPaymentRefundDto {
    return {
      id: refund.id,
      provider: this.toApiEnum(refund.provider),
      status: this.toApiEnum(refund.status),
      amount: refund.amount,
      currency: refund.currency,
      reason: refund.reason,
      internal_notes: refund.internalNotes,
      provider_refund_id: refund.providerRefundId,
      processed_at: refund.processedAt?.toISOString() ?? null,
      created_at: refund.createdAt.toISOString(),
      updated_at: refund.updatedAt.toISOString()
    };
  }

  private toUserSummary(user: User): OrganizerRosterUserSummaryDto {
    return {
      id: user.id,
      email: user.email,
      display_name: user.displayName
    };
  }

  private toCategorySummary(category: TournamentCategory): RegistrationCategorySummaryDto {
    return {
      id: category.id,
      name: category.name,
      code: category.code,
      format_type: this.toApiEnum(category.formatType),
      participant_type: this.toApiEnum(category.participantType),
      gender_type: this.toApiEnum(category.genderType),
      entry_fee_amount: category.entryFeeAmount,
      entry_fee_currency: category.entryFeeCurrency
    };
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }

  private toSafePayloadSummary(payload: Prisma.JsonValue): Record<string, unknown> {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return {};
    }

    const allowedKeys = [
      "amount",
      "currency",
      "status",
      "refund_id",
      "provider_intent_id",
      "provider_payment_id",
      "razorpay_order_id",
      "razorpay_payment_id",
      "event"
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
}
