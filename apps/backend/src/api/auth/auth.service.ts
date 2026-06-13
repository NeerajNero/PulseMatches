import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenStatus, RoleType } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { AuthDbService } from "../../db/auth/auth-db.service";
import { AuthTransform } from "./auth.transform";
import { AccessTokenPayload, AuthenticatedUser } from "./auth.types";
import {
  AuthResponseDto,
  CurrentUserDto,
  LoginRequestDto,
  LogoutRequestDto,
  RefreshRequestDto,
  SignupRequestDto,
  SignupRoleDto
} from "./dto/auth.dto";

const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    private readonly authDb: AuthDbService,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly transform: AuthTransform
  ) {}

  async signup(dto: SignupRequestDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.authDb.findUserByEmail(email);
    if (existing) {
      throw new ConflictException("Email is already registered");
    }

    const role = this.toRoleType(dto.role);
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const organizationName = dto.organization_name?.trim();

    if (role === RoleType.ORGANIZER && !organizationName) {
      throw new BadRequestException("organization_name is required for organizer signup");
    }

    const user = await this.authDb.createUserWithRole({
      email,
      passwordHash,
      displayName: dto.display_name.trim(),
      role,
      organizerProfile: role === RoleType.ORGANIZER && organizationName
        ? {
            organizationName,
            slug: await this.createUniqueOrganizerSlug(organizationName),
            contactEmail: email,
            contactPhone: dto.contact_phone?.trim()
          }
        : undefined
    });

    return this.createAuthResponse(user);
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.authDb.findUserByEmail(email);
    if (!user || !this.transform.isActiveUserStatus(user.status)) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException("Invalid email or password");
    }

    await this.authDb.createAuditLog({
      actorId: user.id,
      entityType: "user",
      entityId: user.id,
      action: "auth.login"
    });

    return this.createAuthResponse(user);
  }

  async refresh(dto: RefreshRequestDto): Promise<AuthResponseDto> {
    const tokenHash = this.hashToken(dto.refresh_token);
    const storedToken = await this.authDb.findRefreshTokenByHash(tokenHash);

    if (
      !storedToken ||
      storedToken.status !== RefreshTokenStatus.ACTIVE ||
      storedToken.expiresAt.getTime() <= Date.now() ||
      !this.transform.isActiveUserStatus(storedToken.user.status)
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.authDb.revokeRefreshToken(storedToken.id);
    return this.createAuthResponse(storedToken.user);
  }

  async logout(dto: LogoutRequestDto, currentUser?: AuthenticatedUser) {
    if (dto.refresh_token) {
      const storedToken = await this.authDb.findRefreshTokenByHash(this.hashToken(dto.refresh_token));
      if (storedToken && storedToken.status === RefreshTokenStatus.ACTIVE) {
        await this.authDb.revokeRefreshToken(storedToken.id);
      }
    }

    await this.authDb.createAuditLog({
      actorId: currentUser?.id,
      entityType: "user",
      entityId: currentUser?.id,
      action: "auth.logout"
    });

    return { success: true };
  }

  async getCurrentUser(currentUser: AuthenticatedUser): Promise<CurrentUserDto> {
    const user = await this.authDb.findUserById(currentUser.id);
    if (!user || !this.transform.isActiveUserStatus(user.status)) {
      throw new UnauthorizedException("User is no longer active");
    }
    return this.transform.toCurrentUser(user);
  }

  private async createAuthResponse(user: Awaited<ReturnType<AuthDbService["findUserById"]>>): Promise<AuthResponseDto> {
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const roles = this.transform.toTokenRoles(user.roles);
    const accessToken = await this.signAccessToken({
      sub: user.id,
      email: user.email,
      roles
    });
    const refreshToken = this.createRefreshTokenValue();
    await this.authDb.createRefreshToken({
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: this.getRefreshExpiry()
    });

    return {
      user: this.transform.toCurrentUser(user),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: ACCESS_TOKEN_EXPIRES_IN_SECONDS
      }
    };
  }

  private async signAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.config.get<string>("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: this.config.get<string>("JWT_ACCESS_TOKEN_EXPIRY", "15m")
    });
  }

  private getRefreshExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);
    return expiresAt;
  }

  private createRefreshTokenValue() {
    return crypto.randomBytes(48).toString("base64url");
  }

  private hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  private async createUniqueOrganizerSlug(name: string) {
    const baseSlug = this.slugify(name);
    for (let index = 0; index < 20; index += 1) {
      const slug = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
      const existing = await this.authDb.organizerSlugExists(slug);
      if (!existing) {
        return slug;
      }
    }
    return `${baseSlug}-${crypto.randomBytes(4).toString("hex")}`;
  }

  private slugify(value: string) {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || `organizer-${crypto.randomBytes(4).toString("hex")}`;
  }

  private toRoleType(role: SignupRoleDto): RoleType {
    return role === SignupRoleDto.ORGANIZER ? RoleType.ORGANIZER : RoleType.PLAYER;
  }
}

