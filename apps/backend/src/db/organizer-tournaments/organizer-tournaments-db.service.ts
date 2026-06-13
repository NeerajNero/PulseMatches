import { Injectable } from "@nestjs/common";
import { Prisma, RegistrationStatus } from "@prisma/client";
import { OrganizerTournamentsRepository } from "./organizer-tournaments.repository";

@Injectable()
export class OrganizerTournamentsDbService {
  constructor(private readonly repository: OrganizerTournamentsRepository) {}

  findOrganizerProfileByUserId(userId: string) {
    return this.repository.findOrganizerProfileByUserId(userId);
  }

  findSportById(id: string) {
    return this.repository.findSportById(id);
  }

  findCityById(id: string) {
    return this.repository.findCityById(id);
  }

  findVenueById(id: string) {
    return this.repository.findVenueById(id);
  }

  findTournamentBySlug(slug: string) {
    return this.repository.findTournamentBySlug(slug);
  }

  countTournaments(where: Prisma.TournamentWhereInput) {
    return this.repository.countTournaments(where);
  }

  findOrganizerTournaments(input: {
    where: Prisma.TournamentWhereInput;
    skip: number;
    take: number;
  }) {
    return this.repository.findOrganizerTournaments(input);
  }

  findOwnedTournament(id: string, organizerProfileId: string) {
    return this.repository.findOwnedTournament(id, organizerProfileId);
  }

  createTournament(input: Prisma.TournamentUncheckedCreateInput) {
    return this.repository.createTournament(input);
  }

  updateTournament(id: string, input: Prisma.TournamentUncheckedUpdateInput) {
    return this.repository.updateTournament(id, input);
  }

  countOrganizerRegistrations(organizerProfileId: string, status?: RegistrationStatus) {
    return this.repository.countOrganizerRegistrations(organizerProfileId, status);
  }

  countActiveTournamentRegistrations(tournamentId: string) {
    return this.repository.countActiveTournamentRegistrations(tournamentId);
  }

  countActiveCategoryRegistrations(tournamentCategoryId: string) {
    return this.repository.countActiveCategoryRegistrations(tournamentCategoryId);
  }

  findCategoryById(categoryId: string) {
    return this.repository.findCategoryById(categoryId);
  }

  findCategoryByCode(tournamentId: string, code: string) {
    return this.repository.findCategoryByCode(tournamentId, code);
  }

  createCategory(input: Prisma.TournamentCategoryUncheckedCreateInput) {
    return this.repository.createCategory(input);
  }

  updateCategory(id: string, input: Prisma.TournamentCategoryUncheckedUpdateInput) {
    return this.repository.updateCategory(id, input);
  }

  deactivateCategory(id: string) {
    return this.repository.deactivateCategory(id);
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
