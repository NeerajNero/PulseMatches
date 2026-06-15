import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  PaymentProvider,
  PaymentRefundStatus,
  ParticipantSource,
  ParticipantType,
  Prisma,
  RegistrationPaymentMode,
  RegistrationPaymentStatus,
  RegistrationStatus,
  RosterParticipantStatus,
  TeamMemberRole,
  TeamStatus,
  TournamentCategory,
  TournamentCategoryStatus
} from "@prisma/client";
import { createCsv, type CsvRow } from "../../common/utils/csv.util";
import { parseDateRange, toCreatedAtRange } from "../../common/utils/date-range.util";
import { OrganizerRostersDbService } from "../../db/organizer-rosters/organizer-rosters-db.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { AuthenticatedUser } from "../auth/auth.types";
import {
  CreateParticipantRequestDto,
  CreatePaymentRefundRequestDto,
  CreateTeamMemberRequestDto,
  CreateTeamRequestDto,
  OrganizerParticipantListQueryDto,
  OrganizerPaymentListQueryDto,
  OrganizerReportDateRangeQueryDto,
  OrganizerRegistrationListQueryDto,
  OrganizerRosterListQueryDto,
  OrganizerTeamListQueryDto,
  RejectRegistrationRequestDto,
  UpdateRegistrationPaymentRequestDto,
  UpdateParticipantRequestDto,
  UpdateTeamMemberRequestDto,
  UpdateTeamRequestDto
} from "./dto/organizer-roster.dto";
import { OrganizerRostersTransform } from "./organizer-rosters.transform";

@Injectable()
export class OrganizerRostersService {
  constructor(
    private readonly organizerRostersDb: OrganizerRostersDbService,
    private readonly notifications: NotificationsService,
    private readonly transform: OrganizerRostersTransform,
    private readonly config: ConfigService
  ) {}

  async getSummary(currentUser: AuthenticatedUser, tournamentId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const [registrationsTotal, registrationsPending, participantsActive, teamsActive] = await Promise.all([
      this.organizerRostersDb.countRegistrations({ tournamentId }),
      this.organizerRostersDb.countRegistrations({ tournamentId, status: RegistrationStatus.PENDING }),
      this.organizerRostersDb.countParticipants({ tournamentId, status: RosterParticipantStatus.ACTIVE }),
      this.organizerRostersDb.countTeams({ tournamentId, status: TeamStatus.ACTIVE })
    ]);

    return {
      registrations_total: registrationsTotal,
      registrations_pending: registrationsPending,
      participants_active: participantsActive,
      teams_active: teamsActive
    };
  }

  async getReportSummary(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerReportDateRangeQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const dateRange = parseDateRange(query);
    const summary = await this.organizerRostersDb.getTournamentReportSummary({
      tournamentId,
      createdAt: toCreatedAtRange(dateRange)
    });

    return {
      registrations_by_status: summary.registrationsByStatus.map((item) => ({
        status: this.toApiEnum(item.status),
        count: item._count._all
      })),
      payments_by_status: summary.paymentsByStatus.map((item) => ({
        status: this.toApiEnum(item.status),
        count: item._count._all
      })),
      total_collected_amount: summary.totalCollectedAmount,
      total_refunded_amount: summary.totalRefundedAmount,
      participant_count: summary.participantCount,
      team_count: summary.teamCount,
      fixture_count: summary.fixtureCount,
      completed_match_count: summary.completedMatchCount,
      pending_notification_count: summary.pendingNotificationCount
    };
  }

  async findRegistrations(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerRegistrationListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const registrations = await this.organizerRostersDb.findRegistrations(this.buildRegistrationWhere(tournamentId, query));
    return registrations.map((registration) => this.transform.toRegistration(registration));
  }

  async exportRegistrations(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerRegistrationListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const limit = this.getExportLimit();
    const registrations = await this.organizerRostersDb.findRegistrations(this.buildRegistrationWhere(tournamentId, query), limit + 1);
    this.assertExportLimit(registrations.length, limit);
    const rows = registrations.map((registration) => ({
      registrationId: registration.id,
      playerName: registration.playerName,
      playerEmail: registration.user.email,
      category: registration.tournamentCategory?.name ?? "Tournament-level",
      registrationStatus: this.toApiEnum(registration.status),
      paymentStatus: this.toApiEnum(registration.paymentRecord?.status ?? registration.paymentStatus),
      amount: registration.paymentRecord?.amount ?? registration.feeAmount,
      currency: registration.paymentRecord?.currency ?? registration.feeCurrency,
      createdAt: registration.createdAt.toISOString()
    } satisfies CsvRow));

    await this.auditExport(currentUser.id, tournamentId, "organizer.export_registrations", query, rows.length);
    return this.toCsvExport("registrations", tournamentId, [
      "registrationId",
      "playerName",
      "playerEmail",
      "category",
      "registrationStatus",
      "paymentStatus",
      "amount",
      "currency",
      "createdAt"
    ], rows);
  }

  async exportRegistrationReport(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    query: OrganizerRegistrationListQueryDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const limit = this.getExportLimit();
    const registrations = await this.organizerRostersDb.findRegistrations(this.buildRegistrationWhere(tournamentId, query), limit + 1);
    this.assertExportLimit(registrations.length, limit);
    const rows = registrations.map((registration) => ({
      registrationId: registration.id,
      playerName: registration.playerName,
      playerEmail: registration.user.email,
      category: registration.tournamentCategory?.name ?? "Tournament-level",
      registrationStatus: this.toApiEnum(registration.status),
      paymentStatus: this.toApiEnum(registration.paymentRecord?.status ?? registration.paymentStatus),
      amount: registration.paymentRecord?.amount ?? registration.feeAmount,
      currency: registration.paymentRecord?.currency ?? registration.feeCurrency,
      createdAt: registration.createdAt.toISOString()
    } satisfies CsvRow));

    await this.auditExport(currentUser.id, tournamentId, "organizer.export_registration_report", query, rows.length);
    return this.toCsvExport("registration-report", tournamentId, [
      "registrationId",
      "playerName",
      "playerEmail",
      "category",
      "registrationStatus",
      "paymentStatus",
      "amount",
      "currency",
      "createdAt"
    ], rows);
  }

  async findPayments(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerPaymentListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const payments = await this.organizerRostersDb.findPayments(this.buildPaymentWhere(tournamentId, query));
    return payments.map((registration) => this.transform.toPayment(registration));
  }

  async exportPayments(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerPaymentListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const limit = this.getExportLimit();
    const payments = await this.organizerRostersDb.findPayments(this.buildPaymentWhere(tournamentId, query), limit + 1);
    this.assertExportLimit(payments.length, limit);
    const rows = payments.map((registration) => {
      const paymentRecord = registration.paymentRecord;
      const successfulRefund = paymentRecord?.paymentRefunds.find((refund) => (
        refund.status === PaymentRefundStatus.MANUAL_RECORDED || refund.status === PaymentRefundStatus.SUCCEEDED
      ));
      return {
        registrationId: registration.id,
        playerName: registration.playerName,
        playerEmail: registration.user.email,
        category: registration.tournamentCategory?.name ?? "Tournament-level",
        provider: paymentRecord ? this.toApiEnum(paymentRecord.provider) : "manual",
        mode: this.toApiEnum(paymentRecord?.mode ?? registration.paymentMode),
        paymentStatus: this.toApiEnum(paymentRecord?.status ?? registration.paymentStatus),
        amount: paymentRecord?.amount ?? registration.feeAmount,
        currency: paymentRecord?.currency ?? registration.feeCurrency,
        paidAt: paymentRecord?.paidAt?.toISOString() ?? "",
        refundStatus: successfulRefund ? this.toApiEnum(successfulRefund.status) : ""
      } satisfies CsvRow;
    });

    await this.auditExport(currentUser.id, tournamentId, "organizer.export_payments", query, rows.length);
    return this.toCsvExport("payments", tournamentId, [
      "registrationId",
      "playerName",
      "playerEmail",
      "category",
      "provider",
      "mode",
      "paymentStatus",
      "amount",
      "currency",
      "paidAt",
      "refundStatus"
    ], rows);
  }

  async exportPaymentReport(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerPaymentListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const limit = this.getExportLimit();
    const payments = await this.organizerRostersDb.findPayments(this.buildPaymentWhere(tournamentId, query), limit + 1);
    this.assertExportLimit(payments.length, limit);
    const rows = payments.map((registration) => {
      const paymentRecord = registration.paymentRecord;
      const successfulRefund = paymentRecord?.paymentRefunds.find((refund) => (
        refund.status === PaymentRefundStatus.MANUAL_RECORDED || refund.status === PaymentRefundStatus.SUCCEEDED
      ));
      return {
        registrationId: registration.id,
        playerName: registration.playerName,
        playerEmail: registration.user.email,
        category: registration.tournamentCategory?.name ?? "Tournament-level",
        provider: paymentRecord ? this.toApiEnum(paymentRecord.provider) : "manual",
        mode: this.toApiEnum(paymentRecord?.mode ?? registration.paymentMode),
        paymentStatus: this.toApiEnum(paymentRecord?.status ?? registration.paymentStatus),
        amount: paymentRecord?.amount ?? registration.feeAmount,
        currency: paymentRecord?.currency ?? registration.feeCurrency,
        paidAt: paymentRecord?.paidAt?.toISOString() ?? "",
        refundStatus: successfulRefund ? this.toApiEnum(successfulRefund.status) : "",
        createdAt: paymentRecord?.createdAt.toISOString() ?? registration.createdAt.toISOString()
      } satisfies CsvRow;
    });

    await this.auditExport(currentUser.id, tournamentId, "organizer.export_payment_report", query, rows.length);
    return this.toCsvExport("payment-report", tournamentId, [
      "registrationId",
      "playerName",
      "playerEmail",
      "category",
      "provider",
      "mode",
      "paymentStatus",
      "amount",
      "currency",
      "paidAt",
      "refundStatus",
      "createdAt"
    ], rows);
  }

  async findPaymentDetail(currentUser: AuthenticatedUser, tournamentId: string, registrationId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const registration = await this.requireOwnedPaymentDetail(registrationId, tournamentId);
    return this.transform.toPaymentDetail(registration);
  }

  async updateRegistrationPayment(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    registrationId: string,
    dto: UpdateRegistrationPaymentRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const registration = await this.requireOwnedRegistration(registrationId, tournamentId);

    if (registration.paymentMode === RegistrationPaymentMode.FREE || registration.feeAmount <= 0) {
      throw new BadRequestException("Payment tracking is not required for free registrations");
    }

    const paymentStatus = this.toPaymentStatus(dto.status);
    const paidAt = this.resolvePaidAt(paymentStatus, dto.paid_at, registration.paymentRecord?.paidAt ?? null);
    const updated = await this.organizerRostersDb.updateRegistrationPayment({
      registrationId,
      status: paymentStatus,
      reference: this.cleanNullableString(dto.reference),
      internalNotes: this.cleanNullableString(dto.internal_notes),
      paidAt,
      verifiedByOrganizerUserId: currentUser.id
    });

    await this.audit(currentUser.id, "payment_record", updated.paymentRecord?.id ?? registrationId, "payment.updated", {
      tournament_id: tournamentId,
      tournament_category_id: registration.tournamentCategoryId,
      registration_id: registrationId,
      payment_status: paymentStatus
    });

    await this.enqueuePaymentNotificationIfNeeded({
      registration: updated,
      tournament,
      status: paymentStatus
    });

    return this.transform.toPayment(updated);
  }

  async createPaymentRefund(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    registrationId: string,
    dto: CreatePaymentRefundRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const registration = await this.requireOwnedPaymentDetail(registrationId, tournamentId);

    const paymentRecord = registration.paymentRecord;
    if (!paymentRecord) {
      throw new NotFoundException("Payment record not found");
    }
    if (paymentRecord.status !== RegistrationPaymentStatus.PAID) {
      throw new BadRequestException("Refunds can only be recorded for paid payments");
    }

    const requestedStatus = this.toRefundStatus(dto.status ?? "manual_recorded");
    if (paymentRecord.provider === PaymentProvider.RAZORPAY && requestedStatus === PaymentRefundStatus.MANUAL_RECORDED) {
      throw new BadRequestException("Razorpay refunds can be requested, but provider execution is deferred");
    }

    const reservedRefundAmount = this.calculateReservedRefundAmount(registration.paymentRefunds);
    if (reservedRefundAmount + dto.amount > paymentRecord.amount) {
      throw new BadRequestException("Refund amount cannot exceed the paid amount");
    }

    const updated = await this.organizerRostersDb.createPaymentRefund({
      registrationId,
      amount: dto.amount,
      status: requestedStatus,
      reason: this.cleanOptionalString(dto.reason),
      internalNotes: this.cleanOptionalString(dto.internal_notes),
      requestedByUserId: currentUser.id,
      processedByUserId: requestedStatus === PaymentRefundStatus.MANUAL_RECORDED ? currentUser.id : null
    });

    await this.audit(currentUser.id, "payment_refund", updated.paymentRefunds[0]?.id ?? registrationId, "payment_refund.created", {
      tournament_id: tournamentId,
      tournament_category_id: registration.tournamentCategoryId,
      registration_id: registrationId,
      amount: dto.amount,
      status: requestedStatus
    });

    return this.transform.toPaymentDetail(updated);
  }

  async approveRegistration(currentUser: AuthenticatedUser, tournamentId: string, registrationId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const registration = await this.requireOwnedRegistration(registrationId, tournamentId);

    if (registration.status === RegistrationStatus.CONFIRMED && registration.participant) {
      return this.transform.toRegistration(registration);
    }

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException("Only pending registrations can be approved");
    }

    const category = registration.tournamentCategoryId
      ? await this.requireOwnedCategory(registration.tournamentCategoryId, tournamentId)
      : null;

    await this.assertRosterCapacity(tournament, category, registration.participant?.id);

    const updated = await this.organizerRostersDb.approveRegistrationAndCreateParticipant({
      registrationId,
      participant: {
        tournamentId,
        tournamentCategoryId: registration.tournamentCategoryId,
        registrationId,
        userId: registration.userId,
        displayName: registration.playerName,
        email: registration.user.email,
        phone: registration.phone,
        source: ParticipantSource.REGISTRATION,
        status: RosterParticipantStatus.ACTIVE
      }
    });

    await this.audit(currentUser.id, "registration", registrationId, "registration.approved", {
      tournament_id: tournamentId,
      tournament_category_id: registration.tournamentCategoryId
    });

    await this.notifications.enqueueRegistrationApproved({
      registrationId,
      recipientUserId: registration.userId,
      recipientEmail: registration.user.email,
      recipientName: registration.playerName,
      tournamentId,
      tournamentCategoryId: registration.tournamentCategoryId,
      tournamentTitle: tournament.title,
      tournamentSlug: tournament.slug,
      categoryName: registration.tournamentCategory?.name ?? null
    });

    return this.transform.toRegistration(updated);
  }

  async rejectRegistration(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    registrationId: string,
    dto: RejectRegistrationRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const registration = await this.requireOwnedRegistration(registrationId, tournamentId);

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException("Only pending registrations can be rejected");
    }

    const rejected = await this.organizerRostersDb.updateRegistrationStatus(registrationId, {
      status: RegistrationStatus.REJECTED
    });

    await this.audit(currentUser.id, "registration", registrationId, "registration.rejected", {
      tournament_id: tournamentId,
      tournament_category_id: registration.tournamentCategoryId,
      reason: this.cleanOptionalString(dto.reason)
    });

    await this.notifications.enqueueRegistrationRejected({
      registrationId,
      recipientUserId: registration.userId,
      recipientEmail: registration.user.email,
      recipientName: registration.playerName,
      tournamentId,
      tournamentCategoryId: registration.tournamentCategoryId,
      tournamentTitle: tournament.title,
      tournamentSlug: tournament.slug,
      categoryName: registration.tournamentCategory?.name ?? null,
      reason: this.cleanOptionalString(dto.reason)
    });

    return this.transform.toRegistration(rejected);
  }

  async cancelRegistration(currentUser: AuthenticatedUser, tournamentId: string, registrationId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const registration = await this.requireOwnedRegistration(registrationId, tournamentId);

    const cancellableStatuses: RegistrationStatus[] = [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED];
    if (!cancellableStatuses.includes(registration.status)) {
      throw new BadRequestException("Only pending or confirmed registrations can be cancelled");
    }

    const cancelled = await this.organizerRostersDb.updateRegistrationStatus(registrationId, {
      status: RegistrationStatus.CANCELLED,
      cancelledAt: new Date()
    });

    if (registration.participant?.id) {
      await this.organizerRostersDb.updateParticipant(registration.participant.id, {
        status: RosterParticipantStatus.WITHDRAWN
      });
    }

    await this.audit(currentUser.id, "registration", registrationId, "registration.organizer_cancelled", {
      tournament_id: tournamentId,
      tournament_category_id: registration.tournamentCategoryId
    });

    await this.notifications.enqueueRegistrationCancelled({
      registrationId,
      recipientUserId: registration.userId,
      recipientEmail: registration.user.email,
      recipientName: registration.playerName,
      tournamentId,
      tournamentCategoryId: registration.tournamentCategoryId,
      tournamentTitle: tournament.title,
      tournamentSlug: tournament.slug,
      categoryName: registration.tournamentCategory?.name ?? null
    });

    return this.transform.toRegistration(cancelled);
  }

  async findParticipants(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerParticipantListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const participants = await this.organizerRostersDb.findParticipants(this.buildParticipantWhere(tournamentId, query));
    return participants.map((participant) => this.transform.toParticipant(participant));
  }

  async exportParticipants(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerParticipantListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const limit = this.getExportLimit();
    const participants = await this.organizerRostersDb.findParticipants(this.buildParticipantWhere(tournamentId, query), limit + 1);
    this.assertExportLimit(participants.length, limit);
    const rows = participants.map((participant) => ({
      participantId: participant.id,
      displayName: participant.displayName,
      category: participant.tournamentCategory?.name ?? "Tournament-level",
      source: this.toApiEnum(participant.source),
      status: this.toApiEnum(participant.status),
      createdAt: participant.createdAt.toISOString()
    } satisfies CsvRow));

    await this.auditExport(currentUser.id, tournamentId, "organizer.export_participants", query, rows.length);
    return this.toCsvExport("participants", tournamentId, [
      "participantId",
      "displayName",
      "category",
      "source",
      "status",
      "createdAt"
    ], rows);
  }

  async createParticipant(currentUser: AuthenticatedUser, tournamentId: string, dto: CreateParticipantRequestDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const category = dto.tournament_category_id
      ? await this.requireOwnedCategory(dto.tournament_category_id, tournamentId)
      : null;

    await this.assertRosterCapacity(tournament, category);

    const participant = await this.organizerRostersDb.createParticipant({
      tournamentId,
      tournamentCategoryId: category?.id,
      displayName: dto.display_name.trim(),
      email: this.cleanEmail(dto.email),
      phone: this.cleanOptionalString(dto.phone),
      source: ParticipantSource.MANUAL,
      status: RosterParticipantStatus.ACTIVE
    });

    await this.audit(currentUser.id, "participant", participant.id, "participant.created", {
      tournament_id: tournamentId,
      tournament_category_id: category?.id ?? null,
      source: ParticipantSource.MANUAL
    });

    return this.transform.toParticipant(participant);
  }

  async updateParticipant(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    participantId: string,
    dto: UpdateParticipantRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const participant = await this.requireOwnedParticipant(participantId, tournamentId);
    const hasIdentityChange = dto.display_name !== undefined || dto.email !== undefined || dto.phone !== undefined
      || dto.tournament_category_id !== undefined;

    if (participant.source === ParticipantSource.REGISTRATION && hasIdentityChange) {
      throw new BadRequestException("Registration-backed participant identity cannot be edited here");
    }

    const nextCategory = dto.tournament_category_id === undefined
      ? participant.tournamentCategory
      : dto.tournament_category_id
        ? await this.requireOwnedCategory(dto.tournament_category_id, tournamentId)
        : null;

    const nextStatus = dto.status ?? participant.status;
    if (nextStatus === RosterParticipantStatus.ACTIVE) {
      await this.assertRosterCapacity(tournament, nextCategory, participant.id);
    }

    const updated = await this.organizerRostersDb.updateParticipant(participantId, {
      tournamentCategoryId: dto.tournament_category_id === undefined ? undefined : dto.tournament_category_id,
      displayName: dto.display_name?.trim(),
      email: this.cleanNullableEmail(dto.email),
      phone: this.cleanNullableString(dto.phone),
      status: dto.status
    });

    await this.audit(currentUser.id, "participant", participantId, "participant.updated", {
      tournament_id: tournamentId,
      tournament_category_id: nextCategory?.id ?? null
    });

    return this.transform.toParticipant(updated);
  }

  async deleteParticipant(currentUser: AuthenticatedUser, tournamentId: string, participantId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    await this.requireOwnedParticipant(participantId, tournamentId);

    const withdrawn = await this.organizerRostersDb.updateParticipant(participantId, {
      status: RosterParticipantStatus.WITHDRAWN
    });

    await this.audit(currentUser.id, "participant", participantId, "participant.withdrawn", {
      tournament_id: tournamentId
    });

    return this.transform.toParticipant(withdrawn);
  }

  async findTeams(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerTeamListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const teams = await this.organizerRostersDb.findTeams(this.buildTeamWhere(tournamentId, query));
    return teams.map((team) => this.transform.toTeam(team));
  }

  async exportTeams(currentUser: AuthenticatedUser, tournamentId: string, query: OrganizerTeamListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    if (query.category_id) {
      await this.requireOwnedCategory(query.category_id, tournamentId);
    }

    const limit = this.getExportLimit();
    const teams = await this.organizerRostersDb.findTeams(this.buildTeamWhere(tournamentId, query), limit + 1);
    this.assertExportLimit(teams.length, limit);
    const rows = teams.flatMap((team) => {
      if (team.members.length === 0) {
        return [{
          teamId: team.id,
          teamName: team.name,
          category: team.tournamentCategory?.name ?? "Tournament-level",
          teamStatus: this.toApiEnum(team.status),
          memberName: "",
          memberRole: "",
          createdAt: team.createdAt.toISOString()
        } satisfies CsvRow];
      }
      return team.members.map((member) => ({
        teamId: team.id,
        teamName: team.name,
        category: team.tournamentCategory?.name ?? "Tournament-level",
        teamStatus: this.toApiEnum(team.status),
        memberName: member.displayName,
        memberRole: this.toApiEnum(member.role),
        createdAt: team.createdAt.toISOString()
      } satisfies CsvRow));
    });

    await this.auditExport(currentUser.id, tournamentId, "organizer.export_teams", query, rows.length);
    return this.toCsvExport("teams", tournamentId, [
      "teamId",
      "teamName",
      "category",
      "teamStatus",
      "memberName",
      "memberRole",
      "createdAt"
    ], rows);
  }

  async createTeam(currentUser: AuthenticatedUser, tournamentId: string, dto: CreateTeamRequestDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const category = dto.tournament_category_id
      ? await this.requireOwnedCategory(dto.tournament_category_id, tournamentId)
      : null;

    this.assertTeamCategory(category);
    await this.assertTeamNameAvailable(tournamentId, category?.id ?? null, dto.name.trim());
    await this.assertTeamCapacity(tournament, category);

    const team = await this.organizerRostersDb.createTeam({
      tournamentId,
      tournamentCategoryId: category?.id,
      name: dto.name.trim(),
      seed: dto.seed,
      status: TeamStatus.ACTIVE
    });

    await this.audit(currentUser.id, "team", team.id, "team.created", {
      tournament_id: tournamentId,
      tournament_category_id: category?.id ?? null
    });

    return this.transform.toTeam(team);
  }

  async findTeam(currentUser: AuthenticatedUser, tournamentId: string, teamId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const team = await this.requireOwnedTeam(teamId, tournamentId);
    return this.transform.toTeam(team);
  }

  async updateTeam(currentUser: AuthenticatedUser, tournamentId: string, teamId: string, dto: UpdateTeamRequestDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    const team = await this.requireOwnedTeam(teamId, tournamentId);
    const nextCategory = dto.tournament_category_id === undefined
      ? team.tournamentCategory
      : dto.tournament_category_id
        ? await this.requireOwnedCategory(dto.tournament_category_id, tournamentId)
        : null;
    const nextName = dto.name?.trim() ?? team.name;
    const nextStatus = dto.status ?? team.status;

    this.assertTeamCategory(nextCategory);
    if (nextName.toLowerCase() !== team.name.toLowerCase() || (nextCategory?.id ?? null) !== team.tournamentCategoryId) {
      await this.assertTeamNameAvailable(tournamentId, nextCategory?.id ?? null, nextName, team.id);
    }
    if (nextStatus === TeamStatus.ACTIVE) {
      await this.assertTeamCapacity(tournament, nextCategory, team.id);
    }

    const updated = await this.organizerRostersDb.updateTeam(teamId, {
      tournamentCategoryId: dto.tournament_category_id === undefined ? undefined : dto.tournament_category_id,
      name: dto.name?.trim(),
      status: dto.status,
      seed: dto.seed === undefined ? undefined : dto.seed
    });

    await this.audit(currentUser.id, "team", teamId, "team.updated", {
      tournament_id: tournamentId,
      tournament_category_id: nextCategory?.id ?? null
    });

    return this.transform.toTeam(updated);
  }

  async deleteTeam(currentUser: AuthenticatedUser, tournamentId: string, teamId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    await this.requireOwnedTeam(teamId, tournamentId);

    const withdrawn = await this.organizerRostersDb.updateTeam(teamId, {
      status: TeamStatus.WITHDRAWN
    });

    await this.audit(currentUser.id, "team", teamId, "team.withdrawn", {
      tournament_id: tournamentId
    });

    return this.transform.toTeam(withdrawn);
  }

  async createTeamMember(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    teamId: string,
    dto: CreateTeamMemberRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const team = await this.requireOwnedTeam(teamId, tournamentId);
    const participant = dto.participant_id
      ? await this.requireOwnedParticipant(dto.participant_id, tournamentId)
      : null;

    if (participant) {
      if (participant.status !== RosterParticipantStatus.ACTIVE) {
        throw new BadRequestException("Only active participants can be added to a team");
      }
      if (team.tournamentCategoryId && participant.tournamentCategoryId && team.tournamentCategoryId !== participant.tournamentCategoryId) {
        throw new BadRequestException("Participant category must match the team category");
      }
      const duplicate = await this.organizerRostersDb.findTeamMemberByParticipant(teamId, participant.id);
      if (duplicate) {
        throw new ConflictException("This participant is already on the team");
      }
    }

    const member = await this.organizerRostersDb.createTeamMember({
      teamId,
      participantId: participant?.id,
      userId: participant?.userId,
      displayName: participant?.displayName ?? dto.display_name?.trim() ?? "",
      email: participant?.email ?? this.cleanEmail(dto.email),
      phone: participant?.phone ?? this.cleanOptionalString(dto.phone),
      role: dto.role ?? TeamMemberRole.PLAYER
    });

    await this.audit(currentUser.id, "team_member", member.id, "team_member.created", {
      tournament_id: tournamentId,
      team_id: teamId,
      participant_id: participant?.id ?? null
    });

    return this.transform.toTeamMember(member);
  }

  async updateTeamMember(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    teamId: string,
    memberId: string,
    dto: UpdateTeamMemberRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    await this.requireOwnedTeam(teamId, tournamentId);
    const member = await this.requireOwnedTeamMember(memberId, teamId);

    if (member.participantId && (dto.display_name !== undefined || dto.email !== undefined || dto.phone !== undefined)) {
      throw new BadRequestException("Participant-backed team member identity cannot be edited here");
    }

    const updated = await this.organizerRostersDb.updateTeamMember(memberId, {
      displayName: dto.display_name?.trim(),
      email: this.cleanNullableEmail(dto.email),
      phone: this.cleanNullableString(dto.phone),
      role: dto.role
    });

    await this.audit(currentUser.id, "team_member", memberId, "team_member.updated", {
      tournament_id: tournamentId,
      team_id: teamId
    });

    return this.transform.toTeamMember(updated);
  }

  async deleteTeamMember(currentUser: AuthenticatedUser, tournamentId: string, teamId: string, memberId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    await this.requireOwnedTeam(teamId, tournamentId);
    await this.requireOwnedTeamMember(memberId, teamId);

    const deleted = await this.organizerRostersDb.deleteTeamMember(memberId);

    await this.audit(currentUser.id, "team_member", memberId, "team_member.deleted", {
      tournament_id: tournamentId,
      team_id: teamId
    });

    return this.transform.toTeamMember(deleted);
  }

  private async requireOrganizerProfile(userId: string) {
    const profile = await this.organizerRostersDb.findOrganizerProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException("Organizer profile not found");
    }
    return profile;
  }

  private async requireOwnedTournament(id: string, organizerProfileId: string) {
    const tournament = await this.organizerRostersDb.findOwnedTournament(id, organizerProfileId);
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }
    return tournament;
  }

  private async requireOwnedCategory(categoryId: string, tournamentId: string) {
    const category = await this.organizerRostersDb.findCategoryById(categoryId);
    if (!category || category.tournamentId !== tournamentId) {
      throw new NotFoundException("Category not found");
    }
    if (category.status !== TournamentCategoryStatus.ACTIVE) {
      throw new BadRequestException("Category is not active");
    }
    return category;
  }

  private async requireOwnedRegistration(registrationId: string, tournamentId: string) {
    const registration = await this.organizerRostersDb.findRegistrationById(registrationId);
    if (!registration || registration.tournamentId !== tournamentId) {
      throw new NotFoundException("Registration not found");
    }
    return registration;
  }

  private async requireOwnedPaymentDetail(registrationId: string, tournamentId: string) {
    const registration = await this.organizerRostersDb.findPaymentDetailByRegistrationId(registrationId);
    if (!registration || registration.tournamentId !== tournamentId) {
      throw new NotFoundException("Registration not found");
    }
    return registration;
  }

  private async requireOwnedParticipant(participantId: string, tournamentId: string) {
    const participant = await this.organizerRostersDb.findParticipantById(participantId);
    if (!participant || participant.tournamentId !== tournamentId) {
      throw new NotFoundException("Participant not found");
    }
    return participant;
  }

  private async requireOwnedTeam(teamId: string, tournamentId: string) {
    const team = await this.organizerRostersDb.findTeamById(teamId);
    if (!team || team.tournamentId !== tournamentId) {
      throw new NotFoundException("Team not found");
    }
    return team;
  }

  private async requireOwnedTeamMember(memberId: string, teamId: string) {
    const member = await this.organizerRostersDb.findTeamMemberById(memberId);
    if (!member || member.teamId !== teamId) {
      throw new NotFoundException("Team member not found");
    }
    return member;
  }

  private buildRegistrationWhere(tournamentId: string, query: OrganizerRegistrationListQueryDto): Prisma.RegistrationWhereInput {
    const where: Prisma.RegistrationWhereInput = { tournamentId };
    const createdAt = toCreatedAtRange(parseDateRange(query));
    if (createdAt) {
      where.createdAt = createdAt;
    }
    if (query.category_id) {
      where.tournamentCategoryId = query.category_id;
    }
    if (query.status) {
      where.status = query.status.toUpperCase() as RegistrationStatus;
    }
    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { playerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { displayName: { contains: search, mode: "insensitive" } } }
      ];
    }
    return where;
  }

  private buildPaymentWhere(tournamentId: string, query: OrganizerPaymentListQueryDto): Prisma.RegistrationWhereInput {
    const where: Prisma.RegistrationWhereInput = { tournamentId };
    const createdAt = toCreatedAtRange(parseDateRange(query));
    if (createdAt) {
      where.paymentRecord = { createdAt };
    }
    if (query.category_id) {
      where.tournamentCategoryId = query.category_id;
    }
    if (query.status) {
      where.paymentStatus = this.toPaymentStatus(query.status);
    }
    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { playerName: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { displayName: { contains: search, mode: "insensitive" } } },
        { paymentRecord: { reference: { contains: search, mode: "insensitive" } } }
      ];
    }
    return where;
  }

  private buildParticipantWhere(tournamentId: string, query: OrganizerParticipantListQueryDto): Prisma.ParticipantWhereInput {
    const where: Prisma.ParticipantWhereInput = { tournamentId };
    if (query.category_id) {
      where.tournamentCategoryId = query.category_id;
    }
    if (query.status) {
      where.status = query.status.toUpperCase() as RosterParticipantStatus;
    }
    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { displayName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } }
      ];
    }
    return where;
  }

  private buildTeamWhere(tournamentId: string, query: OrganizerTeamListQueryDto): Prisma.TeamWhereInput {
    const where: Prisma.TeamWhereInput = { tournamentId };
    if (query.category_id) {
      where.tournamentCategoryId = query.category_id;
    }
    if (query.status) {
      where.status = query.status.toUpperCase() as TeamStatus;
    }
    if (query.search?.trim()) {
      where.name = { contains: query.search.trim(), mode: "insensitive" };
    }
    return where;
  }

  private async assertRosterCapacity(
    tournament: Awaited<ReturnType<OrganizerRostersDbService["findOwnedTournament"]>>,
    category: TournamentCategory | null,
    currentParticipantId?: string
  ) {
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (category?.capacity) {
      const activeParticipants = await this.organizerRostersDb.countParticipants({
        tournamentCategoryId: category.id,
        status: RosterParticipantStatus.ACTIVE,
        id: currentParticipantId ? { not: currentParticipantId } : undefined
      });
      if (activeParticipants >= category.capacity) {
        throw new ConflictException("Category capacity has been reached");
      }
      return;
    }

    if (tournament.maxParticipants) {
      const activeParticipants = await this.organizerRostersDb.countParticipants({
        tournamentId: tournament.id,
        status: RosterParticipantStatus.ACTIVE,
        id: currentParticipantId ? { not: currentParticipantId } : undefined
      });
      if (activeParticipants >= tournament.maxParticipants) {
        throw new ConflictException("Tournament participant capacity has been reached");
      }
    }
  }

  private async assertTeamCapacity(
    tournament: Awaited<ReturnType<OrganizerRostersDbService["findOwnedTournament"]>>,
    category: TournamentCategory | null,
    currentTeamId?: string
  ) {
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }
    if (!category?.capacity) {
      return;
    }

    const activeTeams = await this.organizerRostersDb.countTeams({
      tournamentCategoryId: category.id,
      status: TeamStatus.ACTIVE,
      id: currentTeamId ? { not: currentTeamId } : undefined
    });
    if (activeTeams >= category.capacity) {
      throw new ConflictException("Category team capacity has been reached");
    }
  }

  private assertTeamCategory(category: TournamentCategory | null) {
    if (category && category.participantType === ParticipantType.SINGLES) {
      throw new BadRequestException("Teams can only be created for doubles or team categories");
    }
  }

  private async assertTeamNameAvailable(
    tournamentId: string,
    tournamentCategoryId: string | null,
    name: string,
    currentTeamId?: string
  ) {
    const existing = await this.organizerRostersDb.findActiveTeamByName({ tournamentId, tournamentCategoryId, name });
    if (existing && existing.id !== currentTeamId) {
      throw new ConflictException("An active team with this name already exists for this category");
    }
  }

  private cleanOptionalString(value?: string | null): string | null {
    const cleanValue = value?.trim();
    return cleanValue ? cleanValue : null;
  }

  private cleanNullableString(value?: string | null): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }
    return this.cleanOptionalString(value);
  }

  private cleanEmail(value?: string | null): string | null {
    const cleanValue = value?.trim().toLowerCase();
    return cleanValue ? cleanValue : null;
  }

  private cleanNullableEmail(value?: string | null): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }
    return this.cleanEmail(value);
  }

  private toPaymentStatus(value: string): RegistrationPaymentStatus {
    return value.toUpperCase() as RegistrationPaymentStatus;
  }

  private toRefundStatus(value: string): PaymentRefundStatus {
    return value.toUpperCase() as PaymentRefundStatus;
  }

  private calculateRefundedAmount(refunds: Array<{ status: PaymentRefundStatus; amount: number }>) {
    return refunds
      .filter((refund) => refund.status === PaymentRefundStatus.MANUAL_RECORDED || refund.status === PaymentRefundStatus.SUCCEEDED)
      .reduce((total, refund) => total + refund.amount, 0);
  }

  private calculateReservedRefundAmount(refunds: Array<{ status: PaymentRefundStatus; amount: number }>) {
    return refunds
      .filter((refund) => refund.status !== PaymentRefundStatus.FAILED && refund.status !== PaymentRefundStatus.CANCELLED)
      .reduce((total, refund) => total + refund.amount, 0);
  }

  private resolvePaidAt(
    status: RegistrationPaymentStatus,
    paidAt?: string,
    existingPaidAt?: Date | null
  ): Date | null {
    if (status === RegistrationPaymentStatus.PAID) {
      return paidAt ? new Date(paidAt) : new Date();
    }
    if (status === RegistrationPaymentStatus.REFUNDED) {
      return paidAt ? new Date(paidAt) : existingPaidAt ?? null;
    }
    return null;
  }

  private enqueuePaymentNotificationIfNeeded(input: {
    registration: Awaited<ReturnType<OrganizerRostersDbService["updateRegistrationPayment"]>>;
    tournament: Awaited<ReturnType<OrganizerRostersDbService["findOwnedTournament"]>>;
    status: RegistrationPaymentStatus;
  }) {
    if (!input.tournament) {
      return null;
    }

    if (
      input.status !== RegistrationPaymentStatus.PAID
      && input.status !== RegistrationPaymentStatus.FAILED
      && input.status !== RegistrationPaymentStatus.WAIVED
    ) {
      return null;
    }

    return this.notifications.enqueuePaymentStatusChanged({
      registrationId: input.registration.id,
      recipientUserId: input.registration.userId,
      recipientEmail: input.registration.user.email,
      recipientName: input.registration.playerName,
      tournamentId: input.registration.tournamentId,
      tournamentCategoryId: input.registration.tournamentCategoryId,
      tournamentTitle: input.tournament.title,
      tournamentSlug: input.tournament.slug,
      categoryName: input.registration.tournamentCategory?.name ?? null,
      status: input.status,
      amount: input.registration.paymentRecord?.amount ?? input.registration.feeAmount,
      currency: input.registration.paymentRecord?.currency ?? input.registration.feeCurrency
    });
  }

  private audit(actorId: string, entityType: string, entityId: string, action: string, metadata: Prisma.InputJsonObject) {
    return this.organizerRostersDb.createAuditLog({
      actorId,
      entityType,
      entityId,
      action,
      metadata
    });
  }

  private auditExport(
    actorId: string,
    tournamentId: string,
    action: string,
    filters: OrganizerRosterListQueryDto,
    rowCount: number
  ) {
    return this.audit(actorId, "tournament", tournamentId, action, {
      actor_user_id: actorId,
      role: "ORGANIZER",
      export_type: action,
      tournament_id: tournamentId,
      filters: this.toAuditFilters(filters),
      row_count: rowCount,
      exported_at: new Date().toISOString()
    });
  }

  private toCsvExport(type: string, tournamentId: string, headers: string[], rows: CsvRow[]) {
    return {
      filename: `tournament-${tournamentId}-${type}.csv`,
      rowCount: rows.length,
      content: createCsv(headers, rows)
    };
  }

  private assertExportLimit(rowCount: number, limit: number) {
    if (rowCount > limit) {
      throw new BadRequestException(`Export exceeds the configured ${limit} row limit. Refine filters and try again.`);
    }
  }

  private getExportLimit() {
    return this.config.get<number>("EXPORT_MAX_ROWS") ?? 5000;
  }

  private toAuditFilters(filters: OrganizerRosterListQueryDto): Prisma.InputJsonObject {
    return {
      ...(filters.category_id ? { category_id: filters.category_id } : {}),
      ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
      ...("status" in filters && typeof filters.status === "string" && filters.status ? { status: filters.status } : {})
    };
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
