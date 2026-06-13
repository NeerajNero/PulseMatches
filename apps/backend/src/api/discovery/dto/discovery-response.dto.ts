import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";

export class SportDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ example: "active" })
  status!: string;
}

export class CityDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ example: "IN" })
  country_code!: string;

  @ApiProperty({ example: "active" })
  status!: string;
}

export class VenueDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  address!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  latitude!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  longitude!: string | null;
}

export class OrganizerSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  organization_name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  verification_status!: string;
}

export class TournamentCategoryDto {
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

  @ApiPropertyOptional({ type: Number, nullable: true })
  min_age!: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  max_age!: number | null;

  @ApiProperty()
  entry_fee_amount!: number;

  @ApiProperty({ example: "INR" })
  entry_fee_currency!: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  capacity!: number | null;

  @ApiProperty({ example: "active" })
  status!: string;
}

export class TournamentMediaDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "image" })
  type!: string;

  @ApiProperty()
  url!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  alt_text!: string | null;

  @ApiProperty()
  sort_order!: number;
}

export class TournamentListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  short_description!: string | null;

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

  @ApiPropertyOptional({ type: String, nullable: true })
  registration_opens_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  registration_closes_at!: string | null;

  @ApiProperty({ example: "registration_open" })
  registration_availability!: string;

  @ApiProperty({ example: "published" })
  status!: string;

  @ApiProperty({ type: [TournamentCategoryDto] })
  @Type(() => TournamentCategoryDto)
  categories!: TournamentCategoryDto[];

  @ApiProperty({ type: [TournamentMediaDto] })
  @Type(() => TournamentMediaDto)
  media!: TournamentMediaDto[];
}

export class TournamentDetailDto extends TournamentListItemDto {
  @ApiPropertyOptional({ type: String, nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  max_participants!: number | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  published_at!: string | null;
}

export class PublicFixtureEntrantDto {
  @ApiProperty()
  slot_number!: number;

  @ApiProperty()
  is_bye!: boolean;

  @ApiProperty()
  display_name!: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  seed!: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  score!: number | null;

  @ApiProperty()
  is_winner!: boolean;
}

export class PublicFixtureMatchDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  match_number!: number;

  @ApiProperty()
  round_position!: number;

  @ApiProperty({ example: "scheduled" })
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  scheduled_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  venue_name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  court_name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  completed_at!: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  winner_slot_number!: number | null;

  @ApiProperty({ type: [PublicFixtureEntrantDto] })
  @Type(() => PublicFixtureEntrantDto)
  entrants!: PublicFixtureEntrantDto[];
}

export class PublicFixtureRoundDto {
  @ApiProperty()
  round_number!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: "final" })
  stage!: string;

  @ApiProperty({ type: [PublicFixtureMatchDto] })
  @Type(() => PublicFixtureMatchDto)
  matches!: PublicFixtureMatchDto[];
}

export class PublicFixtureStandingDto {
  @ApiProperty()
  rank!: number;

  @ApiProperty()
  display_name!: string;

  @ApiProperty()
  played!: number;

  @ApiProperty()
  wins!: number;

  @ApiProperty()
  draws!: number;

  @ApiProperty()
  losses!: number;

  @ApiProperty()
  points!: number;

  @ApiProperty()
  score_for!: number;

  @ApiProperty()
  score_against!: number;

  @ApiProperty()
  score_difference!: number;
}

export class PublicFixtureSetDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: TournamentCategoryDto })
  @Type(() => TournamentCategoryDto)
  category!: TournamentCategoryDto;

  @ApiProperty({ example: "knockout" })
  format!: string;

  @ApiProperty({ example: "team" })
  entrant_type!: string;

  @ApiProperty({ example: "scheduled" })
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  name!: string | null;

  @ApiProperty()
  match_count!: number;

  @ApiProperty()
  completed_match_count!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  published_at!: string | null;

  @ApiProperty({ type: [PublicFixtureRoundDto] })
  @Type(() => PublicFixtureRoundDto)
  rounds!: PublicFixtureRoundDto[];

  @ApiProperty({ type: [PublicFixtureStandingDto] })
  @Type(() => PublicFixtureStandingDto)
  standings!: PublicFixtureStandingDto[];
}

export class PaginationDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  total_pages!: number;

  @ApiProperty()
  has_next!: boolean;
}

export class TournamentListResponseDto {
  @ApiProperty({ type: [TournamentListItemDto] })
  @Type(() => TournamentListItemDto)
  items!: TournamentListItemDto[];

  @ApiProperty({ type: PaginationDto })
  @Type(() => PaginationDto)
  pagination!: PaginationDto;
}

export class SportsApiResponseDto extends ApiResponseDto<SportDto[]> {
  @ApiProperty({ type: [SportDto] })
  declare data: SportDto[];
}

export class CitiesApiResponseDto extends ApiResponseDto<CityDto[]> {
  @ApiProperty({ type: [CityDto] })
  declare data: CityDto[];
}

export class TournamentListApiResponseDto extends ApiResponseDto<TournamentListResponseDto> {
  @ApiProperty({ type: TournamentListResponseDto })
  declare data: TournamentListResponseDto;
}

export class TournamentDetailApiResponseDto extends ApiResponseDto<TournamentDetailDto> {
  @ApiProperty({ type: TournamentDetailDto })
  declare data: TournamentDetailDto;
}

export class PublicFixtureSetListApiResponseDto extends ApiResponseDto<PublicFixtureSetDto[]> {
  @ApiProperty({ type: [PublicFixtureSetDto] })
  declare data: PublicFixtureSetDto[];
}
