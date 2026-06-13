import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";

const ROLE_VALUES = ["PLAYER", "ORGANIZER", "ADMIN"] as const;
const ORGANIZER_VERIFICATION_STATUS_VALUES = ["pending", "verified", "rejected"] as const;
const TOURNAMENT_STATUS_VALUES = ["draft", "published", "archived", "blocked"] as const;
const REGISTRATION_STATUS_VALUES = ["pending", "confirmed", "rejected", "cancelled"] as const;
const PAYMENT_STATUS_VALUES = ["not_required", "pending_offline", "paid", "failed", "refunded", "waived"] as const;
const PAYMENT_PROVIDER_VALUES = ["manual", "mock", "razorpay", "future_provider"] as const;
const NOTIFICATION_STATUS_VALUES = ["pending", "processing", "sent", "failed", "skipped"] as const;
const NOTIFICATION_CHANNEL_VALUES = ["email"] as const;
const RECONCILIATION_STATUS_VALUES = ["started", "completed", "failed"] as const;

export class AdminPaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: "search text" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}

export class AdminUsersQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional({ enum: ROLE_VALUES })
  @IsOptional()
  @IsIn(ROLE_VALUES)
  role?: string;
}

export class AdminOrganizersQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional({ enum: ORGANIZER_VERIFICATION_STATUS_VALUES })
  @IsOptional()
  @IsIn(ORGANIZER_VERIFICATION_STATUS_VALUES)
  verification_status?: string;
}

export class AdminTournamentsQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional({ enum: TOURNAMENT_STATUS_VALUES })
  @IsOptional()
  @IsIn(TOURNAMENT_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  organizer_id?: string;
}

export class AdminRegistrationsQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional({ enum: REGISTRATION_STATUS_VALUES })
  @IsOptional()
  @IsIn(REGISTRATION_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({ enum: PAYMENT_STATUS_VALUES })
  @IsOptional()
  @IsIn(PAYMENT_STATUS_VALUES)
  payment_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tournament_id?: string;
}

export class AdminPaymentsQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional({ enum: PAYMENT_PROVIDER_VALUES })
  @IsOptional()
  @IsIn(PAYMENT_PROVIDER_VALUES)
  provider?: string;

  @ApiPropertyOptional({ enum: PAYMENT_STATUS_VALUES })
  @IsOptional()
  @IsIn(PAYMENT_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tournament_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  registration_id?: string;
}

export class AdminNotificationsQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  type?: string;

  @ApiPropertyOptional({ enum: NOTIFICATION_STATUS_VALUES })
  @IsOptional()
  @IsIn(NOTIFICATION_STATUS_VALUES)
  status?: string;

  @ApiPropertyOptional({ enum: NOTIFICATION_CHANNEL_VALUES })
  @IsOptional()
  @IsIn(NOTIFICATION_CHANNEL_VALUES)
  channel?: string;
}

export class AdminReconciliationRunsQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional({ enum: PAYMENT_PROVIDER_VALUES })
  @IsOptional()
  @IsIn(PAYMENT_PROVIDER_VALUES)
  provider?: string;

  @ApiPropertyOptional({ enum: RECONCILIATION_STATUS_VALUES })
  @IsOptional()
  @IsIn(RECONCILIATION_STATUS_VALUES)
  status?: string;
}

export class AdminAuditEventsQueryDto extends AdminPaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  entity_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  action?: string;
}

export class RejectOrganizerVerificationRequestDto {
  @ApiPropertyOptional({ example: "Business details could not be verified." })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class SkipNotificationRequestDto {
  @ApiPropertyOptional({ example: "Recipient requested no further delivery attempts." })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class AdminPaginationDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  total_pages!: number;
}

export class AdminUserSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  display_name!: string;
}

export class AdminUserOrganizerSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  organization_name!: string;

  @ApiProperty()
  verification_status!: string;

  @ApiProperty()
  status!: string;
}

export class AdminListDto<TItem> {
  @ApiProperty({ type: [Object] })
  items!: TItem[];

  @ApiProperty({ type: AdminPaginationDto })
  pagination!: AdminPaginationDto;
}

export class AdminDashboardDto {
  @ApiProperty()
  total_users!: number;

  @ApiProperty()
  total_organizers!: number;

  @ApiProperty()
  total_tournaments!: number;

  @ApiProperty()
  published_tournaments!: number;

  @ApiProperty()
  draft_tournaments!: number;

  @ApiProperty()
  total_registrations!: number;

  @ApiProperty()
  pending_registrations!: number;

  @ApiProperty()
  paid_payments!: number;

  @ApiProperty()
  pending_payments!: number;

  @ApiProperty()
  failed_payments!: number;

  @ApiProperty()
  refund_count!: number;

  @ApiProperty()
  pending_notifications!: number;

  @ApiProperty()
  failed_notifications!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  recent_reconciliation_status!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  recent_reconciliation_provider!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  recent_reconciliation_started_at!: string | null;
}

export class AdminUserDto extends AdminUserSummaryDto {
  @ApiProperty({ type: [String] })
  roles!: string[];

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ type: AdminUserOrganizerSummaryDto, nullable: true })
  organizer!: AdminUserOrganizerSummaryDto | null;

  @ApiProperty()
  registration_count!: number;

  @ApiProperty()
  created_at!: string;
}

export class AdminOrganizerDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  organization_name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  verification_status!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ type: AdminUserSummaryDto })
  user!: AdminUserSummaryDto;

  @ApiProperty()
  tournament_count!: number;

  @ApiProperty()
  created_at!: string;
}

export class AdminOrganizerTournamentSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  registration_count!: number;

  @ApiProperty()
  created_at!: string;
}

export class AdminOrganizerDetailDto extends AdminOrganizerDto {
  @ApiProperty({ type: [AdminOrganizerTournamentSummaryDto] })
  tournaments!: AdminOrganizerTournamentSummaryDto[];

  @ApiProperty({ type: () => [AdminAuditEventDto] })
  audit_events!: AdminAuditEventDto[];
}

export class AdminTournamentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  visibility!: string;

  @ApiProperty()
  sport!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty({ type: AdminOrganizerDto })
  organizer!: Pick<AdminOrganizerDto, "id" | "organization_name" | "verification_status" | "user">;

  @ApiProperty()
  registration_count!: number;

  @ApiProperty()
  created_at!: string;
}

export class AdminRegistrationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: AdminUserSummaryDto })
  player!: AdminUserSummaryDto;

  @ApiProperty()
  player_name!: string;

  @ApiProperty()
  tournament_id!: string;

  @ApiProperty()
  tournament_title!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  category_name!: string | null;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  payment_status!: string;

  @ApiProperty()
  created_at!: string;
}

export class AdminPaymentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  registration_id!: string;

  @ApiProperty()
  tournament_id!: string;

  @ApiProperty()
  tournament_title!: string;

  @ApiProperty({ type: AdminUserSummaryDto })
  player!: AdminUserSummaryDto;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  mode!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  paid_at!: string | null;

  @ApiProperty()
  refund_count!: number;

  @ApiProperty()
  refunded_amount!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  latest_intent_status!: string | null;

  @ApiProperty()
  event_count!: number;

  @ApiProperty()
  updated_at!: string;
}

export class AdminPaymentAttemptDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_attempt_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  error_code!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  error_message!: string | null;

  @ApiProperty()
  created_at!: string;
}

export class AdminPaymentEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  event_type!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_event_id!: string | null;

  @ApiPropertyOptional({ type: Boolean, nullable: true })
  signature_valid!: boolean | null;

  @ApiProperty({ type: Object })
  payload_summary!: Record<string, unknown>;

  @ApiProperty()
  created_at!: string;
}

export class AdminPaymentIntentDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  mode!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_intent_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  expires_at!: string | null;

  @ApiProperty({ type: [AdminPaymentAttemptDto] })
  attempts!: AdminPaymentAttemptDto[];

  @ApiProperty({ type: [AdminPaymentEventDto] })
  events!: AdminPaymentEventDto[];

  @ApiProperty()
  created_at!: string;
}

export class AdminPaymentRefundDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  reason!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_refund_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  processed_at!: string | null;

  @ApiProperty()
  created_at!: string;
}

export class AdminPaymentDetailDto extends AdminPaymentDto {
  @ApiPropertyOptional({ type: String, nullable: true })
  reference!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  category_name!: string | null;

  @ApiProperty({ type: [AdminPaymentIntentDto] })
  intents!: AdminPaymentIntentDto[];

  @ApiProperty({ type: [AdminPaymentEventDto] })
  events!: AdminPaymentEventDto[];

  @ApiProperty({ type: [AdminPaymentRefundDto] })
  refunds!: AdminPaymentRefundDto[];
}

export class AdminNotificationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  channel!: string;

  @ApiProperty()
  status!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  recipient_email!: string | null;

  @ApiProperty()
  attempts!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  last_error!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  processed_at!: string | null;

  @ApiProperty()
  created_at!: string;
}

export class AdminReconciliationRunDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  provider!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  checked_count!: number;

  @ApiProperty()
  updated_count!: number;

  @ApiProperty()
  failed_count!: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  error!: string | null;

  @ApiProperty()
  started_at!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  completed_at!: string | null;
}

export class AdminAuditEventDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ type: AdminUserSummaryDto, nullable: true })
  actor!: AdminUserSummaryDto | null;

  @ApiProperty()
  entity_type!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  entity_id!: string | null;

  @ApiProperty()
  action!: string;

  @ApiProperty({ type: Object })
  metadata_summary!: Record<string, unknown>;

  @ApiProperty()
  created_at!: string;
}

export class AdminDashboardApiResponseDto extends ApiResponseDto<AdminDashboardDto> {
  @ApiProperty({ type: AdminDashboardDto })
  declare data: AdminDashboardDto;
}

export class AdminUserListDto extends AdminListDto<AdminUserDto> {
  @ApiProperty({ type: [AdminUserDto] })
  declare items: AdminUserDto[];
}

export class AdminOrganizerListDto extends AdminListDto<AdminOrganizerDto> {
  @ApiProperty({ type: [AdminOrganizerDto] })
  declare items: AdminOrganizerDto[];
}

export class AdminTournamentListDto extends AdminListDto<AdminTournamentDto> {
  @ApiProperty({ type: [AdminTournamentDto] })
  declare items: AdminTournamentDto[];
}

export class AdminRegistrationListDto extends AdminListDto<AdminRegistrationDto> {
  @ApiProperty({ type: [AdminRegistrationDto] })
  declare items: AdminRegistrationDto[];
}

export class AdminPaymentListDto extends AdminListDto<AdminPaymentDto> {
  @ApiProperty({ type: [AdminPaymentDto] })
  declare items: AdminPaymentDto[];
}

export class AdminNotificationListDto extends AdminListDto<AdminNotificationDto> {
  @ApiProperty({ type: [AdminNotificationDto] })
  declare items: AdminNotificationDto[];
}

export class AdminReconciliationRunListDto extends AdminListDto<AdminReconciliationRunDto> {
  @ApiProperty({ type: [AdminReconciliationRunDto] })
  declare items: AdminReconciliationRunDto[];
}

export class AdminAuditEventListDto extends AdminListDto<AdminAuditEventDto> {
  @ApiProperty({ type: [AdminAuditEventDto] })
  declare items: AdminAuditEventDto[];
}

export class AdminUsersApiResponseDto extends ApiResponseDto<AdminUserListDto> {
  @ApiProperty({ type: AdminUserListDto })
  declare data: AdminUserListDto;
}

export class AdminOrganizersApiResponseDto extends ApiResponseDto<AdminOrganizerListDto> {
  @ApiProperty({ type: AdminOrganizerListDto })
  declare data: AdminOrganizerListDto;
}

export class AdminOrganizerApiResponseDto extends ApiResponseDto<AdminOrganizerDto> {
  @ApiProperty({ type: AdminOrganizerDto })
  declare data: AdminOrganizerDto;
}

export class AdminOrganizerDetailApiResponseDto extends ApiResponseDto<AdminOrganizerDetailDto> {
  @ApiProperty({ type: AdminOrganizerDetailDto })
  declare data: AdminOrganizerDetailDto;
}

export class AdminTournamentsApiResponseDto extends ApiResponseDto<AdminTournamentListDto> {
  @ApiProperty({ type: AdminTournamentListDto })
  declare data: AdminTournamentListDto;
}

export class AdminRegistrationsApiResponseDto extends ApiResponseDto<AdminRegistrationListDto> {
  @ApiProperty({ type: AdminRegistrationListDto })
  declare data: AdminRegistrationListDto;
}

export class AdminPaymentsApiResponseDto extends ApiResponseDto<AdminPaymentListDto> {
  @ApiProperty({ type: AdminPaymentListDto })
  declare data: AdminPaymentListDto;
}

export class AdminPaymentDetailApiResponseDto extends ApiResponseDto<AdminPaymentDetailDto> {
  @ApiProperty({ type: AdminPaymentDetailDto })
  declare data: AdminPaymentDetailDto;
}

export class AdminNotificationsApiResponseDto extends ApiResponseDto<AdminNotificationListDto> {
  @ApiProperty({ type: AdminNotificationListDto })
  declare data: AdminNotificationListDto;
}

export class AdminNotificationApiResponseDto extends ApiResponseDto<AdminNotificationDto> {
  @ApiProperty({ type: AdminNotificationDto })
  declare data: AdminNotificationDto;
}

export class AdminReconciliationRunsApiResponseDto extends ApiResponseDto<AdminReconciliationRunListDto> {
  @ApiProperty({ type: AdminReconciliationRunListDto })
  declare data: AdminReconciliationRunListDto;
}

export class AdminAuditEventsApiResponseDto extends ApiResponseDto<AdminAuditEventListDto> {
  @ApiProperty({ type: AdminAuditEventListDto })
  declare data: AdminAuditEventListDto;
}
