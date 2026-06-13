import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthenticatedUser } from "../auth/auth.types";
import {
  CreateOrganizerProfileRequestDto,
  OrganizerProfileApiResponseDto,
  UpdateOrganizerProfileRequestDto
} from "./dto/organizer-profile.dto";
import { OrganizerService } from "./organizer.service";

@ApiTags("organizer")
@ApiBearerAuth()
@Controller("organizer")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ORGANIZER)
export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get current organizer profile" })
  @ApiOkResponse({ type: OrganizerProfileApiResponseDto })
  getProfile(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.organizerService.getProfile(currentUser);
  }

  @Post("profile")
  @ApiOperation({ summary: "Create current organizer profile" })
  @ApiOkResponse({ type: OrganizerProfileApiResponseDto })
  createProfile(@CurrentUser() currentUser: AuthenticatedUser, @Body() dto: CreateOrganizerProfileRequestDto) {
    return this.organizerService.createProfile(currentUser, dto);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update current organizer profile" })
  @ApiOkResponse({ type: OrganizerProfileApiResponseDto })
  updateProfile(@CurrentUser() currentUser: AuthenticatedUser, @Body() dto: UpdateOrganizerProfileRequestDto) {
    return this.organizerService.updateProfile(currentUser, dto);
  }
}

