import { City, FixtureEntrantType, FixtureFormat, MatchStatus, Sport, Venue } from "@prisma/client";
import { PublicFixtureSetWithRelations, TournamentWithDiscoveryRelations } from "../../db/discovery/discovery.repository";
import {
  CityDto,
  OrganizerSummaryDto,
  PublicFixtureEntrantDto,
  PublicFixtureMatchDto,
  PublicFixtureRoundDto,
  PublicFixtureSetDto,
  PublicFixtureStandingDto,
  SportDto,
  TournamentCategoryDto,
  TournamentDetailDto,
  TournamentListItemDto,
  TournamentMediaDto,
  VenueDto
} from "./dto/discovery-response.dto";

export class DiscoveryTransform {
  toSport(sport: Sport): SportDto {
    return {
      id: sport.id,
      name: sport.name,
      slug: sport.slug,
      status: this.toApiEnum(sport.status)
    };
  }

  toCity(city: City): CityDto {
    return {
      id: city.id,
      name: city.name,
      slug: city.slug,
      country_code: city.countryCode,
      status: this.toApiEnum(city.status)
    };
  }

  toTournamentListItem(tournament: TournamentWithDiscoveryRelations): TournamentListItemDto {
    return {
      id: tournament.id,
      slug: tournament.slug,
      title: tournament.title,
      short_description: tournament.shortDescription,
      sport: this.toSport(tournament.sport),
      city: this.toCity(tournament.city),
      venue: tournament.venue ? this.toVenue(tournament.venue) : null,
      organizer: this.toOrganizer(tournament),
      starts_at: tournament.startsAt.toISOString(),
      ends_at: tournament.endsAt.toISOString(),
      registration_opens_at: tournament.registrationOpensAt?.toISOString() ?? null,
      registration_closes_at: tournament.registrationClosesAt?.toISOString() ?? null,
      registration_availability: this.getRegistrationAvailability(tournament),
      status: this.toApiEnum(tournament.status),
      categories: tournament.categories.map((category) => ({
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
      } satisfies TournamentCategoryDto)),
      media: tournament.media.map((media) => ({
        id: media.id,
        type: this.toApiEnum(media.type),
        url: media.url,
        alt_text: media.altText,
        sort_order: media.sortOrder
      } satisfies TournamentMediaDto))
    };
  }

  toTournamentDetail(tournament: TournamentWithDiscoveryRelations): TournamentDetailDto {
    return {
      ...this.toTournamentListItem(tournament),
      description: tournament.description,
      max_participants: tournament.maxParticipants,
      published_at: tournament.publishedAt?.toISOString() ?? null
    };
  }

  toPublicFixtureSet(fixtureSet: PublicFixtureSetWithRelations): PublicFixtureSetDto {
    const matches = fixtureSet.rounds.flatMap((round) => round.matches);
    return {
      id: fixtureSet.id,
      category: this.toCategory(fixtureSet.tournamentCategory),
      format: this.toApiEnum(fixtureSet.format),
      entrant_type: this.toApiEnum(fixtureSet.entrantType),
      status: this.toApiEnum(fixtureSet.status),
      name: fixtureSet.name,
      match_count: matches.length,
      completed_match_count: matches.filter((match) => match.status === MatchStatus.COMPLETED).length,
      published_at: fixtureSet.publishedAt?.toISOString() ?? null,
      rounds: fixtureSet.rounds.map((round) => ({
        round_number: round.roundNumber,
        name: round.name,
        stage: this.toApiEnum(round.stage),
        matches: round.matches.map((match) => this.toPublicFixtureMatch(match))
      } satisfies PublicFixtureRoundDto)),
      standings: this.toPublicStandings(fixtureSet)
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

  private toPublicFixtureMatch(match: PublicFixtureSetWithRelations["rounds"][number]["matches"][number]): PublicFixtureMatchDto {
    const entrants = match.entrants.map((entrant) => this.toPublicFixtureEntrant(entrant));
    const winner = entrants.find((entrant) => entrant.is_winner);
    return {
      id: match.id,
      match_number: match.matchNumber,
      round_position: match.roundPosition,
      status: this.toApiEnum(match.status),
      scheduled_at: match.scheduledAt?.toISOString() ?? null,
      venue_name: match.venueName,
      court_name: match.courtName,
      completed_at: match.completedAt?.toISOString() ?? null,
      winner_slot_number: winner?.slot_number ?? null,
      entrants
    };
  }

  private toPublicFixtureEntrant(
    entrant: PublicFixtureSetWithRelations["rounds"][number]["matches"][number]["entrants"][number]
  ): PublicFixtureEntrantDto {
    return {
      slot_number: entrant.slotNumber,
      is_bye: entrant.isBye,
      display_name: entrant.isBye
        ? "BYE"
        : entrant.participant?.displayName ?? entrant.team?.name ?? "Unassigned",
      seed: entrant.team?.seed ?? null,
      score: entrant.score?.score ?? null,
      is_winner: entrant.score?.isWinner ?? false
    };
  }

  private toCategory(category: PublicFixtureSetWithRelations["tournamentCategory"]): TournamentCategoryDto {
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

  private toPublicStandings(fixtureSet: PublicFixtureSetWithRelations): PublicFixtureStandingDto[] {
    if (fixtureSet.format !== FixtureFormat.ROUND_ROBIN) {
      return [];
    }

    const standings = new Map<string, Omit<PublicFixtureStandingDto, "rank">>();
    const getEntrantKey = (entrant: PublicFixtureSetWithRelations["rounds"][number]["matches"][number]["entrants"][number]) => {
      if (fixtureSet.entrantType === FixtureEntrantType.PARTICIPANT && entrant.participant) {
        return `participant:${entrant.participant.id}`;
      }
      if (fixtureSet.entrantType === FixtureEntrantType.TEAM && entrant.team) {
        return `team:${entrant.team.id}`;
      }
      return null;
    };
    const getDisplayName = (entrant: PublicFixtureSetWithRelations["rounds"][number]["matches"][number]["entrants"][number]) => {
      return entrant.participant?.displayName ?? entrant.team?.name ?? "Unassigned";
    };
    const ensureStanding = (entrant: PublicFixtureSetWithRelations["rounds"][number]["matches"][number]["entrants"][number]) => {
      const key = getEntrantKey(entrant);
      if (!key) {
        return null;
      }
      const existing = standings.get(key);
      if (existing) {
        return existing;
      }
      const standing: Omit<PublicFixtureStandingDto, "rank"> = {
        display_name: getDisplayName(entrant),
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        score_for: 0,
        score_against: 0,
        score_difference: 0
      };
      standings.set(key, standing);
      return standing;
    };

    const matches = fixtureSet.rounds.flatMap((round) => round.matches);
    for (const match of matches) {
      const realEntrants = match.entrants.filter((entrant) => !entrant.isBye);
      realEntrants.forEach((entrant) => ensureStanding(entrant));
      if (match.status !== MatchStatus.COMPLETED) {
        continue;
      }

      const scoredEntrants = realEntrants.filter((entrant) => entrant.score);
      if (scoredEntrants.length < 2) {
        continue;
      }

      const winnerSlotNumber = scoredEntrants.find((entrant) => entrant.score?.isWinner)?.slotNumber ?? null;
      for (const entrant of scoredEntrants) {
        const standing = ensureStanding(entrant);
        if (!standing || !entrant.score) {
          continue;
        }

        const opponentScore = scoredEntrants
          .filter((opponent) => opponent.slotNumber !== entrant.slotNumber)
          .reduce((total, opponent) => total + (opponent.score?.score ?? 0), 0);
        standing.played += 1;
        standing.score_for += entrant.score.score;
        standing.score_against += opponentScore;
        standing.score_difference = standing.score_for - standing.score_against;
        if (!winnerSlotNumber) {
          standing.draws += 1;
          standing.points += 1;
        } else if (winnerSlotNumber === entrant.slotNumber) {
          standing.wins += 1;
          standing.points += 3;
        } else {
          standing.losses += 1;
        }
      }
    }

    return Array.from(standings.values())
      .sort((first, second) => {
        if (second.points !== first.points) return second.points - first.points;
        if (second.wins !== first.wins) return second.wins - first.wins;
        if (second.score_difference !== first.score_difference) return second.score_difference - first.score_difference;
        if (second.score_for !== first.score_for) return second.score_for - first.score_for;
        return first.display_name.localeCompare(second.display_name);
      })
      .map((standing, index) => ({
        rank: index + 1,
        ...standing
      }));
  }

  private toOrganizer(tournament: TournamentWithDiscoveryRelations): OrganizerSummaryDto {
    return {
      id: tournament.organizerProfile.id,
      organization_name: tournament.organizerProfile.organizationName,
      slug: tournament.organizerProfile.slug,
      verification_status: this.toApiEnum(tournament.organizerProfile.verificationStatus)
    };
  }

  private getRegistrationAvailability(tournament: TournamentWithDiscoveryRelations): string {
    const now = new Date();
    const hasCapacity = tournament.categories.some((category) => category.capacity === null || category.capacity > 0);

    if (!hasCapacity || tournament.maxParticipants === 0) {
      return "registration_full";
    }

    if (tournament.registrationOpensAt && tournament.registrationOpensAt > now) {
      return "registration_not_open";
    }

    if (tournament.registrationClosesAt && tournament.registrationClosesAt < now) {
      return "registration_closed";
    }

    return "registration_open";
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
