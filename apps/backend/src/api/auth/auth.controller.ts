import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "./decorators/current-user.decorator";
import {
  AuthApiResponseDto,
  LoginRequestDto,
  LogoutApiResponseDto,
  LogoutRequestDto,
  RefreshRequestDto,
  SignupRequestDto,
  CurrentUserApiResponseDto
} from "./dto/auth.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { AuthenticatedUser } from "./auth.types";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({ summary: "Create a player or organizer account" })
  @ApiOkResponse({ type: AuthApiResponseDto })
  signup(@Body() dto: SignupRequestDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  @ApiOperation({ summary: "Log in with email and password" })
  @ApiOkResponse({ type: AuthApiResponseDto })
  login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refresh an access token" })
  @ApiOkResponse({ type: AuthApiResponseDto })
  refresh(@Body() dto: RefreshRequestDto) {
    return this.authService.refresh(dto);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Log out and revoke a refresh token when provided" })
  @ApiOkResponse({ type: LogoutApiResponseDto })
  logout(@Body() dto: LogoutRequestDto, @CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.logout(dto, currentUser);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current authenticated user" })
  @ApiOkResponse({ type: CurrentUserApiResponseDto })
  me(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.authService.getCurrentUser(currentUser);
  }
}

