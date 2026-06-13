import { Body, Controller, Get, Param, Patch, Query, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import type { Response } from "express";
import { sendCsvResponse } from "../../common/utils/csv.util";
import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminService } from "./admin.service";
import {
  AdminAuditEventsApiResponseDto,
  AdminAuditEventsQueryDto,
  AdminDashboardApiResponseDto,
  AdminNotificationsApiResponseDto,
  AdminNotificationsQueryDto,
  AdminNotificationApiResponseDto,
  AdminOrganizerApiResponseDto,
  AdminOrganizerDetailApiResponseDto,
  AdminOrganizersApiResponseDto,
  AdminOrganizersQueryDto,
  AdminPaymentDetailApiResponseDto,
  AdminPaymentsApiResponseDto,
  AdminPaymentsQueryDto,
  AdminReconciliationRunsApiResponseDto,
  AdminReconciliationRunsQueryDto,
  AdminRegistrationsApiResponseDto,
  AdminRegistrationsQueryDto,
  RejectOrganizerVerificationRequestDto,
  SkipNotificationRequestDto,
  AdminTournamentsApiResponseDto,
  AdminTournamentsQueryDto,
  AdminUsersApiResponseDto,
  AdminUsersQueryDto
} from "./dto/admin.dto";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get read-only platform support dashboard summary" })
  @ApiOkResponse({ type: AdminDashboardApiResponseDto })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get("users")
  @ApiOperation({ summary: "List platform users for support inspection" })
  @ApiOkResponse({ type: AdminUsersApiResponseDto })
  listUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Get("users/export.csv")
  @ApiOperation({ summary: "Export safe platform users list as CSV" })
  async exportUsers(
    @Query() query: AdminUsersQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportUsers(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }

  @Get("organizers")
  @ApiOperation({ summary: "List organizer profiles for support inspection" })
  @ApiOkResponse({ type: AdminOrganizersApiResponseDto })
  listOrganizers(@Query() query: AdminOrganizersQueryDto) {
    return this.adminService.listOrganizers(query);
  }

  @Get("organizers/export.csv")
  @ApiOperation({ summary: "Export safe organizer verification list as CSV" })
  async exportOrganizers(
    @Query() query: AdminOrganizersQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportOrganizers(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }

  @Get("organizers/:organizerId")
  @ApiOperation({ summary: "Get read-only organizer verification detail for support review" })
  @ApiOkResponse({ type: AdminOrganizerDetailApiResponseDto })
  findOrganizerDetail(@Param("organizerId") organizerId: string) {
    return this.adminService.findOrganizerDetail(organizerId);
  }

  @Patch("organizers/:organizerId/verify")
  @ApiOperation({ summary: "Verify an organizer profile with audit trail" })
  @ApiOkResponse({ type: AdminOrganizerApiResponseDto })
  verifyOrganizer(
    @Param("organizerId") organizerId: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.adminService.verifyOrganizer(organizerId, currentUser);
  }

  @Patch("organizers/:organizerId/reject")
  @ApiOperation({ summary: "Reject an organizer verification request with audit trail" })
  @ApiOkResponse({ type: AdminOrganizerApiResponseDto })
  rejectOrganizer(
    @Param("organizerId") organizerId: string,
    @Body() dto: RejectOrganizerVerificationRequestDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.adminService.rejectOrganizer(organizerId, dto, currentUser);
  }

  @Patch("organizers/:organizerId/reset-verification")
  @ApiOperation({ summary: "Reset organizer verification to pending with audit trail" })
  @ApiOkResponse({ type: AdminOrganizerApiResponseDto })
  resetOrganizerVerification(
    @Param("organizerId") organizerId: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.adminService.resetOrganizerVerification(organizerId, currentUser);
  }

  @Get("tournaments")
  @ApiOperation({ summary: "List tournaments for support inspection" })
  @ApiOkResponse({ type: AdminTournamentsApiResponseDto })
  listTournaments(@Query() query: AdminTournamentsQueryDto) {
    return this.adminService.listTournaments(query);
  }

  @Get("tournaments/export.csv")
  @ApiOperation({ summary: "Export safe tournament overview as CSV" })
  async exportTournaments(
    @Query() query: AdminTournamentsQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportTournaments(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }

  @Get("registrations")
  @ApiOperation({ summary: "List registrations for support inspection" })
  @ApiOkResponse({ type: AdminRegistrationsApiResponseDto })
  listRegistrations(@Query() query: AdminRegistrationsQueryDto) {
    return this.adminService.listRegistrations(query);
  }

  @Get("registrations/export.csv")
  @ApiOperation({ summary: "Export safe registration overview as CSV" })
  async exportRegistrations(
    @Query() query: AdminRegistrationsQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportRegistrations(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }

  @Get("payments")
  @ApiOperation({ summary: "List payment records for support inspection" })
  @ApiOkResponse({ type: AdminPaymentsApiResponseDto })
  listPayments(@Query() query: AdminPaymentsQueryDto) {
    return this.adminService.listPayments(query);
  }

  @Get("payments/export.csv")
  @ApiOperation({ summary: "Export safe payment overview as CSV" })
  async exportPayments(
    @Query() query: AdminPaymentsQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportPayments(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }

  @Get("payments/:paymentRecordId")
  @ApiOperation({ summary: "Get read-only support diagnostics for one payment record" })
  @ApiOkResponse({ type: AdminPaymentDetailApiResponseDto })
  findPaymentDetail(@Param("paymentRecordId") paymentRecordId: string) {
    return this.adminService.findPaymentDetail(paymentRecordId);
  }

  @Get("notifications")
  @ApiOperation({ summary: "List notification outbox rows for support inspection" })
  @ApiOkResponse({ type: AdminNotificationsApiResponseDto })
  listNotifications(@Query() query: AdminNotificationsQueryDto) {
    return this.adminService.listNotifications(query);
  }

  @Get("notifications/export.csv")
  @ApiOperation({ summary: "Export safe notification outbox summary as CSV" })
  async exportNotifications(
    @Query() query: AdminNotificationsQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportNotifications(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }

  @Patch("notifications/:notificationId/retry")
  @ApiOperation({ summary: "Return a failed or skipped notification to pending for processor retry" })
  @ApiOkResponse({ type: AdminNotificationApiResponseDto })
  retryNotification(
    @Param("notificationId") notificationId: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.adminService.retryNotification(notificationId, currentUser);
  }

  @Patch("notifications/:notificationId/skip")
  @ApiOperation({ summary: "Mark a pending or failed notification as skipped with audit trail" })
  @ApiOkResponse({ type: AdminNotificationApiResponseDto })
  skipNotification(
    @Param("notificationId") notificationId: string,
    @Body() dto: SkipNotificationRequestDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.adminService.skipNotification(notificationId, dto, currentUser);
  }

  @Get("reconciliation-runs")
  @ApiOperation({ summary: "List payment reconciliation runs for support inspection" })
  @ApiOkResponse({ type: AdminReconciliationRunsApiResponseDto })
  listReconciliationRuns(@Query() query: AdminReconciliationRunsQueryDto) {
    return this.adminService.listReconciliationRuns(query);
  }

  @Get("audit-events")
  @ApiOperation({ summary: "List sanitized audit events for support inspection" })
  @ApiOkResponse({ type: AdminAuditEventsApiResponseDto })
  listAuditEvents(@Query() query: AdminAuditEventsQueryDto) {
    return this.adminService.listAuditEvents(query);
  }

  @Get("audit-events/export.csv")
  @ApiOperation({ summary: "Export sanitized audit event summary as CSV" })
  async exportAuditEvents(
    @Query() query: AdminAuditEventsQueryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Res() response: Response
  ) {
    const exportFile = await this.adminService.exportAuditEvents(query, currentUser);
    return sendCsvResponse(response, exportFile);
  }
}
