import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { City, Sport, TournamentCategory, Venue } from "@prisma/client";
import { RegistrationWithRelations } from "../../db/registrations/registrations.repository";
import { CityDto, OrganizerSummaryDto, SportDto, VenueDto } from "../discovery/dto/discovery-response.dto";
import {
  RegistrationCategorySummaryDto,
  RegistrationDto,
  RegistrationTournamentSummaryDto
} from "./dto/registration.dto";

@Injectable()
export class RegistrationsTransform {
  constructor(private readonly config: ConfigService) {}

  toRegistration(registration: RegistrationWithRelations): RegistrationDto {
    const latestIntent = registration.paymentIntents[0] ?? null;
    const paymentAmount = registration.paymentRecord?.amount ?? registration.feeAmount;
    const paymentStatus = registration.paymentRecord?.status ?? registration.paymentStatus;
    const refunds = registration.paymentRecord?.paymentRefunds ?? [];
    const refundedAmount = refunds
      .filter((refund) => refund.status === "MANUAL_RECORDED" || refund.status === "SUCCEEDED")
      .reduce((total, refund) => total + refund.amount, 0);

    return {
      id: registration.id,
      status: this.toApiEnum(registration.status),
      payment_mode: this.toApiEnum(registration.paymentMode),
      payment_status: this.toApiEnum(registration.paymentStatus),
      fee_amount: registration.feeAmount,
      fee_currency: registration.feeCurrency,
      payment: {
        mode: this.toApiEnum(registration.paymentRecord?.mode ?? registration.paymentMode),
        status: this.toApiEnum(paymentStatus),
        amount: paymentAmount,
        currency: registration.paymentRecord?.currency ?? registration.feeCurrency,
        offline_instructions: paymentAmount > 0
          ? "Offline payment is tracked by the organizer. Contact the organizer or pay at the venue as instructed."
          : null,
        paid_at: registration.paymentRecord?.paidAt?.toISOString() ?? null,
        online_payment_available: this.isOnlinePaymentAvailable(registration),
        provider: latestIntent ? this.toApiEnum(latestIntent.provider) : this.toApiEnum(registration.paymentRecord?.provider ?? "MANUAL"),
        latest_intent_status: latestIntent ? this.toApiEnum(latestIntent.status) : null,
        latest_intent_id: latestIntent?.id ?? null,
        checkout_url: latestIntent?.providerCheckoutUrl ?? null,
        event_count: latestIntent?._count.events ?? 0,
        refund_count: refunds.length,
        refunded_amount: refundedAmount,
        latest_refund_status: refunds[0] ? this.toApiEnum(refunds[0].status) : null,
        latest_refund_processed_at: refunds[0]?.processedAt?.toISOString() ?? null
      },
      player_name: registration.playerName,
      phone: registration.phone,
      notes: registration.notes,
      registered_at: registration.registeredAt.toISOString(),
      cancelled_at: registration.cancelledAt?.toISOString() ?? null,
      created_at: registration.createdAt.toISOString(),
      updated_at: registration.updatedAt.toISOString(),
      tournament: this.toTournament(registration),
      category: registration.tournamentCategory ? this.toCategory(registration.tournamentCategory) : null
    };
  }

  private toTournament(registration: RegistrationWithRelations): RegistrationTournamentSummaryDto {
    return {
      id: registration.tournament.id,
      slug: registration.tournament.slug,
      title: registration.tournament.title,
      sport: this.toSport(registration.tournament.sport),
      city: this.toCity(registration.tournament.city),
      venue: registration.tournament.venue ? this.toVenue(registration.tournament.venue) : null,
      organizer: this.toOrganizer(registration),
      starts_at: registration.tournament.startsAt.toISOString(),
      ends_at: registration.tournament.endsAt.toISOString()
    };
  }

  private toCategory(category: TournamentCategory): RegistrationCategorySummaryDto {
    return {
      id: category.id,
      name: category.name,
      code: category.code,
      format_type: this.toApiEnum(category.formatType),
      participant_type: this.toApiEnum(category.participantType),
      gender_type: this.toApiEnum(category.genderType),
      entry_fee_amount: category.entryFeeAmount,
      entry_fee_currency: category.entryFeeCurrency
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

  private toOrganizer(registration: RegistrationWithRelations): OrganizerSummaryDto {
    return {
      id: registration.tournament.organizerProfile.id,
      organization_name: registration.tournament.organizerProfile.organizationName,
      slug: registration.tournament.organizerProfile.slug,
      verification_status: this.toApiEnum(registration.tournament.organizerProfile.verificationStatus)
    };
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }

  private isOnlinePaymentAvailable(registration: RegistrationWithRelations) {
    const paymentAmount = registration.paymentRecord?.amount ?? registration.feeAmount;
    const paymentStatus = registration.paymentRecord?.status ?? registration.paymentStatus;
    const configuredProvider = this.config.get<string>("PAYMENT_PROVIDER", "manual");
    return ["mock", "razorpay"].includes(configuredProvider)
      && paymentAmount > 0
      && !["NOT_REQUIRED", "PAID", "WAIVED"].includes(paymentStatus)
      && !["CANCELLED", "REJECTED"].includes(registration.status);
  }
}
