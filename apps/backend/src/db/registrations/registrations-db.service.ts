import { Injectable } from "@nestjs/common";
import { Prisma, RegistrationStatus } from "@prisma/client";
import { RegistrationsRepository } from "./registrations.repository";

@Injectable()
export class RegistrationsDbService {
  constructor(private readonly repository: RegistrationsRepository) {}

  findUserById(id: string) {
    return this.repository.findUserById(id);
  }

  findPublicTournamentBySlug(slug: string) {
    return this.repository.findPublicTournamentBySlug(slug);
  }

  findPublicTournamentById(id: string) {
    return this.repository.findPublicTournamentById(id);
  }

  findActiveRegistration(input: {
    userId: string;
    tournamentId: string;
    tournamentCategoryId: string | null;
    statuses: RegistrationStatus[];
  }) {
    return this.repository.findActiveRegistration(input);
  }

  countActiveCategoryRegistrations(input: { tournamentCategoryId: string; statuses: RegistrationStatus[] }) {
    return this.repository.countActiveCategoryRegistrations(input);
  }

  createRegistration(input: Prisma.RegistrationUncheckedCreateInput) {
    return this.repository.createRegistration(input);
  }

  findRegistrationsByUser(userId: string) {
    return this.repository.findRegistrationsByUser(userId);
  }

  findRegistrationById(id: string) {
    return this.repository.findRegistrationById(id);
  }

  cancelRegistration(id: string) {
    return this.repository.cancelRegistration(id);
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
