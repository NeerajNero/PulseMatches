import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  FixtureEntrantType,
  FixtureFormat,
  FixtureSetStatus,
  MatchStatus
} from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
  ValidateNested
} from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";
import { RegistrationCategorySummaryDto } from "../../registrations/dto/registration.dto";

export class GenerateFixtureSetRequestDto {
  @ApiProperty({ enum: FixtureFormat, example: FixtureFormat.KNOCKOUT })
  @IsEnum(FixtureFormat)
  format!: FixtureFormat;

  @ApiProperty({ enum: FixtureEntrantType, example: FixtureEntrantType.PARTICIPANT })
  @IsEnum(FixtureEntrantType)
  entrant_type!: FixtureEntrantType;

  @ApiPropertyOptional({ example: "Main draw" })
  @IsOptional()
  @IsString()
  @Length(2, 180)
  name?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  replace_existing?: boolean;
}

export class UpdateMatchScheduleRequestDto {
  @ApiPropertyOptional({ type: String, example: "2026-06-12T09:30:00.000Z", nullable: true })
  @IsOptional()
  @IsDateString()
  scheduled_at?: string | null;

  @ApiPropertyOptional({ type: String, example: "Kanteerava Indoor Stadium", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  venue_name?: string | null;

  @ApiPropertyOptional({ type: String, example: "Court 2", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  court_name?: string | null;

  @ApiPropertyOptional({ type: String, example: "Open warmup 10 minutes before start.", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string | null;

  @ApiPropertyOptional({ enum: MatchStatus })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;
}

export class MatchScoreInputDto {
  @ApiProperty({ example: "f2da9642-a695-4d96-8f98-71a0f668c9b1" })
  @IsUUID()
  match_entrant_id!: string;

  @ApiProperty({ example: 21, minimum: 0 })
  @IsInt()
  @Min(0)
  score!: number;
}

export class UpdateMatchScoreRequestDto {
  @ApiProperty({ type: [MatchScoreInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchScoreInputDto)
  scores!: MatchScoreInputDto[];

  @ApiPropertyOptional({ type: String, example: "f2da9642-a695-4d96-8f98-71a0f668c9b1", nullable: true })
  @IsOptional()
  @IsUUID()
  winner_match_entrant_id?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  allow_draw?: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  result_notes?: string | null;
}

export class CompleteMatchRequestDto extends UpdateMatchScoreRequestDto {}

export class FixtureEntrantDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slot_number!: number;

  @ApiProperty()
  is_bye!: boolean;

  @ApiPropertyOptional({ type: String, nullable: true })
  participant_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  team_id!: string | null;

  @ApiProperty()
  display_name!: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  seed!: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  score!: number | null;

  @ApiProperty()
  is_winner!: boolean;
}

export class FixtureMatchDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  match_number!: number;

  @ApiProperty()
  round_position!: number;

  @ApiProperty({ example: "unscheduled" })
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  scheduled_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  venue_name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  court_name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  notes!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  completed_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  winner_match_entrant_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  result_notes!: string | null;

  @ApiProperty({ type: [FixtureEntrantDto] })
  @Type(() => FixtureEntrantDto)
  entrants!: FixtureEntrantDto[];

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class FixtureRoundDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  round_number!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: "final" })
  stage!: string;

  @ApiProperty({ type: [FixtureMatchDto] })
  @Type(() => FixtureMatchDto)
  matches!: FixtureMatchDto[];

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class RoundRobinStandingDto {
  @ApiProperty()
  entrant_id!: string;

  @ApiProperty({ example: "participant" })
  entrant_type!: string;

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

export class FixtureSetDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tournament_id!: string;

  @ApiProperty({ type: RegistrationCategorySummaryDto })
  @Type(() => RegistrationCategorySummaryDto)
  category!: RegistrationCategorySummaryDto;

  @ApiProperty({ example: "knockout" })
  format!: string;

  @ApiProperty({ example: "participant" })
  entrant_type!: string;

  @ApiProperty({ example: "generated" })
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  name!: string | null;

  @ApiProperty()
  match_count!: number;

  @ApiProperty()
  scheduled_match_count!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  generated_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  published_at!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class FixtureSetDetailDto extends FixtureSetDto {
  @ApiProperty({ type: [FixtureRoundDto] })
  @Type(() => FixtureRoundDto)
  rounds!: FixtureRoundDto[];

  @ApiProperty({ type: [RoundRobinStandingDto] })
  @Type(() => RoundRobinStandingDto)
  standings!: RoundRobinStandingDto[];
}

export class FixtureSetListApiResponseDto extends ApiResponseDto<FixtureSetDto[]> {
  @ApiProperty({ type: [FixtureSetDto] })
  declare data: FixtureSetDto[];
}

export class FixtureSetApiResponseDto extends ApiResponseDto<FixtureSetDetailDto> {
  @ApiProperty({ type: FixtureSetDetailDto })
  declare data: FixtureSetDetailDto;
}

export class FixtureMatchApiResponseDto extends ApiResponseDto<FixtureMatchDto> {
  @ApiProperty({ type: FixtureMatchDto })
  declare data: FixtureMatchDto;
}

export const ORGANIZER_FIXTURE_ENUMS = {
  FixtureEntrantType,
  FixtureFormat,
  FixtureSetStatus,
  MatchStatus
};
