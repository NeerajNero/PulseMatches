import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import { RateLimit } from "../../common/rate-limit/rate-limit.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import {
  CreateRegistrationRequestDto,
  RegistrationApiResponseDto,
  RegistrationListApiResponseDto
} from "./dto/registration.dto";
import { RegistrationsService } from "./registrations.service";

@ApiTags("registrations")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.PLAYER)
@Controller()
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post("tournaments/:slugOrId/registrations")
  @RateLimit({ bucket: "admin_action" })
  @ApiOperation({ summary: "Register the current player for a public tournament" })
  @ApiCreatedResponse({ type: RegistrationApiResponseDto })
  createTournamentRegistration(
    @Param("slugOrId") slugOrId: string,
    @Body() dto: CreateRegistrationRequestDto,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.registrationsService.createTournamentRegistration(slugOrId, dto, currentUser);
  }

  @Get("me/registrations")
  @ApiOperation({ summary: "List registrations for the current player" })
  @ApiOkResponse({ type: RegistrationListApiResponseDto })
  findMyRegistrations(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.registrationsService.findMyRegistrations(currentUser);
  }

  @Get("registrations/:id")
  @ApiOperation({ summary: "Get one current-player registration" })
  @ApiOkResponse({ type: RegistrationApiResponseDto })
  findRegistration(@Param("id") id: string, @CurrentUser() currentUser: AuthenticatedUser) {
    return this.registrationsService.findRegistration(id, currentUser);
  }

  @Patch("registrations/:id/cancel")
  @ApiOperation({ summary: "Cancel a pending current-player registration" })
  @ApiOkResponse({ type: RegistrationApiResponseDto })
  cancelRegistration(@Param("id") id: string, @CurrentUser() currentUser: AuthenticatedUser) {
    return this.registrationsService.cancelRegistration(id, currentUser);
  }
}
