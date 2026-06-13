import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import {
  CreateOrganizerTournamentRequestDto,
  CreateTournamentCategoryRequestDto,
  OrganizerDashboardApiResponseDto,
  OrganizerTournamentApiResponseDto,
  OrganizerTournamentCategoryApiResponseDto,
  OrganizerTournamentCategoryListApiResponseDto,
  OrganizerTournamentListApiResponseDto,
  OrganizerTournamentListQueryDto,
  UpdateOrganizerTournamentRequestDto,
  UpdateTournamentCategoryRequestDto
} from "./dto/organizer-tournament.dto";
import { OrganizerTournamentsService } from "./organizer-tournaments.service";

@ApiTags("organizer-tournaments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ORGANIZER)
@Controller("organizer")
export class OrganizerTournamentsController {
  constructor(private readonly organizerTournamentsService: OrganizerTournamentsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get current organizer dashboard summary" })
  @ApiOkResponse({ type: OrganizerDashboardApiResponseDto })
  getDashboard(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.organizerTournamentsService.getDashboard(currentUser);
  }

  @Get("tournaments")
  @ApiOperation({ summary: "List current organizer tournaments" })
  @ApiOkResponse({ type: OrganizerTournamentListApiResponseDto })
  findTournaments(@CurrentUser() currentUser: AuthenticatedUser, @Query() query: OrganizerTournamentListQueryDto) {
    return this.organizerTournamentsService.findTournaments(currentUser, query);
  }

  @Post("tournaments")
  @ApiOperation({ summary: "Create a draft tournament for the current organizer" })
  @ApiCreatedResponse({ type: OrganizerTournamentApiResponseDto })
  createTournament(@CurrentUser() currentUser: AuthenticatedUser, @Body() dto: CreateOrganizerTournamentRequestDto) {
    return this.organizerTournamentsService.createTournament(currentUser, dto);
  }

  @Get("tournaments/:id")
  @ApiOperation({ summary: "Get one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTournamentApiResponseDto })
  findTournament(@CurrentUser() currentUser: AuthenticatedUser, @Param("id") id: string) {
    return this.organizerTournamentsService.findTournament(currentUser, id);
  }

  @Patch("tournaments/:id")
  @ApiOperation({ summary: "Update one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTournamentApiResponseDto })
  updateTournament(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateOrganizerTournamentRequestDto
  ) {
    return this.organizerTournamentsService.updateTournament(currentUser, id, dto);
  }

  @Patch("tournaments/:id/publish")
  @ApiOperation({ summary: "Publish one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTournamentApiResponseDto })
  publishTournament(@CurrentUser() currentUser: AuthenticatedUser, @Param("id") id: string) {
    return this.organizerTournamentsService.publishTournament(currentUser, id);
  }

  @Patch("tournaments/:id/unpublish")
  @ApiOperation({ summary: "Move one owned organizer tournament back to draft" })
  @ApiOkResponse({ type: OrganizerTournamentApiResponseDto })
  unpublishTournament(@CurrentUser() currentUser: AuthenticatedUser, @Param("id") id: string) {
    return this.organizerTournamentsService.unpublishTournament(currentUser, id);
  }

  @Get("tournaments/:id/categories")
  @ApiOperation({ summary: "List categories for one owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTournamentCategoryListApiResponseDto })
  findCategories(@CurrentUser() currentUser: AuthenticatedUser, @Param("id") id: string) {
    return this.organizerTournamentsService.findCategories(currentUser, id);
  }

  @Post("tournaments/:id/categories")
  @ApiOperation({ summary: "Create a category for one owned organizer tournament" })
  @ApiCreatedResponse({ type: OrganizerTournamentCategoryApiResponseDto })
  createCategory(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: CreateTournamentCategoryRequestDto
  ) {
    return this.organizerTournamentsService.createCategory(currentUser, id, dto);
  }

  @Patch("tournaments/:id/categories/:categoryId")
  @ApiOperation({ summary: "Update one category for an owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTournamentCategoryApiResponseDto })
  updateCategory(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("categoryId") categoryId: string,
    @Body() dto: UpdateTournamentCategoryRequestDto
  ) {
    return this.organizerTournamentsService.updateCategory(currentUser, id, categoryId, dto);
  }

  @Delete("tournaments/:id/categories/:categoryId")
  @ApiOperation({ summary: "Deactivate one category for an owned organizer tournament" })
  @ApiOkResponse({ type: OrganizerTournamentCategoryApiResponseDto })
  deleteCategory(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("categoryId") categoryId: string
  ) {
    return this.organizerTournamentsService.deleteCategory(currentUser, id, categoryId);
  }
}
