import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards } from "@nestjs/common";
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
  FixtureMatchApiResponseDto,
  FixtureSetApiResponseDto,
  FixtureSetListApiResponseDto,
  GenerateFixtureSetRequestDto,
  UpdateMatchScoreRequestDto,
  UpdateMatchScheduleRequestDto
} from "./dto/organizer-fixture.dto";
import { OrganizerFixturesService } from "./organizer-fixtures.service";

@ApiTags("organizer-fixtures")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ORGANIZER)
@Controller("organizer/tournaments/:id")
export class OrganizerFixturesController {
  constructor(private readonly organizerFixturesService: OrganizerFixturesService) {}

  @Get("fixtures")
  @ApiOperation({ summary: "List fixture sets for one owned organizer tournament" })
  @ApiOkResponse({ type: FixtureSetListApiResponseDto })
  findFixtureSets(@CurrentUser() currentUser: AuthenticatedUser, @Param("id") id: string) {
    return this.organizerFixturesService.findFixtureSets(currentUser, id);
  }

  @Post("categories/:categoryId/fixtures/generate")
  @RateLimit({ bucket: "admin_action" })
  @ApiOperation({ summary: "Generate a fixture set for one tournament category" })
  @ApiCreatedResponse({ type: FixtureSetApiResponseDto })
  generateFixtureSet(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("categoryId") categoryId: string,
    @Body() dto: GenerateFixtureSetRequestDto
  ) {
    return this.organizerFixturesService.generateFixtureSet(currentUser, id, categoryId, dto);
  }

  @Get("fixtures/:fixtureSetId")
  @ApiOperation({ summary: "Get fixture set rounds and matches for one owned tournament" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  findFixtureSet(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string
  ) {
    return this.organizerFixturesService.findFixtureSet(currentUser, id, fixtureSetId);
  }

  @Get("fixtures/:fixtureSetId/results")
  @ApiOperation({ summary: "Get fixture rounds, match scores, winners, and standings" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  findFixtureResults(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string
  ) {
    return this.organizerFixturesService.findFixtureResults(currentUser, id, fixtureSetId);
  }

  @Get("fixtures/:fixtureSetId/results/export.csv")
  @RateLimit({ bucket: "export" })
  @ApiOperation({ summary: "Export fixture match results for one owned tournament fixture set as CSV" })
  async exportFixtureResults(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string,
    @Res() response: Response
  ) {
    const exportFile = await this.organizerFixturesService.exportFixtureResults(currentUser, id, fixtureSetId);
    return sendCsvResponse(response, exportFile);
  }

  @Patch("fixtures/:fixtureSetId/matches/:matchId")
  @ApiOperation({ summary: "Update match schedule fields only" })
  @ApiOkResponse({ type: FixtureMatchApiResponseDto })
  updateMatchSchedule(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string,
    @Param("matchId") matchId: string,
    @Body() dto: UpdateMatchScheduleRequestDto
  ) {
    return this.organizerFixturesService.updateMatchSchedule(currentUser, id, fixtureSetId, matchId, dto);
  }

  @Patch("fixtures/:fixtureSetId/matches/:matchId/score")
  @ApiOperation({ summary: "Save generic score values for one match" })
  @ApiOkResponse({ type: FixtureMatchApiResponseDto })
  updateMatchScore(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string,
    @Param("matchId") matchId: string,
    @Body() dto: UpdateMatchScoreRequestDto
  ) {
    return this.organizerFixturesService.updateMatchScore(currentUser, id, fixtureSetId, matchId, dto);
  }

  @Patch("fixtures/:fixtureSetId/matches/:matchId/complete")
  @ApiOperation({ summary: "Complete a match with generic scores and a winner" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  completeMatch(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string,
    @Param("matchId") matchId: string,
    @Body() dto: UpdateMatchScoreRequestDto
  ) {
    return this.organizerFixturesService.completeMatch(currentUser, id, fixtureSetId, matchId, dto);
  }

  @Patch("fixtures/:fixtureSetId/matches/:matchId/reopen")
  @ApiOperation({ summary: "Reopen a completed match when it is safe" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  reopenMatch(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string,
    @Param("matchId") matchId: string
  ) {
    return this.organizerFixturesService.reopenMatch(currentUser, id, fixtureSetId, matchId);
  }

  @Patch("fixtures/:fixtureSetId/publish-results")
  @RateLimit({ bucket: "admin_action" })
  @ApiOperation({ summary: "Publish one fixture set for public read-only fixtures and results" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  publishFixtureResults(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string
  ) {
    return this.organizerFixturesService.publishFixtureResults(currentUser, id, fixtureSetId);
  }

  @Patch("fixtures/:fixtureSetId/unpublish-results")
  @RateLimit({ bucket: "admin_action" })
  @ApiOperation({ summary: "Hide one fixture set from public fixtures and results" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  unpublishFixtureResults(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string
  ) {
    return this.organizerFixturesService.unpublishFixtureResults(currentUser, id, fixtureSetId);
  }

  @Patch("fixtures/:fixtureSetId/archive")
  @RateLimit({ bucket: "admin_action" })
  @ApiOperation({ summary: "Archive one fixture set" })
  @ApiOkResponse({ type: FixtureSetApiResponseDto })
  archiveFixtureSet(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param("id") id: string,
    @Param("fixtureSetId") fixtureSetId: string
  ) {
    return this.organizerFixturesService.archiveFixtureSet(currentUser, id, fixtureSetId);
  }
}
