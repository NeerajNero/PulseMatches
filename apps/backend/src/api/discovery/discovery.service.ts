import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TournamentStatus, TournamentVisibility } from "@prisma/client";
import { DiscoveryDbService } from "../../db/discovery/discovery-db.service";
import { DiscoveryTransform } from "./discovery.transform";
import { TournamentListQueryDto } from "./dto/discovery-query.dto";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class DiscoveryService {
  constructor(
    private readonly discoveryDb: DiscoveryDbService,
    private readonly transform: DiscoveryTransform
  ) {}

  async findSports() {
    const sports = await this.discoveryDb.findActiveSports();
    return sports.map((sport) => this.transform.toSport(sport));
  }

  async findCities() {
    const cities = await this.discoveryDb.findActiveCities();
    return cities.map((city) => this.transform.toCity(city));
  }

  async findTournaments(query: TournamentListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where = this.buildPublicTournamentWhere(query);
    const [total, tournaments] = await Promise.all([
      this.discoveryDb.countPublicTournaments(where),
      this.discoveryDb.findPublicTournaments({
        where,
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return {
      items: tournaments.map((tournament) => this.transform.toTournamentListItem(tournament)),
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        has_next: page * limit < total
      }
    };
  }

  async findTournamentDetail(slugOrId: string) {
    const tournament = await this.findPublicTournament(slugOrId);
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    return this.transform.toTournamentDetail(tournament);
  }

  async findTournamentFixtures(slugOrId: string) {
    const tournament = await this.findPublicTournament(slugOrId);
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }
    const fixtureSets = await this.discoveryDb.findPublicFixtureSetsByTournament({
      id: tournament.id,
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC
    });
    return fixtureSets.map((fixtureSet) => this.transform.toPublicFixtureSet(fixtureSet));
  }

  private async findPublicTournament(slugOrId: string) {
    const bySlug = await this.discoveryDb.findPublicTournamentBySlug(slugOrId);
    return bySlug ?? (UUID_PATTERN.test(slugOrId)
      ? await this.discoveryDb.findPublicTournamentById(slugOrId)
      : null);
  }

  private buildPublicTournamentWhere(query: TournamentListQueryDto): Prisma.TournamentWhereInput {
    const status = query.status?.toUpperCase() as TournamentStatus | undefined;

    if (status && status !== TournamentStatus.PUBLISHED) {
      return {
        slug: "__no_public_tournament__"
      };
    }

    const where: Prisma.TournamentWhereInput = {
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC
    };

    if (query.city) {
      where.city = UUID_PATTERN.test(query.city)
        ? { id: query.city }
        : { slug: query.city.toLowerCase() };
    }

    if (query.sport) {
      where.sport = UUID_PATTERN.test(query.sport)
        ? { id: query.sport }
        : { slug: query.sport.toLowerCase() };
    }

    if (query.upcoming_only) {
      where.startsAt = {
        ...(typeof where.startsAt === "object" && where.startsAt !== null ? where.startsAt : {}),
        gte: new Date()
      };
    }

    if (query.starts_from || query.starts_to) {
      where.startsAt = {
        ...(typeof where.startsAt === "object" && where.startsAt !== null ? where.startsAt : {}),
        gte: query.starts_from ? new Date(query.starts_from) : (where.startsAt as Prisma.DateTimeFilter | undefined)?.gte,
        lte: query.starts_to ? new Date(query.starts_to) : undefined
      };
    }

    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    return where;
  }
}
