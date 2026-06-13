import { BadRequestException, NotFoundException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  NotificationChannel,
  NotificationStatus,
  OrganizerVerificationStatus,
  PaymentProvider,
  PaymentReconciliationStatus,
  Prisma,
  RegistrationPaymentStatus,
  RegistrationStatus,
  RoleType,
  TournamentStatus
} from "@prisma/client";
import { createCsv, type CsvRow } from "../../common/utils/csv.util";
import { AdminDbService } from "../../db/admin/admin-db.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { AdminTransform } from "./admin.transform";
import {
  AdminAuditEventsQueryDto,
  AdminNotificationsQueryDto,
  AdminOrganizersQueryDto,
  AdminPaginationQueryDto,
  AdminPaymentsQueryDto,
  AdminReconciliationRunsQueryDto,
  AdminRegistrationsQueryDto,
  RejectOrganizerVerificationRequestDto,
  SkipNotificationRequestDto,
  AdminTournamentsQueryDto,
  AdminUsersQueryDto
} from "./dto/admin.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly db: AdminDbService,
    private readonly transform: AdminTransform,
    private readonly config: ConfigService
  ) {}

  async getDashboard() {
    return this.transform.toDashboard(await this.db.getDashboardCounts());
  }

  async listUsers(query: AdminUsersQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listUsers({
      ...(search
        ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { displayName: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}),
      ...(query.role ? { roles: { some: { role: query.role as RoleType } } } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((user) => this.transform.toUser(user)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportUsers(query: AdminUsersQueryDto, currentUser: AuthenticatedUser) {
    const where = this.buildUsersWhere(query);
    const result = await this.db.listUsers(where, this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((user) => {
      const safeUser = this.transform.toUser(user);
      return {
        id: safeUser.id,
        displayName: safeUser.display_name,
        email: safeUser.email,
        roles: safeUser.roles.join("; "),
        status: safeUser.status,
        organizerName: safeUser.organizer?.organization_name ?? "",
        organizerVerificationStatus: safeUser.organizer?.verification_status ?? "",
        registrationCount: safeUser.registration_count,
        createdAt: safeUser.created_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_users", query, rows.length);
    return this.toCsvExport("admin-users", [
      "id",
      "displayName",
      "email",
      "roles",
      "status",
      "organizerName",
      "organizerVerificationStatus",
      "registrationCount",
      "createdAt"
    ], rows);
  }

  async listOrganizers(query: AdminOrganizersQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listOrganizers({
      ...(search
        ? {
          OR: [
            { organizationName: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { displayName: { contains: search, mode: "insensitive" } } }
          ]
        }
        : {}),
      ...(query.verification_status
        ? { verificationStatus: this.toPrismaEnum(query.verification_status) as OrganizerVerificationStatus }
        : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((organizer) => this.transform.toOrganizer(organizer)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportOrganizers(query: AdminOrganizersQueryDto, currentUser: AuthenticatedUser) {
    const result = await this.db.listOrganizers(this.buildOrganizersWhere(query), this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((organizer) => {
      const safeOrganizer = this.transform.toOrganizer(organizer);
      return {
        id: safeOrganizer.id,
        organizationName: safeOrganizer.organization_name,
        slug: safeOrganizer.slug,
        verificationStatus: safeOrganizer.verification_status,
        status: safeOrganizer.status,
        userName: safeOrganizer.user.display_name,
        userEmail: safeOrganizer.user.email,
        tournamentCount: safeOrganizer.tournament_count,
        createdAt: safeOrganizer.created_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_organizers", query, rows.length);
    return this.toCsvExport("admin-organizers", [
      "id",
      "organizationName",
      "slug",
      "verificationStatus",
      "status",
      "userName",
      "userEmail",
      "tournamentCount",
      "createdAt"
    ], rows);
  }

  async findOrganizerDetail(organizerId: string) {
    const organizer = await this.db.findOrganizerDetail(organizerId);
    if (!organizer) {
      throw new NotFoundException("Organizer profile not found");
    }
    return this.transform.toOrganizerDetail(organizer);
  }

  async verifyOrganizer(organizerId: string, currentUser: AuthenticatedUser) {
    const organizer = await this.db.findOrganizerDetail(organizerId);
    if (!organizer) {
      throw new NotFoundException("Organizer profile not found");
    }
    if (organizer.verificationStatus === OrganizerVerificationStatus.VERIFIED) {
      return this.transform.toOrganizer(organizer);
    }

    const updated = await this.db.updateOrganizerVerification({
      organizerId,
      status: OrganizerVerificationStatus.VERIFIED
    });
    await this.audit(currentUser.id, "organizer_profile", organizerId, "admin.organizer_verified", {
      admin_user_id: currentUser.id,
      organizer_profile_id: organizerId,
      organizer_user_id: organizer.userId,
      previous_status: organizer.verificationStatus,
      next_status: OrganizerVerificationStatus.VERIFIED
    });
    return this.transform.toOrganizer(updated);
  }

  async rejectOrganizer(organizerId: string, dto: RejectOrganizerVerificationRequestDto, currentUser: AuthenticatedUser) {
    const organizer = await this.db.findOrganizerDetail(organizerId);
    if (!organizer) {
      throw new NotFoundException("Organizer profile not found");
    }
    if (organizer.verificationStatus === OrganizerVerificationStatus.VERIFIED) {
      throw new BadRequestException("Verified organizers cannot be rejected without resetting verification first");
    }
    if (organizer.verificationStatus === OrganizerVerificationStatus.REJECTED) {
      return this.transform.toOrganizer(organizer);
    }

    const updated = await this.db.updateOrganizerVerification({
      organizerId,
      status: OrganizerVerificationStatus.REJECTED
    });
    await this.audit(currentUser.id, "organizer_profile", organizerId, "admin.organizer_rejected", {
      admin_user_id: currentUser.id,
      organizer_profile_id: organizerId,
      organizer_user_id: organizer.userId,
      previous_status: organizer.verificationStatus,
      next_status: OrganizerVerificationStatus.REJECTED,
      ...(dto.reason?.trim() ? { reason: dto.reason.trim() } : {})
    });
    return this.transform.toOrganizer(updated);
  }

  async resetOrganizerVerification(organizerId: string, currentUser: AuthenticatedUser) {
    const organizer = await this.db.findOrganizerDetail(organizerId);
    if (!organizer) {
      throw new NotFoundException("Organizer profile not found");
    }
    if (organizer.verificationStatus === OrganizerVerificationStatus.PENDING) {
      return this.transform.toOrganizer(organizer);
    }

    const updated = await this.db.updateOrganizerVerification({
      organizerId,
      status: OrganizerVerificationStatus.PENDING
    });
    await this.audit(currentUser.id, "organizer_profile", organizerId, "admin.organizer_verification_reset", {
      admin_user_id: currentUser.id,
      organizer_profile_id: organizerId,
      organizer_user_id: organizer.userId,
      previous_status: organizer.verificationStatus,
      next_status: OrganizerVerificationStatus.PENDING
    });
    return this.transform.toOrganizer(updated);
  }

  async listTournaments(query: AdminTournamentsQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listTournaments({
      ...(search
        ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { organizerProfile: { organizationName: { contains: search, mode: "insensitive" } } }
          ]
        }
        : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as TournamentStatus } : {}),
      ...(query.organizer_id ? { organizerProfileId: query.organizer_id } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((tournament) => this.transform.toTournament(tournament)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportTournaments(query: AdminTournamentsQueryDto, currentUser: AuthenticatedUser) {
    const result = await this.db.listTournaments(this.buildTournamentsWhere(query), this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((tournament) => {
      const safeTournament = this.transform.toTournament(tournament);
      return {
        id: safeTournament.id,
        title: safeTournament.title,
        slug: safeTournament.slug,
        sport: safeTournament.sport,
        city: safeTournament.city,
        status: safeTournament.status,
        visibility: safeTournament.visibility,
        organizerName: safeTournament.organizer.organization_name,
        organizerEmail: safeTournament.organizer.user.email,
        registrationCount: safeTournament.registration_count,
        createdAt: safeTournament.created_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_tournaments", query, rows.length);
    return this.toCsvExport("admin-tournaments", [
      "id",
      "title",
      "slug",
      "sport",
      "city",
      "status",
      "visibility",
      "organizerName",
      "organizerEmail",
      "registrationCount",
      "createdAt"
    ], rows);
  }

  async listRegistrations(query: AdminRegistrationsQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listRegistrations({
      ...(search
        ? {
          OR: [
            { playerName: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { displayName: { contains: search, mode: "insensitive" } } },
            { tournament: { title: { contains: search, mode: "insensitive" } } }
          ]
        }
        : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as RegistrationStatus } : {}),
      ...(query.payment_status ? { paymentStatus: this.toPrismaEnum(query.payment_status) as RegistrationPaymentStatus } : {}),
      ...(query.tournament_id ? { tournamentId: query.tournament_id } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((registration) => this.transform.toRegistration(registration)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportRegistrations(query: AdminRegistrationsQueryDto, currentUser: AuthenticatedUser) {
    const result = await this.db.listRegistrations(this.buildRegistrationsWhere(query), this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((registration) => {
      const safeRegistration = this.transform.toRegistration(registration);
      return {
        id: safeRegistration.id,
        playerName: safeRegistration.player_name,
        playerEmail: safeRegistration.player.email,
        tournamentId: safeRegistration.tournament_id,
        tournamentTitle: safeRegistration.tournament_title,
        categoryName: safeRegistration.category_name ?? "",
        status: safeRegistration.status,
        paymentStatus: safeRegistration.payment_status,
        createdAt: safeRegistration.created_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_registrations", query, rows.length);
    return this.toCsvExport("admin-registrations", [
      "id",
      "playerName",
      "playerEmail",
      "tournamentId",
      "tournamentTitle",
      "categoryName",
      "status",
      "paymentStatus",
      "createdAt"
    ], rows);
  }

  async listPayments(query: AdminPaymentsQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listPayments({
      ...(search
        ? {
          OR: [
            { reference: { contains: search, mode: "insensitive" } },
            { registration: { playerName: { contains: search, mode: "insensitive" } } },
            { registration: { user: { email: { contains: search, mode: "insensitive" } } } },
            { registration: { tournament: { title: { contains: search, mode: "insensitive" } } } }
          ]
        }
        : {}),
      ...(query.provider ? { provider: this.toPrismaEnum(query.provider) as PaymentProvider } : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as RegistrationPaymentStatus } : {}),
      ...(query.tournament_id ? { tournamentId: query.tournament_id } : {}),
      ...(query.registration_id ? { registrationId: query.registration_id } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((payment) => this.transform.toPayment(payment)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportPayments(query: AdminPaymentsQueryDto, currentUser: AuthenticatedUser) {
    const result = await this.db.listPayments(this.buildPaymentsWhere(query), this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((payment) => {
      const safePayment = this.transform.toPayment(payment);
      return {
        paymentRecordId: safePayment.id,
        registrationId: safePayment.registration_id,
        tournamentId: safePayment.tournament_id,
        tournamentTitle: safePayment.tournament_title,
        playerName: safePayment.player.display_name,
        playerEmail: safePayment.player.email,
        provider: safePayment.provider,
        mode: safePayment.mode,
        status: safePayment.status,
        amount: safePayment.amount,
        currency: safePayment.currency,
        paidAt: safePayment.paid_at ?? "",
        refundCount: safePayment.refund_count,
        refundedAmount: safePayment.refunded_amount,
        latestIntentStatus: safePayment.latest_intent_status ?? "",
        eventCount: safePayment.event_count,
        updatedAt: safePayment.updated_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_payments", query, rows.length);
    return this.toCsvExport("admin-payments", [
      "paymentRecordId",
      "registrationId",
      "tournamentId",
      "tournamentTitle",
      "playerName",
      "playerEmail",
      "provider",
      "mode",
      "status",
      "amount",
      "currency",
      "paidAt",
      "refundCount",
      "refundedAmount",
      "latestIntentStatus",
      "eventCount",
      "updatedAt"
    ], rows);
  }

  async findPaymentDetail(paymentRecordId: string) {
    const payment = await this.db.findPaymentDetail(paymentRecordId);
    if (!payment) {
      throw new NotFoundException("Payment record not found");
    }
    return this.transform.toPaymentDetail(payment);
  }

  async listNotifications(query: AdminNotificationsQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listNotifications({
      ...(search
        ? {
          OR: [
            { subject: { contains: search, mode: "insensitive" } },
            { recipientEmail: { contains: search, mode: "insensitive" } },
            { recipientName: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}),
      ...(query.type ? { type: this.toPrismaEnum(query.type) as never } : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as NotificationStatus } : {}),
      ...(query.channel ? { channel: this.toPrismaEnum(query.channel) as NotificationChannel } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((notification) => this.transform.toNotification(notification)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportNotifications(query: AdminNotificationsQueryDto, currentUser: AuthenticatedUser) {
    const result = await this.db.listNotifications(this.buildNotificationsWhere(query), this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((notification) => {
      const safeNotification = this.transform.toNotification(notification);
      return {
        id: safeNotification.id,
        type: safeNotification.type,
        channel: safeNotification.channel,
        status: safeNotification.status,
        recipientEmail: safeNotification.recipient_email ?? "",
        attempts: safeNotification.attempts,
        provider: safeNotification.provider ?? "",
        lastError: safeNotification.last_error ?? "",
        processedAt: safeNotification.processed_at ?? "",
        createdAt: safeNotification.created_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_notifications", query, rows.length);
    return this.toCsvExport("admin-notifications", [
      "id",
      "type",
      "channel",
      "status",
      "recipientEmail",
      "attempts",
      "provider",
      "lastError",
      "processedAt",
      "createdAt"
    ], rows);
  }

  async retryNotification(notificationId: string, currentUser: AuthenticatedUser) {
    const notification = await this.db.findNotification(notificationId);
    if (!notification) {
      throw new NotFoundException("Notification not found");
    }
    if (notification.status !== NotificationStatus.FAILED && notification.status !== NotificationStatus.SKIPPED) {
      throw new BadRequestException("Only failed or skipped notifications can be retried");
    }

    const updated = await this.db.retryNotification(notificationId);
    await this.audit(currentUser.id, "notification_outbox", notificationId, "admin.notification_retry_requested", {
      admin_user_id: currentUser.id,
      notification_id: notificationId,
      previous_status: notification.status,
      next_status: NotificationStatus.PENDING
    });
    return this.transform.toNotification(updated);
  }

  async skipNotification(notificationId: string, dto: SkipNotificationRequestDto, currentUser: AuthenticatedUser) {
    const notification = await this.db.findNotification(notificationId);
    if (!notification) {
      throw new NotFoundException("Notification not found");
    }
    if (notification.status !== NotificationStatus.PENDING && notification.status !== NotificationStatus.FAILED) {
      throw new BadRequestException("Only pending or failed notifications can be skipped");
    }

    const reason = dto.reason?.trim() || "Skipped by admin support";
    const updated = await this.db.skipNotification({ notificationId, reason });
    await this.audit(currentUser.id, "notification_outbox", notificationId, "admin.notification_skipped", {
      admin_user_id: currentUser.id,
      notification_id: notificationId,
      previous_status: notification.status,
      next_status: NotificationStatus.SKIPPED,
      reason
    });
    return this.transform.toNotification(updated);
  }

  async listReconciliationRuns(query: AdminReconciliationRunsQueryDto) {
    const pagination = this.getPagination(query);
    const result = await this.db.listReconciliationRuns({
      ...(query.provider ? { provider: this.toPrismaEnum(query.provider) as PaymentProvider } : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as PaymentReconciliationStatus } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((run) => this.transform.toReconciliationRun(run)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async listAuditEvents(query: AdminAuditEventsQueryDto) {
    const pagination = this.getPagination(query);
    const search = query.search?.trim();
    const result = await this.db.listAuditEvents({
      ...(search
        ? {
          OR: [
            { action: { contains: search, mode: "insensitive" } },
            { entityType: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}),
      ...(query.entity_type ? { entityType: query.entity_type } : {}),
      ...(query.action ? { action: query.action } : {})
    }, pagination);

    return this.transform.toList(
      result.items.map((audit) => this.transform.toAuditEvent(audit)),
      pagination.page,
      pagination.limit,
      result.total
    );
  }

  async exportAuditEvents(query: AdminAuditEventsQueryDto, currentUser: AuthenticatedUser) {
    const result = await this.db.listAuditEvents(this.buildAuditEventsWhere(query), this.getExportPagination());
    this.assertExportLimit(result.items.length);
    const rows = result.items.map((audit) => {
      const safeAudit = this.transform.toAuditEvent(audit);
      return {
        id: safeAudit.id,
        actorName: safeAudit.actor?.display_name ?? "",
        actorEmail: safeAudit.actor?.email ?? "",
        entityType: safeAudit.entity_type,
        entityId: safeAudit.entity_id ?? "",
        action: safeAudit.action,
        metadataSummary: JSON.stringify(safeAudit.metadata_summary),
        createdAt: safeAudit.created_at
      } satisfies CsvRow;
    });
    await this.auditExport(currentUser.id, "admin.export_audit_events", query, rows.length);
    return this.toCsvExport("admin-audit-events", [
      "id",
      "actorName",
      "actorEmail",
      "entityType",
      "entityId",
      "action",
      "metadataSummary",
      "createdAt"
    ], rows);
  }

  private getPagination(query: AdminPaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    return {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit
    };
  }

  private toPrismaEnum(value: string): string {
    return value.toUpperCase();
  }

  private audit(actorId: string, entityType: string, entityId: string, action: string, metadata: Record<string, string>) {
    return this.db.createAuditLog({
      actorId,
      entityType,
      entityId,
      action,
      metadata
    });
  }

  private buildUsersWhere(query: AdminUsersQueryDto): Prisma.UserWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { displayName: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}),
      ...(query.role ? { roles: { some: { role: query.role as RoleType } } } : {})
    };
  }

  private buildOrganizersWhere(query: AdminOrganizersQueryDto): Prisma.OrganizerProfileWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { organizationName: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { displayName: { contains: search, mode: "insensitive" } } }
          ]
        }
        : {}),
      ...(query.verification_status
        ? { verificationStatus: this.toPrismaEnum(query.verification_status) as OrganizerVerificationStatus }
        : {})
    };
  }

  private buildTournamentsWhere(query: AdminTournamentsQueryDto): Prisma.TournamentWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { organizerProfile: { organizationName: { contains: search, mode: "insensitive" } } }
          ]
        }
        : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as TournamentStatus } : {}),
      ...(query.organizer_id ? { organizerProfileId: query.organizer_id } : {})
    };
  }

  private buildRegistrationsWhere(query: AdminRegistrationsQueryDto): Prisma.RegistrationWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { playerName: { contains: search, mode: "insensitive" } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { displayName: { contains: search, mode: "insensitive" } } },
            { tournament: { title: { contains: search, mode: "insensitive" } } }
          ]
        }
        : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as RegistrationStatus } : {}),
      ...(query.payment_status ? { paymentStatus: this.toPrismaEnum(query.payment_status) as RegistrationPaymentStatus } : {}),
      ...(query.tournament_id ? { tournamentId: query.tournament_id } : {})
    };
  }

  private buildPaymentsWhere(query: AdminPaymentsQueryDto): Prisma.PaymentRecordWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { reference: { contains: search, mode: "insensitive" } },
            { registration: { playerName: { contains: search, mode: "insensitive" } } },
            { registration: { user: { email: { contains: search, mode: "insensitive" } } } },
            { registration: { tournament: { title: { contains: search, mode: "insensitive" } } } }
          ]
        }
        : {}),
      ...(query.provider ? { provider: this.toPrismaEnum(query.provider) as PaymentProvider } : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as RegistrationPaymentStatus } : {}),
      ...(query.tournament_id ? { tournamentId: query.tournament_id } : {}),
      ...(query.registration_id ? { registrationId: query.registration_id } : {})
    };
  }

  private buildNotificationsWhere(query: AdminNotificationsQueryDto): Prisma.NotificationOutboxWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { subject: { contains: search, mode: "insensitive" } },
            { recipientEmail: { contains: search, mode: "insensitive" } },
            { recipientName: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}),
      ...(query.type ? { type: this.toPrismaEnum(query.type) as never } : {}),
      ...(query.status ? { status: this.toPrismaEnum(query.status) as NotificationStatus } : {}),
      ...(query.channel ? { channel: this.toPrismaEnum(query.channel) as NotificationChannel } : {})
    };
  }

  private buildAuditEventsWhere(query: AdminAuditEventsQueryDto): Prisma.AuditLogWhereInput {
    const search = query.search?.trim();
    return {
      ...(search
        ? {
          OR: [
            { action: { contains: search, mode: "insensitive" } },
            { entityType: { contains: search, mode: "insensitive" } }
          ]
        }
        : {}),
      ...(query.entity_type ? { entityType: query.entity_type } : {}),
      ...(query.action ? { action: query.action } : {})
    };
  }

  private getExportPagination() {
    const limit = this.getExportLimit();
    return {
      page: 1,
      limit: limit + 1,
      skip: 0,
      take: limit + 1
    };
  }

  private assertExportLimit(rowCount: number) {
    const limit = this.getExportLimit();
    if (rowCount > limit) {
      throw new BadRequestException(`Export exceeds the configured ${limit} row limit. Refine filters and try again.`);
    }
  }

  private getExportLimit() {
    return this.config.get<number>("EXPORT_MAX_ROWS") ?? 5000;
  }

  private auditExport(actorId: string, action: string, filters: AdminPaginationQueryDto, rowCount: number) {
    return this.db.createAuditLog({
      actorId,
      entityType: "admin_export",
      action,
      metadata: {
        actor_user_id: actorId,
        role: "ADMIN",
        export_type: action,
        filters: this.toAuditFilters(filters),
        row_count: rowCount,
        exported_at: new Date().toISOString()
      }
    });
  }

  private toCsvExport(type: string, headers: string[], rows: CsvRow[]) {
    return {
      filename: `${type}.csv`,
      rowCount: rows.length,
      content: createCsv(headers, rows)
    };
  }

  private toAuditFilters(filters: AdminPaginationQueryDto): Prisma.InputJsonObject {
    return Object.fromEntries(
      Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => [key, String(value)])
    );
  }
}
