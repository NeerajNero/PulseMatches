import { Injectable } from "@nestjs/common";
import { OrganizerVerificationStatus, Prisma } from "@prisma/client";
import { AdminRepository, PaginationInput } from "./admin.repository";

@Injectable()
export class AdminDbService {
  constructor(private readonly repository: AdminRepository) {}

  getDashboardCounts() {
    return this.repository.getDashboardCounts();
  }

  listUsers(where: Prisma.UserWhereInput, pagination: PaginationInput) {
    return this.repository.listUsers(where, pagination);
  }

  listOrganizers(where: Prisma.OrganizerProfileWhereInput, pagination: PaginationInput) {
    return this.repository.listOrganizers(where, pagination);
  }

  findOrganizerDetail(organizerId: string) {
    return this.repository.findOrganizerDetail(organizerId);
  }

  updateOrganizerVerification(input: { organizerId: string; status: OrganizerVerificationStatus }) {
    return this.repository.updateOrganizerVerification(input);
  }

  listTournaments(where: Prisma.TournamentWhereInput, pagination: PaginationInput) {
    return this.repository.listTournaments(where, pagination);
  }

  listRegistrations(where: Prisma.RegistrationWhereInput, pagination: PaginationInput) {
    return this.repository.listRegistrations(where, pagination);
  }

  listPayments(where: Prisma.PaymentRecordWhereInput, pagination: PaginationInput) {
    return this.repository.listPayments(where, pagination);
  }

  findPaymentDetail(paymentRecordId: string) {
    return this.repository.findPaymentDetail(paymentRecordId);
  }

  listNotifications(where: Prisma.NotificationOutboxWhereInput, pagination: PaginationInput) {
    return this.repository.listNotifications(where, pagination);
  }

  findNotification(notificationId: string) {
    return this.repository.findNotification(notificationId);
  }

  retryNotification(notificationId: string) {
    return this.repository.retryNotification(notificationId);
  }

  skipNotification(input: { notificationId: string; reason: string }) {
    return this.repository.skipNotification(input);
  }

  listReconciliationRuns(where: Prisma.PaymentReconciliationRunWhereInput, pagination: PaginationInput) {
    return this.repository.listReconciliationRuns(where, pagination);
  }

  listAuditEvents(where: Prisma.AuditLogWhereInput, pagination: PaginationInput) {
    return this.repository.listAuditEvents(where, pagination);
  }

  createAuditLog(input: Prisma.AuditLogUncheckedCreateInput) {
    return this.repository.createAuditLog(input);
  }
}
