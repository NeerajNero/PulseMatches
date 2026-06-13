import { City, Sport, TournamentCategory, Venue } from "@prisma/client";
import { OrganizerTournamentWithRelations } from "../../db/organizer-tournaments/organizer-tournaments.repository";
import {
  CityDto,
  SportDto,
  TournamentCategoryDto,
  VenueDto
} from "../discovery/dto/discovery-response.dto";
import { OrganizerTournamentDto } from "./dto/organizer-tournament.dto";

export class OrganizerTournamentsTransform {
  toTournament(tournament: OrganizerTournamentWithRelations): OrganizerTournamentDto {
    return {
      id: tournament.id,
      slug: tournament.slug,
      title: tournament.title,
      short_description: tournament.shortDescription,
      description: tournament.description,
      sport: this.toSport(tournament.sport),
      city: this.toCity(tournament.city),
      venue: tournament.venue ? this.toVenue(tournament.venue) : null,
      starts_at: tournament.startsAt.toISOString(),
      ends_at: tournament.endsAt.toISOString(),
      registration_opens_at: tournament.registrationOpensAt?.toISOString() ?? null,
      registration_closes_at: tournament.registrationClosesAt?.toISOString() ?? null,
      max_participants: tournament.maxParticipants,
      published_at: tournament.publishedAt?.toISOString() ?? null,
      status: this.toApiEnum(tournament.status),
      visibility: this.toApiEnum(tournament.visibility),
      registration_count: tournament._count.registrations,
      pending_registration_count: tournament.registrations.length,
      categories: tournament.categories.map((category) => this.toCategory(category)),
      created_at: tournament.createdAt.toISOString(),
      updated_at: tournament.updatedAt.toISOString()
    };
  }

  toCategory(category: TournamentCategory): TournamentCategoryDto {
    return {
      id: category.id,
      name: category.name,
      code: category.code,
      format_type: this.toApiEnum(category.formatType),
      participant_type: this.toApiEnum(category.participantType),
      gender_type: this.toApiEnum(category.genderType),
      min_age: category.minAge,
      max_age: category.maxAge,
      entry_fee_amount: category.entryFeeAmount,
      entry_fee_currency: category.entryFeeCurrency,
      capacity: category.capacity,
      status: this.toApiEnum(category.status)
    };
  }

  private toSport(sport: Sport): SportDto {
    return {
      id: sport.id,
      name: sport.name,
      slug: sport.slug,
      status: this.toApiEnum(sport.status)
    };
  }

  private toCity(city: City): CityDto {
    return {
      id: city.id,
      name: city.name,
      slug: city.slug,
      country_code: city.countryCode,
      status: this.toApiEnum(city.status)
    };
  }

  private toVenue(venue: Venue): VenueDto {
    return {
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      address: venue.address,
      latitude: venue.latitude?.toString() ?? null,
      longitude: venue.longitude?.toString() ?? null
    };
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
