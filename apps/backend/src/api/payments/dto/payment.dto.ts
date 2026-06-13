import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";

export class PaymentIntentSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: "mock" })
  provider!: string;

  @ApiProperty({ example: "online" })
  mode!: string;

  @ApiProperty({ example: "requires_action" })
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiPropertyOptional({ type: Number, nullable: true })
  checkout_amount!: number | null;

  @ApiProperty({ example: "INR" })
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  provider_intent_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  checkout_url!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  checkout_key_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  checkout_order_id!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  checkout_name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  checkout_description!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  prefill_name!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  prefill_email!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  expires_at!: string | null;

  @ApiProperty()
  event_count!: number;

  @ApiProperty()
  attempt_count!: number;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-06-08T04:30:00.000Z" })
  updated_at!: string;
}

export class RegistrationPaymentDetailDto {
  @ApiProperty()
  registration_id!: string;

  @ApiProperty({ example: "online_provider" })
  mode!: string;

  @ApiProperty({ example: "pending_offline" })
  status!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({ example: "INR" })
  currency!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  paid_at!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reference!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  offline_instructions!: string | null;

  @ApiProperty()
  online_payment_available!: boolean;

  @ApiPropertyOptional({ type: PaymentIntentSummaryDto, nullable: true })
  latest_intent!: PaymentIntentSummaryDto | null;

  @ApiProperty()
  refund_count!: number;

  @ApiProperty()
  refunded_amount!: number;

  @ApiPropertyOptional({ type: String, nullable: true, example: "manual_recorded" })
  latest_refund_status!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: "2026-06-08T04:30:00.000Z" })
  latest_refund_processed_at!: string | null;
}

export class MockCompletePaymentRequestDto {
  @ApiProperty()
  @IsUUID()
  payment_intent_id!: string;
}

export class VerifyRazorpayPaymentRequestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(160)
  razorpay_order_id!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  razorpay_payment_id!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(256)
  razorpay_signature!: string;
}

export class MockWebhookPaymentRequestDto {
  @ApiProperty()
  @IsUUID()
  payment_intent_id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  signature?: string;
}

export class PaymentIntentApiResponseDto extends ApiResponseDto<PaymentIntentSummaryDto> {
  @ApiProperty({ type: PaymentIntentSummaryDto })
  declare data: PaymentIntentSummaryDto;
}

export class RegistrationPaymentDetailApiResponseDto extends ApiResponseDto<RegistrationPaymentDetailDto> {
  @ApiProperty({ type: RegistrationPaymentDetailDto })
  declare data: RegistrationPaymentDetailDto;
}
