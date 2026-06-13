import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import crypto from "node:crypto";
import {
  GenderType,
  OrganizerVerificationStatus,
  Prisma,
  RegistrationStatus,
  TournamentCategoryStatus,
  TournamentStatus,
  TournamentVisibility
} from "@prisma/client";
import { OrganizerTournamentsDbService } from "../../db/organizer-tournaments/organizer-tournaments-db.service";
import { AuthenticatedUser } from "../auth/auth.types";
import {
  CreateOrganizerTournamentRequestDto,
  CreateTournamentCategoryRequestDto,
  OrganizerTournamentListQueryDto,
  UpdateOrganizerTournamentRequestDto,
  UpdateTournamentCategoryRequestDto
} from "./dto/organizer-tournament.dto";
import { OrganizerTournamentsTransform } from "./organizer-tournaments.transform";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class OrganizerTournamentsService {
  constructor(
    private readonly organizerTournamentsDb: OrganizerTournamentsDbService,
    private readonly transform: OrganizerTournamentsTransform
  ) {}

  async getDashboard(currentUser: AuthenticatedUser) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const now = new Date();
    const [total, drafts, published, upcoming, totalRegistrations, pendingRegistrations, recent] = await Promise.all([
      this.organizerTournamentsDb.countTournaments({ organizerProfileId: profile.id }),
      this.organizerTournamentsDb.countTournaments({ organizerProfileId: profile.id, status: TournamentStatus.DRAFT }),
      this.organizerTournamentsDb.countTournaments({ organizerProfileId: profile.id, status: TournamentStatus.PUBLISHED }),
      this.organizerTournamentsDb.countTournaments({ organizerProfileId: profile.id, startsAt: { gte: now } }),
      this.organizerTournamentsDb.countOrganizerRegistrations(profile.id),
      this.organizerTournamentsDb.countOrganizerRegistrations(profile.id, RegistrationStatus.PENDING),
      this.organizerTournamentsDb.findOrganizerTournaments({
        where: { organizerProfileId: profile.id },
        skip: 0,
        take: 5
      })
    ]);

    return {
      total_tournaments: total,
      draft_tournaments: drafts,
      published_tournaments: published,
      upcoming_tournaments: upcoming,
      total_registrations: totalRegistrations,
      pending_registrations: pendingRegistrations,
      recent_tournaments: recent.map((tournament) => this.transform.toTournament(tournament))
    };
  }

  async findTournaments(currentUser: AuthenticatedUser, query: OrganizerTournamentListQueryDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where = this.buildTournamentListWhere(profile.id, query);
    const [total, tournaments] = await Promise.all([
      this.organizerTournamentsDb.countTournaments(where),
      this.organizerTournamentsDb.findOrganizerTournaments({
        where,
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return {
      items: tournaments.map((tournament) => this.transform.toTournament(tournament)),
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      has_next: page * limit < total
    };
  }

  async createTournament(currentUser: AuthenticatedUser, dto: CreateOrganizerTournamentRequestDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.assertCatalogReferences(dto.sport_id, dto.city_id, dto.venue_id);
    this.assertTournamentDates({
      startsAt: new Date(dto.starts_at),
      endsAt: new Date(dto.ends_at),
      registrationOpensAt: dto.registration_opens_at ? new Date(dto.registration_opens_at) : null,
      registrationClosesAt: dto.registration_closes_at ? new Date(dto.registration_closes_at) : null
    });

    const tournament = await this.organizerTournamentsDb.createTournament({
      organizerProfileId: profile.id,
      sportId: dto.sport_id,
      cityId: dto.city_id,
      venueId: dto.venue_id?.trim() || undefined,
      title: dto.title.trim(),
      slug: await this.createUniqueTournamentSlug(dto.title),
      shortDescription: this.cleanOptionalString(dto.short_description),
      description: this.cleanOptionalString(dto.description),
      status: TournamentStatus.DRAFT,
      visibility: TournamentVisibility.PUBLIC,
      startsAt: new Date(dto.starts_at),
      endsAt: new Date(dto.ends_at),
      registrationOpensAt: dto.registration_opens_at ? new Date(dto.registration_opens_at) : undefined,
      registrationClosesAt: dto.registration_closes_at ? new Date(dto.registration_closes_at) : undefined,
      maxParticipants: dto.max_participants
    });

    await this.audit(currentUser.id, "tournament", tournament.id, "tournament.create", {
      organizer_profile_id: profile.id
    });

    return this.transform.toTournament(tournament);
  }

  async findTournament(currentUser: AuthenticatedUser, id: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(id, profile.id);
    return this.transform.toTournament(tournament);
  }

  async updateTournament(currentUser: AuthenticatedUser, id: string, dto: UpdateOrganizerTournamentRequestDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const existing = await this.requireOwnedTournament(id, profile.id);
    const sportId = dto.sport_id ?? existing.sportId;
    const cityId = dto.city_id ?? existing.cityId;
    const venueId = dto.venue_id === undefined ? existing.venueId : dto.venue_id;

    await this.assertCatalogReferences(sportId, cityId, venueId ?? undefined);

    const startsAt = dto.starts_at ? new Date(dto.starts_at) : existing.startsAt;
    const endsAt = dto.ends_at ? new Date(dto.ends_at) : existing.endsAt;
    const registrationOpensAt = this.toNullableDate(dto.registration_opens_at, existing.registrationOpensAt);
    const registrationClosesAt = this.toNullableDate(dto.registration_closes_at, existing.registrationClosesAt);

    this.assertTournamentDates({ startsAt, endsAt, registrationOpensAt, registrationClosesAt });

    const tournament = await this.organizerTournamentsDb.updateTournament(id, {
      sportId,
      cityId,
      venueId,
      title: dto.title?.trim(),
      shortDescription: this.cleanNullableString(dto.short_description),
      description: this.cleanNullableString(dto.description),
      startsAt,
      endsAt,
      registrationOpensAt,
      registrationClosesAt,
      maxParticipants: dto.max_participants === undefined ? undefined : dto.max_participants
    });

    await this.audit(currentUser.id, "tournament", tournament.id, "tournament.update", {
      organizer_profile_id: profile.id
    });

    return this.transform.toTournament(tournament);
  }

  async publishTournament(currentUser: AuthenticatedUser, id: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(id, profile.id);

    if (profile.verificationStatus !== OrganizerVerificationStatus.VERIFIED) {
      throw new ForbiddenException("Organizer verification is required before publishing tournaments");
    }

    this.assertPublishable(tournament);

    const published = await this.organizerTournamentsDb.updateTournament(id, {
      status: TournamentStatus.PUBLISHED,
      visibility: TournamentVisibility.PUBLIC,
      publishedAt: new Date()
    });

    await this.audit(currentUser.id, "tournament", published.id, "tournament.publish", {
      organizer_profile_id: profile.id
    });

    return this.transform.toTournament(published);
  }

  async unpublishTournament(currentUser: AuthenticatedUser, id: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(id, profile.id);
    const activeRegistrations = await this.organizerTournamentsDb.countActiveTournamentRegistrations(tournament.id);

    if (activeRegistrations > 0) {
      throw new ConflictException("Cannot unpublish a tournament with active registrations");
    }

    const unpublished = await this.organizerTournamentsDb.updateTournament(id, {
      status: TournamentStatus.DRAFT,
      publishedAt: null
    });

    await this.audit(currentUser.id, "tournament", unpublished.id, "tournament.unpublish", {
      organizer_profile_id: profile.id
    });

    return this.transform.toTournament(unpublished);
  }

  async findCategories(currentUser: AuthenticatedUser, tournamentId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    const tournament = await this.requireOwnedTournament(tournamentId, profile.id);
    return tournament.categories.map((category) => this.transform.toCategory(category));
  }

  async createCategory(currentUser: AuthenticatedUser, tournamentId: string, dto: CreateTournamentCategoryRequestDto) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const code = this.slugify(dto.code ?? dto.name);
    await this.assertCategoryCodeAvailable(tournamentId, code);

    const category = await this.organizerTournamentsDb.createCategory({
      tournamentId,
      name: dto.name.trim(),
      code,
      formatType: dto.format_type,
      participantType: dto.participant_type,
      genderType: dto.gender_type ?? GenderType.OPEN,
      minAge: dto.min_age,
      maxAge: dto.max_age,
      entryFeeAmount: dto.entry_fee_amount ?? 0,
      entryFeeCurrency: (dto.entry_fee_currency ?? "INR").trim().toUpperCase(),
      capacity: dto.capacity,
      status: TournamentCategoryStatus.ACTIVE
    });

    await this.audit(currentUser.id, "tournament_category", category.id, "tournament_category.create", {
      tournament_id: tournamentId
    });

    return this.transform.toCategory(category);
  }

  async updateCategory(
    currentUser: AuthenticatedUser,
    tournamentId: string,
    categoryId: string,
    dto: UpdateTournamentCategoryRequestDto
  ) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    const category = await this.requireOwnedCategory(categoryId, tournamentId, profile.id);
    const code = dto.code ? this.slugify(dto.code) : undefined;

    if (code && code !== category.code) {
      await this.assertCategoryCodeAvailable(tournamentId, code);
    }

    if (dto.min_age !== undefined && dto.max_age !== undefined && dto.min_age !== null && dto.max_age !== null) {
      this.assertAgeRange(dto.min_age, dto.max_age);
    }

    const updated = await this.organizerTournamentsDb.updateCategory(categoryId, {
      name: dto.name?.trim(),
      code,
      formatType: dto.format_type,
      participantType: dto.participant_type,
      genderType: dto.gender_type,
      minAge: dto.min_age === undefined ? undefined : dto.min_age,
      maxAge: dto.max_age === undefined ? undefined : dto.max_age,
      entryFeeAmount: dto.entry_fee_amount,
      entryFeeCurrency: dto.entry_fee_currency?.trim().toUpperCase(),
      capacity: dto.capacity === undefined ? undefined : dto.capacity,
      status: dto.status
    });

    await this.audit(currentUser.id, "tournament_category", updated.id, "tournament_category.update", {
      tournament_id: tournamentId
    });

    return this.transform.toCategory(updated);
  }

  async deleteCategory(currentUser: AuthenticatedUser, tournamentId: string, categoryId: string) {
    const profile = await this.requireOrganizerProfile(currentUser.id);
    await this.requireOwnedTournament(tournamentId, profile.id);
    await this.requireOwnedCategory(categoryId, tournamentId, profile.id);
    const activeRegistrations = await this.organizerTournamentsDb.countActiveCategoryRegistrations(categoryId);

    if (activeRegistrations > 0) {
      throw new ConflictException("Cannot delete a category with active registrations");
    }

    const category = await this.organizerTournamentsDb.deactivateCategory(categoryId);

    await this.audit(currentUser.id, "tournament_category", category.id, "tournament_category.delete", {
      tournament_id: tournamentId,
      delete_mode: "deactivate"
    });

    return this.transform.toCategory(category);
  }

  private async requireOrganizerProfile(userId: string) {
    const profile = await this.organizerTournamentsDb.findOrganizerProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException("Organizer profile not found");
    }
    return profile;
  }

  private async requireOwnedTournament(id: string, organizerProfileId: string) {
    const tournament = await this.organizerTournamentsDb.findOwnedTournament(id, organizerProfileId);
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }
    return tournament;
  }

  private async requireOwnedCategory(categoryId: string, tournamentId: string, organizerProfileId: string) {
    const category = await this.organizerTournamentsDb.findCategoryById(categoryId);
    if (!category || category.tournamentId !== tournamentId || category.tournament.organizerProfileId !== organizerProfileId) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }

  private buildTournamentListWhere(organizerProfileId: string, query: OrganizerTournamentListQueryDto) {
    const where: Prisma.TournamentWhereInput = { organizerProfileId };

    if (query.status) {
      where.status = query.status.toUpperCase() as TournamentStatus;
    }

    if (query.sport) {
      where.sport = UUID_PATTERN.test(query.sport)
        ? { id: query.sport }
        : { slug: query.sport.toLowerCase() };
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

  private async assertCatalogReferences(sportId: string, cityId: string, venueId?: string | null) {
    const [sport, city, venue] = await Promise.all([
      this.organizerTournamentsDb.findSportById(sportId),
      this.organizerTournamentsDb.findCityById(cityId),
      venueId ? this.organizerTournamentsDb.findVenueById(venueId) : Promise.resolve(null)
    ]);

    if (!sport) {
      throw new BadRequestException("Sport not found");
    }

    if (!city) {
      throw new BadRequestException("City not found");
    }

    if (venueId && !venue) {
      throw new BadRequestException("Venue not found");
    }

    if (venue && venue.cityId !== cityId) {
      throw new BadRequestException("Venue must belong to the selected city");
    }
  }

  private assertTournamentDates(input: {
    startsAt: Date;
    endsAt: Date;
    registrationOpensAt: Date | null;
    registrationClosesAt: Date | null;
  }) {
    if (input.endsAt < input.startsAt) {
      throw new BadRequestException("Tournament end date must be after the start date");
    }

    if (input.registrationOpensAt && input.registrationClosesAt && input.registrationClosesAt < input.registrationOpensAt) {
      throw new BadRequestException("Registration close date must be after the open date");
    }

    if (input.registrationClosesAt && input.registrationClosesAt > input.endsAt) {
      throw new BadRequestException("Registration close date must be before the tournament ends");
    }
  }

  private assertPublishable(tournament: Awaited<ReturnType<OrganizerTournamentsDbService["findOwnedTournament"]>>) {
    if (!tournament) {
      throw new NotFoundException("Tournament not found");
    }

    if (!tournament.title.trim()) {
      throw new BadRequestException("Tournament title is required before publishing");
    }

    if (tournament.endsAt < tournament.startsAt) {
      throw new BadRequestException("Tournament dates must be valid before publishing");
    }

    const activeCategories = tournament.categories.filter((category) => category.status === TournamentCategoryStatus.ACTIVE);
    if (activeCategories.length === 0) {
      throw new BadRequestException("At least one active category is required before publishing");
    }
  }

  private async assertCategoryCodeAvailable(tournamentId: string, code: string) {
    const existing = await this.organizerTournamentsDb.findCategoryByCode(tournamentId, code);
    if (existing) {
      throw new ConflictException("Category code already exists for this tournament");
    }
  }

  private assertAgeRange(minAge: number, maxAge: number) {
    if (maxAge < minAge) {
      throw new BadRequestException("Maximum age must be greater than or equal to minimum age");
    }
  }

  private async createUniqueTournamentSlug(title: string) {
    const baseSlug = this.slugify(title);
    for (let index = 0; index < 20; index += 1) {
      const slug = index === 0 ? baseSlug : `${baseSlug}-${index + 1}`;
      const existing = await this.organizerTournamentsDb.findTournamentBySlug(slug);
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
    return slug || `tournament-${crypto.randomBytes(4).toString("hex")}`;
  }

  private cleanOptionalString(value?: string | null): string | undefined {
    const cleanValue = value?.trim();
    return cleanValue ? cleanValue : undefined;
  }

  private cleanNullableString(value?: string | null): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }
    const cleanValue = value?.trim();
    return cleanValue ? cleanValue : null;
  }

  private toNullableDate(value: string | null | undefined, fallback: Date | null) {
    if (value === undefined) {
      return fallback;
    }
    return value ? new Date(value) : null;
  }

  private audit(actorId: string, entityType: string, entityId: string, action: string, metadata: Prisma.InputJsonObject) {
    return this.organizerTournamentsDb.createAuditLog({
      actorId,
      entityType,
      entityId,
      action,
      metadata
    });
  }
}
