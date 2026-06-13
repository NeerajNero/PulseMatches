import { Injectable } from "@nestjs/common";
import { Prisma, RefreshTokenStatus, RoleType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const userAuthInclude = {
  roles: true,
  organizerProfile: true
} satisfies Prisma.UserInclude;

export type UserWithAuthRelations = Prisma.UserGetPayload<{ include: typeof userAuthInclude }>;

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: userAuthInclude
    });
  }

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: userAuthInclude
    });
  }

  organizerSlugExists(slug: string) {
    return this.prisma.organizerProfile.findUnique({
      where: { slug },
      select: { id: true }
    });
  }

  async createUserWithRole(input: {
    email: string;
    passwordHash: string;
    displayName: string;
    role: RoleType;
    organizerProfile?: {
      organizationName: string;
      slug: string;
      contactEmail: string;
      contactPhone?: string;
    };
  }) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash: input.passwordHash,
          displayName: input.displayName,
          roles: {
            create: { role: input.role }
          },
          organizerProfile: input.organizerProfile
            ? {
                create: {
                  organizationName: input.organizerProfile.organizationName,
                  slug: input.organizerProfile.slug,
                  contactEmail: input.organizerProfile.contactEmail,
                  contactPhone: input.organizerProfile.contactPhone
                }
              }
            : undefined
        },
        include: userAuthInclude
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          entityType: "user",
          entityId: user.id,
          action: "auth.signup",
          metadata: { role: input.role }
        }
      });

      return user;
    });
  }

  createRefreshToken(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    return this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt
      }
    });
  }

  findRefreshTokenByHash(tokenHash: string) {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: userAuthInclude
        }
      }
    });
  }

  revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: {
        status: RefreshTokenStatus.REVOKED,
        revokedAt: new Date()
      }
    });
  }

  createAuditLog(input: {
    actorId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        metadata: input.metadata
      }
    });
  }
}

