import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthDbService {
  constructor(private readonly repository: AuthRepository) {}

  findUserByEmail(email: string) {
    return this.repository.findUserByEmail(email);
  }

  findUserById(id: string) {
    return this.repository.findUserById(id);
  }

  organizerSlugExists(slug: string) {
    return this.repository.organizerSlugExists(slug);
  }

  createUserWithRole(input: Parameters<AuthRepository["createUserWithRole"]>[0]) {
    return this.repository.createUserWithRole(input);
  }

  createRefreshToken(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    return this.repository.createRefreshToken(input);
  }

  findRefreshTokenByHash(tokenHash: string) {
    return this.repository.findRefreshTokenByHash(tokenHash);
  }

  revokeRefreshToken(id: string) {
    return this.repository.revokeRefreshToken(id);
  }

  createAuditLog(input: {
    actorId?: string;
    entityType: string;
    entityId?: string;
    action: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.repository.createAuditLog(input);
  }
}
