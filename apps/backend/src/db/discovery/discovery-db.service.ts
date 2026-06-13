import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DiscoveryRepository } from "./discovery.repository";

@Injectable()
export class DiscoveryDbService {
  constructor(private readonly repository: DiscoveryRepository) {}

  findActiveSports() {
    return this.repository.findActiveSports();
  }

  findActiveCities() {
    return this.repository.findActiveCities();
  }

  countPublicTournaments(where: Prisma.TournamentWhereInput) {
    return this.repository.countPublicTournaments(where);
  }

  findPublicTournaments(input: { where: Prisma.TournamentWhereInput; skip: number; take: number }) {
    return this.repository.findPublicTournaments(input);
  }

  findPublicTournamentBySlug(slug: string) {
    return this.repository.findPublicTournamentBySlug(slug);
  }

  findPublicTournamentById(id: string) {
    return this.repository.findPublicTournamentById(id);
  }

  findPublicFixtureSetsByTournament(tournamentWhere: Prisma.TournamentWhereInput) {
    return this.repository.findPublicFixtureSetsByTournament(tournamentWhere);
  }
}
