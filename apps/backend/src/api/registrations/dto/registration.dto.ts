import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsUUID, Length, MaxLength } from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";
import { CityDto, OrganizerSummaryDto, SportDto, VenueDto } from "../../discovery/dto/discovery-response.dto";

export class CreateRegistrationRequestDto {
  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  tournament_category_id?: string;

  @ApiPropertyOptional({ example: "Aarav Sharma" })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  player_name?: string;

  @ApiPropertyOptional({ example: "+919999999999" })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  phone?: string;

  @ApiPropertyOptional({ example: "Available after 6 PM on weekdays." })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class RegistrationTournamentSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ type: SportDto })
  @Type(() => SportDto)
  sport!: SportDto;

  @ApiProperty({ type: CityDto })
  @Type(() => CityDto)
  city!: CityDto;

  @ApiPropertyOptional({ type: VenueDto, nullable: true })
  @Type(() => VenueDto)
  venue!: VenueDto | null;

  @ApiProperty({ type: OrganizerSummaryDto })
  @Type(() => OrganizerSummaryDto)
  organizer!: OrganizerSummaryDto;

  @ApiProperty({ example: "2026-06-10T04:30:00.000Z" })
  starts_at!: string;

  @ApiProperty({ example: "2026-06-11T04:30:00.000Z" })
  ends_at!: string;
}

export class RegistrationCategorySummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty({ example: "knockout" })
  format_type!: string;

  @ApiProperty({ example: "singles" })
  participant_type!: string;

  @ApiProperty({ example: "open" })
  gender_type!: string;

  @ApiProperty()
  entry_fee_amount!: number;

  @ApiProperty({ example: "INR" })
  entry_fee_currency!: string;
}

export class RegistrationPaymentSummaryDto {
  @ApiProperty({ example: "offline" })
  mode!: string;

  @ApiProperty({ example: "pending_offline" })
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ example: "INR" })
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: "Offline payment can be completed with the organizer at the venue." })
  offline_instructions!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "2026-06-08T04:30:00.000Z" })
  paid_at!: string | null;

  @ApiProperty()
  online_payment_available!: boolean;

  @ApiPropertyOptional({ type: String, nullable: true, example: "mock" })
  provider!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "requires_action" })
  latest_intent_status!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  latest_intent_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  checkout_url!: string | null;

  @ApiProperty()
  event_count!: number;

  @ApiProperty()
  refund_count!: number;

  @ApiProperty()
  refunded_amount!: number;

  @ApiPropertyOptional({ type: String, nullable: true, example: "manual_recorded" })
  latest_refund_status!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "2026-06-08T04:30:00.000Z" })
  latest_refund_processed_at!: string | null;
}

export class RegistrationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "pending" })
  status!: string;

  @ApiProperty({ example: "offline" })
  payment_mode!: string;

  @ApiProperty({ example: "pending_offline" })
  payment_status!: string;

  @ApiProperty()
  fee_amount!: number;

  @ApiProperty({ example: "INR" })
  fee_currency!: string;

  @ApiProperty({ type: RegistrationPaymentSummaryDto })
  @Type(() => RegistrationPaymentSummaryDto)
  payment!: RegistrationPaymentSummaryDto;

  @ApiProperty()
  player_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  notes!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  registered_at!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  cancelled_at!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;

  @ApiProperty({ type: RegistrationTournamentSummaryDto })
  @Type(() => RegistrationTournamentSummaryDto)
  tournament!: RegistrationTournamentSummaryDto;

  @ApiPropertyOptional({ type: RegistrationCategorySummaryDto, nullable: true })
  @Type(() => RegistrationCategorySummaryDto)
  category!: RegistrationCategorySummaryDto | null;
}

export class RegistrationApiResponseDto extends ApiResponseDto<RegistrationDto> {
  @ApiProperty({ type: RegistrationDto })
  declare data: RegistrationDto;
}

export class RegistrationListApiResponseDto extends ApiResponseDto<RegistrationDto[]> {
  @ApiProperty({ type: [RegistrationDto] })
  declare data: RegistrationDto[];
}
