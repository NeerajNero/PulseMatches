import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ParticipantSource,
  PaymentRefundStatus,
  RegistrationPaymentMode,
  RegistrationPaymentStatus,
  RegistrationStatus,
  RosterParticipantStatus,
  TeamMemberRole,
  TeamStatus
} from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateIf
} from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";
import { RegistrationCategorySummaryDto } from "../../registrations/dto/registration.dto";

const REGISTRATION_STATUS_VALUES = ["pending", "confirmed", "rejected", "cancelled"] as const;
const PAYMENT_STATUS_VALUES = ["not_required", "pending_offline", "paid", "failed", "refunded", "waived"] as const;
const MANUAL_PAYMENT_UPDATE_STATUS_VALUES = ["pending_offline", "paid", "failed", "refunded", "waived"] as const;
const REFUND_STATUS_VALUES = ["requested", "manual_recorded"] as const;
const PARTICIPANT_STATUS_VALUES = ["active", "withdrawn", "disqualified"] as const;
const TEAM_STATUS_VALUES = ["active", "withdrawn", "disqualified"] as const;

export class OrganizerRosterListQueryDto {
  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @ApiPropertyOptional({ example: "aarav" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}

export class OrganizerReportDateRangeQueryDto {
  @ApiPropertyOptional({ example: "2026-06-01" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  from?: string;

  @ApiPropertyOptional({ example: "2026-06-30" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  to?: string;
}

export class OrganizerRegistrationListQueryDto extends OrganizerRosterListQueryDto {
  @ApiPropertyOptional({ enum: REGISTRATION_STATUS_VALUES })
  @IsOptional()
  @IsIn(REGISTRATION_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({ example: "2026-06-01" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  from?: string;

  @ApiPropertyOptional({ example: "2026-06-30" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  to?: string;
}

export class OrganizerPaymentListQueryDto extends OrganizerRosterListQueryDto {
  @ApiPropertyOptional({ enum: PAYMENT_STATUS_VALUES })
  @IsOptional()
  @IsIn(PAYMENT_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({ example: "2026-06-01" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  from?: string;

  @ApiPropertyOptional({ example: "2026-06-30" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  to?: string;
}

export class OrganizerParticipantListQueryDto extends OrganizerRosterListQueryDto {
  @ApiPropertyOptional({ enum: PARTICIPANT_STATUS_VALUES })
  @IsOptional()
  @IsIn(PARTICIPANT_STATUS_VALUES)
  status?: string;
}

export class OrganizerTeamListQueryDto extends OrganizerRosterListQueryDto {
  @ApiPropertyOptional({ enum: TEAM_STATUS_VALUES })
  @IsOptional()
  @IsIn(TEAM_STATUS_VALUES)
  status?: string;
}

export class RejectRegistrationRequestDto {
  @ApiPropertyOptional({ example: "Offline payment was not completed." })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class UpdateRegistrationPaymentRequestDto {
  @ApiProperty({ enum: MANUAL_PAYMENT_UPDATE_STATUS_VALUES, example: "paid" })
  @IsIn(MANUAL_PAYMENT_UPDATE_STATUS_VALUES)
  status!: string;

  @ApiPropertyOptional({ example: "Cash receipt #A102" })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  reference?: string;

  @ApiPropertyOptional({ example: "Verified at the registration desk." })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  internal_notes?: string;

  @ApiPropertyOptional({ example: "2026-06-08T04:30:00.000Z" })
  @IsOptional()
  @IsISO8601()
  paid_at?: string;
}

export class CreatePaymentRefundRequestDto {
  @ApiProperty({ minimum: 1, example: 750 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount!: number;

  @ApiPropertyOptional({ enum: REFUND_STATUS_VALUES, default: "manual_recorded" })
  @IsOptional()
  @IsIn(REFUND_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({ example: "Player withdrew before brackets were created." })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ example: "Cash returned at registration desk." })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  internal_notes?: string;
}

export class CreateParticipantRequestDto {
  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  tournament_category_id?: string;

  @ApiProperty({ example: "Aarav Sharma" })
  @IsString()
  @Length(2, 160)
  display_name!: string;

  @ApiPropertyOptional({ example: "aarav@example.com" })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: "+919999999999" })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  phone?: string;
}

export class UpdateParticipantRequestDto {
  @ApiPropertyOptional({ type: String, example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308", nullable: true })
  @IsOptional()
  @IsUUID()
  tournament_category_id?: string | null;

  @ApiPropertyOptional({ example: "Aarav Sharma" })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  display_name?: string;

  @ApiPropertyOptional({ type: String, example: "aarav@example.com", nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string | null;

  @ApiPropertyOptional({ type: String, example: "+919999999999", nullable: true })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  phone?: string | null;

  @ApiPropertyOptional({ enum: RosterParticipantStatus })
  @IsOptional()
  @IsEnum(RosterParticipantStatus)
  status?: RosterParticipantStatus;
}

export class CreateTeamRequestDto {
  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  tournament_category_id?: string;

  @ApiProperty({ example: "Court Kings" })
  @IsString()
  @Length(2, 180)
  name!: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 999 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  seed?: number;
}

export class UpdateTeamRequestDto {
  @ApiPropertyOptional({ type: String, example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308", nullable: true })
  @IsOptional()
  @IsUUID()
  tournament_category_id?: string | null;

  @ApiPropertyOptional({ example: "Court Kings" })
  @IsOptional()
  @IsString()
  @Length(2, 180)
  name?: string;

  @ApiPropertyOptional({ enum: TeamStatus })
  @IsOptional()
  @IsEnum(TeamStatus)
  status?: TeamStatus;

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 999, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  seed?: number | null;
}

export class CreateTeamMemberRequestDto {
  @ApiPropertyOptional({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  @IsOptional()
  @IsUUID()
  participant_id?: string;

  @ApiPropertyOptional({ example: "Aarav Sharma" })
  @ValidateIf((value: CreateTeamMemberRequestDto) => !value.participant_id)
  @IsString()
  @Length(2, 160)
  display_name?: string;

  @ApiPropertyOptional({ example: "aarav@example.com" })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string;

  @ApiPropertyOptional({ example: "+919999999999" })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  phone?: string;

  @ApiPropertyOptional({ enum: TeamMemberRole, default: TeamMemberRole.PLAYER })
  @IsOptional()
  @IsEnum(TeamMemberRole)
  role?: TeamMemberRole;
}

export class UpdateTeamMemberRequestDto {
  @ApiPropertyOptional({ example: "Aarav Sharma" })
  @IsOptional()
  @IsString()
  @Length(2, 160)
  display_name?: string;

  @ApiPropertyOptional({ type: String, example: "aarav@example.com", nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(320)
  email?: string | null;

  @ApiPropertyOptional({ type: String, example: "+919999999999", nullable: true })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  phone?: string | null;

  @ApiPropertyOptional({ enum: TeamMemberRole })
  @IsOptional()
  @IsEnum(TeamMemberRole)
  role?: TeamMemberRole;
}

export class OrganizerRosterUserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  display_name!: string;
}

export class OrganizerRegistrationDto {
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

  @ApiProperty()
  fee_currency!: string;

  @ApiProperty()
  player_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  notes!: string | null;

  @ApiProperty({ type: OrganizerRosterUserSummaryDto })
  @Type(() => OrganizerRosterUserSummaryDto)
  user!: OrganizerRosterUserSummaryDto;

  @ApiPropertyOptional({ type: RegistrationCategorySummaryDto, nullable: true })
  @Type(() => RegistrationCategorySummaryDto)
  category!: RegistrationCategorySummaryDto | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  participant_id!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  registered_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerPaymentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  registration_id!: string;

  @ApiProperty({ type: OrganizerRosterUserSummaryDto })
  @Type(() => OrganizerRosterUserSummaryDto)
  user!: OrganizerRosterUserSummaryDto;

  @ApiPropertyOptional({ type: RegistrationCategorySummaryDto, nullable: true })
  @Type(() => RegistrationCategorySummaryDto)
  category!: RegistrationCategorySummaryDto | null;

  @ApiProperty({ example: "pending" })
  registration_status!: string;

  @ApiProperty({ example: "offline" })
  payment_mode!: string;

  @ApiProperty({ example: "pending_offline" })
  payment_status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ example: "INR" })
  currency!: string;

  @ApiProperty()
  player_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  player_email!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reference!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  internal_notes!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  paid_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "mock" })
  payment_provider!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "requires_action" })
  latest_intent_status!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "mock" })
  latest_intent_provider!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  latest_intent_reference!: string | null;

  @ApiProperty()
  latest_intent_event_count!: number;

  @ApiProperty()
  refund_count!: number;

  @ApiProperty()
  refunded_amount!: number;

  @ApiPropertyOptional({ type: String, nullable: true, example: "manual_recorded" })
  latest_refund_status!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerPaymentAttemptDiagnosticDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "razorpay" })
  provider!: string;

  @ApiProperty({ example: "redirected" })
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_attempt_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  error_code!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  error_message!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerPaymentEventDiagnosticDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "razorpay" })
  provider!: string;

  @ApiProperty({ example: "razorpay.payment.captured" })
  event_type!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_event_id!: string | null;

  @ApiPropertyOptional({ type: Boolean, nullable: true })
  signature_valid!: boolean | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  processed_at!: string | null;

  @ApiProperty({ type: Object })
  payload_summary!: Record<string, unknown>;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;
}

export class OrganizerPaymentRefundDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "manual" })
  provider!: string;

  @ApiProperty({ example: "manual_recorded" })
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ example: "INR" })
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  reason!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  internal_notes!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_refund_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  processed_at!: string | null;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerPaymentIntentDiagnosticDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "razorpay" })
  provider!: string;

  @ApiProperty({ example: "online" })
  mode!: string;

  @ApiProperty({ example: "requires_action" })
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ example: "INR" })
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_intent_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  expires_at!: string | null;

  @ApiProperty()
  event_count!: number;

  @ApiProperty()
  attempt_count!: number;

  @ApiProperty({ type: [OrganizerPaymentAttemptDiagnosticDto] })
  @Type(() => OrganizerPaymentAttemptDiagnosticDto)
  attempts!: OrganizerPaymentAttemptDiagnosticDto[];

  @ApiProperty({ type: [OrganizerPaymentEventDiagnosticDto] })
  @Type(() => OrganizerPaymentEventDiagnosticDto)
  events!: OrganizerPaymentEventDiagnosticDto[];

  @ApiProperty({ type: [OrganizerPaymentRefundDto] })
  @Type(() => OrganizerPaymentRefundDto)
  refunds!: OrganizerPaymentRefundDto[];

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerPaymentDetailDto extends OrganizerPaymentDto {
  @ApiProperty({ type: [OrganizerPaymentIntentDiagnosticDto] })
  @Type(() => OrganizerPaymentIntentDiagnosticDto)
  intents!: OrganizerPaymentIntentDiagnosticDto[];

  @ApiProperty({ type: [OrganizerPaymentEventDiagnosticDto] })
  @Type(() => OrganizerPaymentEventDiagnosticDto)
  events!: OrganizerPaymentEventDiagnosticDto[];

  @ApiProperty({ type: [OrganizerPaymentRefundDto] })
  @Type(() => OrganizerPaymentRefundDto)
  refunds!: OrganizerPaymentRefundDto[];
}

export class OrganizerParticipantDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tournament_id!: string;

  @ApiPropertyOptional({ type: RegistrationCategorySummaryDto, nullable: true })
  @Type(() => RegistrationCategorySummaryDto)
  category!: RegistrationCategorySummaryDto | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  registration_id!: string | null;

  @ApiPropertyOptional({ type: OrganizerRosterUserSummaryDto, nullable: true })
  @Type(() => OrganizerRosterUserSummaryDto)
  user!: OrganizerRosterUserSummaryDto | null;

  @ApiProperty()
  display_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone!: string | null;

  @ApiProperty({ example: "manual" })
  source!: string;

  @ApiProperty({ example: "active" })
  status!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerTeamMemberDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  team_id!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  participant_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  user_id!: string | null;

  @ApiProperty()
  display_name!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone!: string | null;

  @ApiProperty({ example: "player" })
  role!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerTeamDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tournament_id!: string;

  @ApiPropertyOptional({ type: RegistrationCategorySummaryDto, nullable: true })
  @Type(() => RegistrationCategorySummaryDto)
  category!: RegistrationCategorySummaryDto | null;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: "active" })
  status!: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  seed!: number | null;

  @ApiProperty()
  member_count!: number;

  @ApiProperty({ type: [OrganizerTeamMemberDto] })
  @Type(() => OrganizerTeamMemberDto)
  members!: OrganizerTeamMemberDto[];

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class OrganizerRosterSummaryDto {
  @ApiProperty()
  registrations_total!: number;

  @ApiProperty()
  registrations_pending!: number;

  @ApiProperty()
  participants_active!: number;

  @ApiProperty()
  teams_active!: number;
}

export class OrganizerReportCountDto {
  @ApiProperty()
  status!: string;

  @ApiProperty()
  count!: number;
}

export class OrganizerTournamentReportSummaryDto {
  @ApiProperty({ type: [OrganizerReportCountDto] })
  registrations_by_status!: OrganizerReportCountDto[];

  @ApiProperty({ type: [OrganizerReportCountDto] })
  payments_by_status!: OrganizerReportCountDto[];

  @ApiProperty()
  total_collected_amount!: number;

  @ApiProperty()
  total_refunded_amount!: number;

  @ApiProperty()
  participant_count!: number;

  @ApiProperty()
  team_count!: number;

  @ApiProperty()
  fixture_count!: number;

  @ApiProperty()
  completed_match_count!: number;

  @ApiProperty()
  pending_notification_count!: number;
}

export class OrganizerRegistrationListApiResponseDto extends ApiResponseDto<OrganizerRegistrationDto[]> {
  @ApiProperty({ type: [OrganizerRegistrationDto] })
  declare data: OrganizerRegistrationDto[];
}

export class OrganizerRegistrationApiResponseDto extends ApiResponseDto<OrganizerRegistrationDto> {
  @ApiProperty({ type: OrganizerRegistrationDto })
  declare data: OrganizerRegistrationDto;
}

export class OrganizerPaymentListApiResponseDto extends ApiResponseDto<OrganizerPaymentDto[]> {
  @ApiProperty({ type: [OrganizerPaymentDto] })
  declare data: OrganizerPaymentDto[];
}

export class OrganizerPaymentApiResponseDto extends ApiResponseDto<OrganizerPaymentDto> {
  @ApiProperty({ type: OrganizerPaymentDto })
  declare data: OrganizerPaymentDto;
}

export class OrganizerPaymentDetailApiResponseDto extends ApiResponseDto<OrganizerPaymentDetailDto> {
  @ApiProperty({ type: OrganizerPaymentDetailDto })
  declare data: OrganizerPaymentDetailDto;
}

export class OrganizerParticipantListApiResponseDto extends ApiResponseDto<OrganizerParticipantDto[]> {
  @ApiProperty({ type: [OrganizerParticipantDto] })
  declare data: OrganizerParticipantDto[];
}

export class OrganizerParticipantApiResponseDto extends ApiResponseDto<OrganizerParticipantDto> {
  @ApiProperty({ type: OrganizerParticipantDto })
  declare data: OrganizerParticipantDto;
}

export class OrganizerTeamListApiResponseDto extends ApiResponseDto<OrganizerTeamDto[]> {
  @ApiProperty({ type: [OrganizerTeamDto] })
  declare data: OrganizerTeamDto[];
}

export class OrganizerTeamApiResponseDto extends ApiResponseDto<OrganizerTeamDto> {
  @ApiProperty({ type: OrganizerTeamDto })
  declare data: OrganizerTeamDto;
}

export class OrganizerTeamMemberApiResponseDto extends ApiResponseDto<OrganizerTeamMemberDto> {
  @ApiProperty({ type: OrganizerTeamMemberDto })
  declare data: OrganizerTeamMemberDto;
}

export class OrganizerRosterSummaryApiResponseDto extends ApiResponseDto<OrganizerRosterSummaryDto> {
  @ApiProperty({ type: OrganizerRosterSummaryDto })
  declare data: OrganizerRosterSummaryDto;
}

export class OrganizerTournamentReportSummaryApiResponseDto extends ApiResponseDto<OrganizerTournamentReportSummaryDto> {
  @ApiProperty({ type: OrganizerTournamentReportSummaryDto })
  declare data: OrganizerTournamentReportSummaryDto;
}

export const ORGANIZER_ROSTER_ENUMS = {
  ParticipantSource,
  PaymentRefundStatus,
  RegistrationPaymentMode,
  RegistrationPaymentStatus,
  RegistrationStatus,
  RosterParticipantStatus,
  TeamMemberRole,
  TeamStatus
};
