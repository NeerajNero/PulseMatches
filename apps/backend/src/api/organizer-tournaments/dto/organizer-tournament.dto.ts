import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  GenderType,
  ParticipantType,
  TournamentCategoryStatus,
  TournamentFormatType
} from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min
} from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";
import {
  CityDto,
  SportDto,
  TournamentCategoryDto,
  VenueDto
} from "../../discovery/dto/discovery-response.dto";

export class OrganizerTournamentListQueryDto {
  @ApiPropertyOptional({ enum: ["draft", "published", "archived", "blocked"] })
  @IsOptional()
  @IsIn(["draft", "published", "archived", "blocked"])
  status?: string;

  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsString()
  sport?: string;

  @ApiPropertyOptional({ example: "summer cup" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 50, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}

export class CreateOrganizerTournamentRequestDto {
  @ApiProperty({ example: "Weekend Shuttle Cup" })
  @IsString()
  @Length(3, 220)
  title!: string;

  @ApiPropertyOptional({ type: String, example: "A local weekend tournament.", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  short_description?: string;

  @ApiPropertyOptional({ type: String, example: "Tournament rules and participation notes.", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiProperty({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsUUID()
  sport_id!: string;

  @ApiProperty({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsUUID()
  city_id!: string;

  @ApiPropertyOptional({ type: String, example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308", nullable: true })
  @IsOptional()
  @IsUUID()
  venue_id?: string;

  @ApiProperty({ example: "2026-07-10T04:30:00.000Z" })
  @IsDateString()
  starts_at!: string;

  @ApiProperty({ example: "2026-07-11T04:30:00.000Z" })
  @IsDateString()
  ends_at!: string;

  @ApiPropertyOptional({ type: String, example: "2026-06-10T04:30:00.000Z", nullable: true })
  @IsOptional()
  @IsDateString()
  registration_opens_at?: string;

  @ApiPropertyOptional({ type: String, example: "2026-07-05T04:30:00.000Z", nullable: true })
  @IsOptional()
  @IsDateString()
  registration_closes_at?: string;

  @ApiPropertyOptional({ type: Number, minimum: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  max_participants?: number;
}

export class UpdateOrganizerTournamentRequestDto {
  @ApiPropertyOptional({ example: "Weekend Shuttle Cup" })
  @IsOptional()
  @IsString()
  @Length(3, 220)
  title?: string;

  @ApiPropertyOptional({ type: String, example: "A local weekend tournament.", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  short_description?: string | null;

  @ApiPropertyOptional({ type: String, example: "Tournament rules and participation notes.", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string | null;

  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  sport_id?: string;

  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  city_id?: string;

  @ApiPropertyOptional({ type: String, example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308", nullable: true })
  @IsOptional()
  @IsUUID()
  venue_id?: string | null;

  @ApiPropertyOptional({ example: "2026-07-10T04:30:00.000Z" })
  @IsOptional()
  @IsDateString()
  starts_at?: string;

  @ApiPropertyOptional({ example: "2026-07-11T04:30:00.000Z" })
  @IsOptional()
  @IsDateString()
  ends_at?: string;

  @ApiPropertyOptional({ type: String, example: "2026-06-10T04:30:00.000Z", nullable: true })
  @IsOptional()
  @IsDateString()
  registration_opens_at?: string | null;

  @ApiPropertyOptional({ type: String, example: "2026-07-05T04:30:00.000Z", nullable: true })
  @IsOptional()
  @IsDateString()
  registration_closes_at?: string | null;

  @ApiPropertyOptional({ type: Number, minimum: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  max_participants?: number | null;
}

export class CreateTournamentCategoryRequestDto {
  @ApiProperty({ example: "Open Singles" })
  @IsString()
  @Length(2, 160)
  name!: string;

  @ApiPropertyOptional({ example: "open-singles" })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  code?: string;

  @ApiProperty({ enum: TournamentFormatType, example: TournamentFormatType.KNOCKOUT })
  @IsEnum(TournamentFormatType)
  format_type!: TournamentFormatType;

  @ApiProperty({ enum: ParticipantType, example: ParticipantType.SINGLES })
  @IsEnum(ParticipantType)
  participant_type!: ParticipantType;

  @ApiPropertyOptional({ enum: GenderType, example: GenderType.OPEN })
  @IsOptional()
  @IsEnum(GenderType)
  gender_type?: GenderType;

  @ApiPropertyOptional({ type: Number, minimum: 0, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_age?: number;

  @ApiPropertyOptional({ type: Number, minimum: 0, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_age?: number;

  @ApiPropertyOptional({ minimum: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  entry_fee_amount?: number;

  @ApiPropertyOptional({ example: "INR", default: "INR" })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  entry_fee_currency?: string;

  @ApiPropertyOptional({ type: Number, minimum: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;
}

export class UpdateTournamentCategoryRequestDto {
  @ApiPropertyOptional({ example: "Open Singles" })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  name?: string;

  @ApiPropertyOptional({ example: "open-singles" })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  code?: string;

  @ApiPropertyOptional({ enum: TournamentFormatType, example: TournamentFormatType.KNOCKOUT })
  @IsOptional()
  @IsEnum(TournamentFormatType)
  format_type?: TournamentFormatType;

  @ApiPropertyOptional({ enum: ParticipantType, example: ParticipantType.SINGLES })
  @IsOptional()
  @IsEnum(ParticipantType)
  participant_type?: ParticipantType;

  @ApiPropertyOptional({ enum: GenderType, example: GenderType.OPEN })
  @IsOptional()
  @IsEnum(GenderType)
  gender_type?: GenderType;

  @ApiPropertyOptional({ type: Number, minimum: 0, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_age?: number | null;

  @ApiPropertyOptional({ type: Number, minimum: 0, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  max_age?: number | null;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  entry_fee_amount?: number;

  @ApiPropertyOptional({ example: "INR" })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  entry_fee_currency?: string;

  @ApiPropertyOptional({ type: Number, minimum: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number | null;

  @ApiPropertyOptional({ enum: TournamentCategoryStatus, example: TournamentCategoryStatus.ACTIVE })
  @IsOptional()
  @IsEnum(TournamentCategoryStatus)
  status?: TournamentCategoryStatus;
}

export class OrganizerTournamentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  short_description!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  description!: string | null;

  @ApiProperty({ type: SportDto })
  @Type(() => SportDto)
  sport!: SportDto;

  @ApiProperty({ type: CityDto })
  @Type(() => CityDto)
  city!: CityDto;

  @ApiPropertyOptional({ type: VenueDto, nullable: true })
  @Type(() => VenueDto)
  venue!: VenueDto | null;

  @ApiProperty({ example: "2026-07-10T04:30:00.000Z" })
  starts_at!: string;

  @ApiProperty({ example: "2026-07-11T04:30:00.000Z" })
  ends_at!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  registration_opens_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  registration_closes_at!: string | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  max_participants!: number | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  published_at!: string | null;

  @ApiProperty({ example: "draft" })
  status!: string;

  @ApiProperty({ example: "public" })
  visibility!: string;

  @ApiProperty()
  registration_count!: number;

  @ApiProperty()
  pending_registration_count!: number;

  @ApiProperty({ type: [TournamentCategoryDto] })
  @Type(() => TournamentCategoryDto)
  categories!: TournamentCategoryDto[];

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerTournamentListResponseDto {
  @ApiProperty({ type: [OrganizerTournamentDto] })
  @Type(() => OrganizerTournamentDto)
  items!: OrganizerTournamentDto[];

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

export class OrganizerDashboardDto {
  @ApiProperty()
  total_tournaments!: number;

  @ApiProperty()
  draft_tournaments!: number;

  @ApiProperty()
  published_tournaments!: number;

  @ApiProperty()
  upcoming_tournaments!: number;

  @ApiProperty()
  total_registrations!: number;

  @ApiProperty()
  pending_registrations!: number;

  @ApiProperty({ type: [OrganizerTournamentDto] })
  @Type(() => OrganizerTournamentDto)
  recent_tournaments!: OrganizerTournamentDto[];
}

export class OrganizerDashboardApiResponseDto extends ApiResponseDto<OrganizerDashboardDto> {
  @ApiProperty({ type: OrganizerDashboardDto })
  declare data: OrganizerDashboardDto;
}

export class OrganizerTournamentApiResponseDto extends ApiResponseDto<OrganizerTournamentDto> {
  @ApiProperty({ type: OrganizerTournamentDto })
  declare data: OrganizerTournamentDto;
}

export class OrganizerTournamentListApiResponseDto extends ApiResponseDto<OrganizerTournamentListResponseDto> {
  @ApiProperty({ type: OrganizerTournamentListResponseDto })
  declare data: OrganizerTournamentListResponseDto;
}

export class OrganizerTournamentCategoryApiResponseDto extends ApiResponseDto<TournamentCategoryDto> {
  @ApiProperty({ type: TournamentCategoryDto })
  declare data: TournamentCategoryDto;
}

export class OrganizerTournamentCategoryListApiResponseDto extends ApiResponseDto<TournamentCategoryDto[]> {
  @ApiProperty({ type: [TournamentCategoryDto] })
  declare data: TournamentCategoryDto[];
}
