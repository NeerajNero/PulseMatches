import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import type { Response } from "express";
import { RateLimit } from "../../common/rate-limit/rate-limit.decorator";
import { sendCsvResponse } from "../../common/utils/csv.util";
import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import {
  CreateParticipantRequestDto,
  CreatePaymentRefundRequestDto,
  CreateTeamMemberRequestDto,
  CreateTeamRequestDto,
  OrganizerParticipantApiResponseDto,
  OrganizerParticipantListApiResponseDto,
  OrganizerParticipantListQueryDto,
  OrganizerPaymentApiResponseDto,
  OrganizerPaymentDetailApiResponseDto,
  OrganizerPaymentListApiResponseDto,
  OrganizerPaymentListQueryDto,
  OrganizerReportDateRangeQueryDto,
  OrganizerRegistrationApiResponseDto,
  OrganizerRegistrationListApiResponseDto,
  OrganizerRegistrationListQueryDto,
  OrganizerRosterSummaryApiResponseDto,
  OrganizerTournamentReportSummaryApiResponseDto,
  OrganizerTeamApiResponseDto,
  OrganizerTeamListApiResponseDto,
  OrganizerTeamListQueryDto,
  OrganizerTeamMemberApiResponseDto,
  RejectRegistrationRequestDto,
  UpdateRegistrationPaymentRequestDto,
  UpdateParticipantRequestDto,
  UpdateTeamMemberRequestDto,
  UpdateTeamRequestDto
} from "./dto/organizer-roster.dto";
import { OrganizerRostersService } from "./organizer-rosters.service";

@ApiTags("organizer-rosters")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ORGANIZER)
@Controller("organizer/tournaments/:id")
export class OrganizerRostersController {
  constructor(private readonly organizerRostersService: OrganizerRostersService) {}

  @Get("roster-summary")
  @ApiOperation({ summary: "Get roster summary for one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerRosterSummaryApiResponseDto })
  getSummary(@CurrentUser() currentUser: AuthenticatedUser, @Param("id") id: string) {
    return this.organizerRostersService.getSummary(currentUser, id);
  }

  @Get("reports/summary")
  @ApiOperation({ summary: "Get organizer-owned tournament reporting summary" })
  @ApiOkResponse({ type: OrganizerTournamentReportSummaryApiResponseDto })
  getReportSummary(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerReportDateRangeQueryDto
  ) {
    return this.organizerRostersService.getReportSummary(currentUser, id, query);
  }

  @Get("registrations")
  @ApiOperation({ summary: "List registrations for one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerRegistrationListApiResponseDto })
  findRegistrations(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerRegistrationListQueryDto
  ) {
    return this.organizerRostersService.findRegistrations(currentUser, id, query);
  }

  @Get("registrations/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export registrations for one owned organizer tournament as CSV" })
  async exportRegistrations(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerRegistrationListQueryDto,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerRostersService.exportRegistrations(currentUser, id, query);
    return sendCsvResponse(response, exportFile);
  }

  @Get("reports/registrations/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export organizer registration report as CSV" })
  async exportRegistrationReport(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerRegistrationListQueryDto,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerRostersService.exportRegistrationReport(currentUser, id, query);
    return sendCsvResponse(response, exportFile);
  }

  @Get("payments")
  @ApiOperation({ summary: "List manual registration payments for one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerPaymentListApiResponseDto })
  findPayments(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerPaymentListQueryDto
  ) {
    return this.organizerRostersService.findPayments(currentUser, id, query);
  }

  @Get("payments/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export payment summaries for one owned organizer tournament as CSV" })
  async exportPayments(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerPaymentListQueryDto,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerRostersService.exportPayments(currentUser, id, query);
    return sendCsvResponse(response, exportFile);
  }

  @Get("reports/payments/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export organizer payment report as CSV" })
  async exportPaymentReport(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerPaymentListQueryDto,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerRostersService.exportPaymentReport(currentUser, id, query);
    return sendCsvResponse(response, exportFile);
  }

  @Get("payments/:registrationId")
  @ApiOperation({ summary: "Get organizer-safe payment diagnostics for one owned registration" })
  @ApiOkResponse({ type: OrganizerPaymentDetailApiResponseDto })
  findPaymentDetail(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("registrationId") registrationId: string
  ) {
    return this.organizerRostersService.findPaymentDetail(currentUser, id, registrationId);
  }

  @Patch("registrations/:registrationId/payment")
  @RateLimit({ bucket: "payment" })
  @ApiOperation({ summary: "Update manual payment status for one owned tournament registration" })
  @ApiOkResponse({ type: OrganizerPaymentApiResponseDto })
  updateRegistrationPayment(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("registrationId") registrationId: string,
    @Body() dto: UpdateRegistrationPaymentRequestDto
  ) {
    return this.organizerRostersService.updateRegistrationPayment(currentUser, id, registrationId, dto);
  }

  @Post("registrations/:registrationId/refunds")
  @RateLimit({ bucket: "payment" })
  @ApiOperation({ summary: "Record or request a refund for one owned tournament registration" })
  @ApiCreatedResponse({ type: OrganizerPaymentDetailApiResponseDto })
  createPaymentRefund(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("registrationId") registrationId: string,
    @Body() dto: CreatePaymentRefundRequestDto
  ) {
    return this.organizerRostersService.createPaymentRefund(currentUser, id, registrationId, dto);
  }

  @Patch("registrations/:registrationId/approve")
  @ApiOperation({ summary: "Approve one pending registration and create an eligible participant" })
  @ApiOkResponse({ type: OrganizerRegistrationApiResponseDto })
  approveRegistration(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("registrationId") registrationId: string
  ) {
    return this.organizerRostersService.approveRegistration(currentUser, id, registrationId);
  }

  @Patch("registrations/:registrationId/reject")
  @ApiOperation({ summary: "Reject one pending registration" })
  @ApiOkResponse({ type: OrganizerRegistrationApiResponseDto })
  rejectRegistration(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("registrationId") registrationId: string,
    @Body() dto: RejectRegistrationRequestDto
  ) {
    return this.organizerRostersService.rejectRegistration(currentUser, id, registrationId, dto);
  }

  @Patch("registrations/:registrationId/cancel")
  @ApiOperation({ summary: "Cancel one pending or confirmed registration as organizer" })
  @ApiOkResponse({ type: OrganizerRegistrationApiResponseDto })
  cancelRegistration(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("registrationId") registrationId: string
  ) {
    return this.organizerRostersService.cancelRegistration(currentUser, id, registrationId);
  }

  @Get("participants")
  @ApiOperation({ summary: "List roster participants for one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerParticipantListApiResponseDto })
  findParticipants(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerParticipantListQueryDto
  ) {
    return this.organizerRostersService.findParticipants(currentUser, id, query);
  }

  @Get("participants/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export participants for one owned organizer tournament as CSV" })
  async exportParticipants(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerParticipantListQueryDto,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerRostersService.exportParticipants(currentUser, id, query);
    return sendCsvResponse(response, exportFile);
  }

  @Post("participants")
  @ApiOperation({ summary: "Manually add a roster participant" })
  @ApiCreatedResponse({ type: OrganizerParticipantApiResponseDto })
  createParticipant(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: CreateParticipantRequestDto
  ) {
    return this.organizerRostersService.createParticipant(currentUser, id, dto);
  }

  @Patch("participants/:participantId")
  @ApiOperation({ summary: "Update one roster participant" })
  @ApiOkResponse({ type: OrganizerParticipantApiResponseDto })
  updateParticipant(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("participantId") participantId: string,
    @Body() dto: UpdateParticipantRequestDto
  ) {
    return this.organizerRostersService.updateParticipant(currentUser, id, participantId, dto);
  }

  @Delete("participants/:participantId")
  @ApiOperation({ summary: "Withdraw one roster participant" })
  @ApiOkResponse({ type: OrganizerParticipantApiResponseDto })
  deleteParticipant(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("participantId") participantId: string
  ) {
    return this.organizerRostersService.deleteParticipant(currentUser, id, participantId);
  }

  @Get("teams")
  @ApiOperation({ summary: "List teams for one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTeamListApiResponseDto })
  findTeams(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerTeamListQueryDto
  ) {
    return this.organizerRostersService.findTeams(currentUser, id, query);
  }

  @Get("teams/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export teams and members for one owned organizer tournament as CSV" })
  async exportTeams(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Query() query: OrganizerTeamListQueryDto,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerRostersService.exportTeams(currentUser, id, query);
    return sendCsvResponse(response, exportFile);
  }

  @Post("teams")
  @ApiOperation({ summary: "Create a team for one owned organizer tournament" })
  @ApiCreatedResponse({ type: OrganizerTeamApiResponseDto })
  createTeam(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: CreateTeamRequestDto
  ) {
    return this.organizerRostersService.createTeam(currentUser, id, dto);
  }

  @Get("teams/:teamId")
  @ApiOperation({ summary: "Get one team with members" })
  @ApiOkResponse({ type: OrganizerTeamApiResponseDto })
  findTeam(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("teamId") teamId: string
  ) {
    return this.organizerRostersService.findTeam(currentUser, id, teamId);
  }

  @Patch("teams/:teamId")
  @ApiOperation({ summary: "Update one team" })
  @ApiOkResponse({ type: OrganizerTeamApiResponseDto })
  updateTeam(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body() dto: UpdateTeamRequestDto
  ) {
    return this.organizerRostersService.updateTeam(currentUser, id, teamId, dto);
  }

  @Delete("teams/:teamId")
  @ApiOperation({ summary: "Withdraw one team" })
  @ApiOkResponse({ type: OrganizerTeamApiResponseDto })
  deleteTeam(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("teamId") teamId: string
  ) {
    return this.organizerRostersService.deleteTeam(currentUser, id, teamId);
  }

  @Post("teams/:teamId/members")
  @ApiOperation({ summary: "Add a member to one team" })
  @ApiCreatedResponse({ type: OrganizerTeamMemberApiResponseDto })
  createTeamMember(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Body() dto: CreateTeamMemberRequestDto
  ) {
    return this.organizerRostersService.createTeamMember(currentUser, id, teamId, dto);
  }

  @Patch("teams/:teamId/members/:memberId")
  @ApiOperation({ summary: "Update one team member" })
  @ApiOkResponse({ type: OrganizerTeamMemberApiResponseDto })
  updateTeamMember(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("memberId") memberId: string,
    @Body() dto: UpdateTeamMemberRequestDto
  ) {
    return this.organizerRostersService.updateTeamMember(currentUser, id, teamId, memberId, dto);
  }

  @Delete("teams/:teamId/members/:memberId")
  @ApiOperation({ summary: "Remove one member from a team" })
  @ApiOkResponse({ type: OrganizerTeamMemberApiResponseDto })
  deleteTeamMember(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("teamId") teamId: string,
    @Param("memberId") memberId: string
  ) {
    return this.organizerRostersService.deleteTeamMember(currentUser, id, teamId, memberId);
  }
}
