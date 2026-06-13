import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaymentProvider } from "@prisma/client";

interface CreateMockIntentInput {
  amount: number;
  currency: string;
}

interface MockWebhookInput {
  paymentIntentId: string;
  signature?: string;
}

interface CreateRazorpayOrderInput {
  amount: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
}

@Injectable()
export class PaymentProviderService {
  constructor(private readonly config: ConfigService) {}

  getConfiguredProvider() {
    return this.config.get<string>("PAYMENT_PROVIDER", "manual").toLowerCase();
  }

  isMockProviderEnabled() {
    return this.getConfiguredProvider() === "mock";
  }

  isRazorpayProviderEnabled() {
    return this.getConfiguredProvider() === "razorpay";
  }

  isMockMutationAllowed() {
    return this.isMockProviderEnabled() && this.config.get<string>("NODE_ENV", "development") !== "production";
  }

  createMockIntent(input: CreateMockIntentInput) {
    const providerIntentId = `mock_pi_${randomUUID()}`;
    const providerAttemptId = `mock_attempt_${randomUUID()}`;
    const expiresAt = new Date(Date.now() + this.config.get<number>("PAYMENT_INTENT_EXPIRY_MINUTES", 30) * 60_000);
    const baseUrl = this.config.get<string>("PAYMENT_MOCK_CHECKOUT_BASE_URL", "").trim()
      || this.config.get<string>("FE_APP_URL", "http://localhost:3002");
    const checkoutUrl = `${baseUrl.replace(/\/$/, "")}/account/registrations?mock_payment_intent=${providerIntentId}`;

    return {
      provider: PaymentProvider.MOCK,
      providerIntentId,
      providerAttemptId,
      checkoutUrl,
      expiresAt,
      amount: input.amount,
      currency: input.currency
    };
  }

  verifyMockWebhook(input: MockWebhookInput) {
    const secret = this.config.get<string>("PAYMENT_WEBHOOK_SECRET", "").trim();
    if (!secret) {
      return null;
    }
    return input.signature === `mock:${input.paymentIntentId}:${secret}`;
  }

  async createRazorpayOrder(input: CreateRazorpayOrderInput) {
    const keyId = this.requireRazorpayConfig("RAZORPAY_KEY_ID");
    const keySecret = this.requireRazorpayConfig("RAZORPAY_KEY_SECRET");
    const amount = this.toRazorpayAmount(input.amount, input.currency);
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        amount,
        currency: input.currency,
        receipt: input.receipt,
        notes: input.notes
      })
    });

    const payload = await response.json().catch(() => ({})) as Partial<RazorpayOrderResponse> & {
      error?: { description?: string };
    };
    if (!response.ok || !payload.id) {
      throw new Error(payload.error?.description ?? "Unable to create Razorpay order");
    }

    return {
      provider: PaymentProvider.RAZORPAY,
      providerIntentId: payload.id,
      providerAttemptId: `razorpay_attempt_${randomUUID()}`,
      checkoutUrl: null,
      expiresAt: new Date(Date.now() + this.config.get<number>("PAYMENT_INTENT_EXPIRY_MINUTES", 30) * 60_000),
      amount: input.amount,
      providerAmount: payload.amount ?? amount,
      currency: payload.currency ?? input.currency
    };
  }

  async fetchRazorpayOrderStatus(providerIntentId: string) {
    const keyId = this.requireRazorpayConfig("RAZORPAY_KEY_ID");
    const keySecret = this.requireRazorpayConfig("RAZORPAY_KEY_SECRET");
    const response = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(providerIntentId)}`, {
      method: "GET",
      headers: {
        authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`
      }
    });
    const payload = await response.json().catch(() => ({})) as Partial<RazorpayOrderResponse> & {
      error?: { description?: string };
    };
    if (!response.ok || !payload.id) {
      throw new Error(payload.error?.description ?? "Unable to fetch Razorpay order status");
    }
    return {
      providerIntentId: payload.id,
      amount: payload.amount ?? null,
      currency: payload.currency ?? null,
      receipt: payload.receipt ?? null,
      status: payload.status ?? null
    };
  }

  verifyRazorpayCheckoutSignature(input: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const expected = this.hmac(`${input.razorpayOrderId}|${input.razorpayPaymentId}`, this.requireRazorpayConfig("RAZORPAY_KEY_SECRET"));
    return this.safeCompare(expected, input.razorpaySignature);
  }

  verifyRazorpayWebhook(input: { rawBody: Buffer; signature?: string }) {
    const signature = input.signature ?? "";
    const expected = this.hmac(input.rawBody, this.requireRazorpayConfig("RAZORPAY_WEBHOOK_SECRET"));
    return this.safeCompare(expected, signature);
  }

  getRazorpayCheckoutConfig() {
    return {
      keyId: this.requireRazorpayConfig("RAZORPAY_KEY_ID"),
      name: this.config.get<string>("RAZORPAY_CHECKOUT_NAME", "MatchFlow Arena"),
      description: this.config.get<string>("RAZORPAY_CHECKOUT_DESCRIPTION", "Tournament registration fee")
    };
  }

  toRazorpayAmount(amount: number, currency: string) {
    return currency.toUpperCase() === "INR" ? amount * 100 : amount;
  }

  private requireRazorpayConfig(name: string) {
    const value = this.config.get<string>(name, "");
    if (!value.trim()) {
      throw new Error(`${name} is required for Razorpay payments`);
    }
    return value;
  }

  private hmac(payload: string | Buffer, secret: string) {
    return createHmac("sha256", secret).update(payload).digest("hex");
  }

  private safeCompare(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
  }
}
