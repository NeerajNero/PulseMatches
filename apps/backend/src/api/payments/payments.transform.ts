import { Injectable } from "@nestjs/common";
import { PaymentProvider } from "@prisma/client";
import { PaymentIntentWithRelations, PaymentRegistrationWithRelations } from "../../db/payments/payments.repository";
import { PaymentProviderService } from "../../payments/payment-provider.service";
import { PaymentIntentSummaryDto, RegistrationPaymentDetailDto } from "./dto/payment.dto";

@Injectable()
export class PaymentsTransform {
  constructor(private readonly provider: PaymentProviderService) {}

  toIntent(intent: PaymentIntentWithRelations): PaymentIntentSummaryDto {
    const checkout = intent.provider === PaymentProvider.RAZORPAY
      ? this.provider.getRazorpayCheckoutConfig()
      : null;

    return {
      id: intent.id,
      provider: this.toApiEnum(intent.provider),
      mode: this.toApiEnum(intent.mode),
      status: this.toApiEnum(intent.status),
      amount: intent.amount,
      checkout_amount: intent.provider === PaymentProvider.RAZORPAY
        ? this.provider.toRazorpayAmount(intent.amount, intent.currency)
        : intent.amount,
      currency: intent.currency,
      provider_intent_id: intent.providerIntentId,
      checkout_url: intent.providerCheckoutUrl,
      checkout_key_id: checkout?.keyId ?? null,
      checkout_order_id: intent.provider === PaymentProvider.RAZORPAY ? intent.providerIntentId : null,
      checkout_name: checkout?.name ?? null,
      checkout_description: checkout?.description ?? null,
      prefill_name: intent.registration.user.displayName,
      prefill_email: intent.registration.user.email,
      expires_at: intent.expiresAt?.toISOString() ?? null,
      event_count: intent._count?.events ?? intent.events.length,
      attempt_count: intent._count?.attempts ?? intent.attempts.length,
      created_at: intent.createdAt.toISOString(),
      updated_at: intent.updatedAt.toISOString()
    };
  }

  toPaymentDetail(input: {
    registration: PaymentRegistrationWithRelations;
    latestIntent?: PaymentIntentWithRelations | null;
    onlinePaymentAvailable: boolean;
  }): RegistrationPaymentDetailDto {
    const paymentRecord = input.registration.paymentRecord;
    const amount = paymentRecord?.amount ?? input.registration.feeAmount;
    const status = paymentRecord?.status ?? input.registration.paymentStatus;
    const refunds = paymentRecord?.paymentRefunds ?? [];
    const refundedAmount = refunds
      .filter((refund) => refund.status === "MANUAL_RECORDED" || refund.status === "SUCCEEDED")
      .reduce((total, refund) => total + refund.amount, 0);

    return {
      registration_id: input.registration.id,
      mode: this.toApiEnum(paymentRecord?.mode ?? input.registration.paymentMode),
      status: this.toApiEnum(status),
      amount,
      currency: paymentRecord?.currency ?? input.registration.feeCurrency,
      paid_at: paymentRecord?.paidAt?.toISOString() ?? null,
      reference: paymentRecord?.reference ?? null,
      offline_instructions: amount > 0
        ? "Offline payment remains available with the organizer. Online mock payment is only a provider-readiness path."
        : null,
      online_payment_available: input.onlinePaymentAvailable,
      latest_intent: input.latestIntent ? this.toIntent(input.latestIntent) : null,
      refund_count: refunds.length,
      refunded_amount: refundedAmount,
      latest_refund_status: refunds[0] ? this.toApiEnum(refunds[0].status) : null,
      latest_refund_processed_at: refunds[0]?.processedAt?.toISOString() ?? null
    };
  }

  private toApiEnum(value: string): string {
    return value.toLowerCase();
  }
}
