"use client";

import type { PaymentIntentSummaryDto, RegistrationDto } from "@matchflow/client-sdk";
import { useState } from "react";
import {
  formatDate,
  formatDateRange,
  formatLabel,
  getStatusTone
} from "@/components/custom/tournaments/tournament-format";
import {
  getApiErrorMessage,
  useCancelRegistration,
  useCreatePaymentIntent,
  useMockCompletePayment,
  useVerifyRazorpayPayment
} from "@/hooks/use-registrations";
import { tournamentDetailRoute } from "@/utils/route";

interface RazorpayCheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

export function RegistrationList({ registrations }: Readonly<{ registrations: RegistrationDto[] }>) {
  const cancelRegistration = useCancelRegistration();
  const createPaymentIntent = useCreatePaymentIntent();
  const mockCompletePayment = useMockCompletePayment();
  const verifyRazorpayPayment = useVerifyRazorpayPayment();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onCancel(id: string) {
    setError(null);
    setMessage(null);
    try {
      await cancelRegistration.mutateAsync(id);
    } catch (cancelError) {
      setError(await getApiErrorMessage(cancelError, "Unable to cancel registration."));
    }
  }

  async function onStartPayment(registration: RegistrationDto) {
    setError(null);
    setMessage(null);
    try {
      const intent = await createPaymentIntent.mutateAsync(registration.id);
      if (intent?.provider === "razorpay") {
        await openRazorpayCheckout(registration, intent);
        return;
      }
      setMessage(intent?.checkoutUrl
        ? "Mock payment intent created. Use the checkout link or simulate completion in this development flow."
        : "Payment intent created.");
    } catch (paymentError) {
      setError(await getApiErrorMessage(paymentError, "Unable to start payment."));
    }
  }

  async function onMockComplete(paymentIntentId: string) {
    setError(null);
    setMessage(null);
    try {
      await mockCompletePayment.mutateAsync(paymentIntentId);
      setMessage("Mock provider marked the payment as paid.");
    } catch (paymentError) {
      setError(await getApiErrorMessage(paymentError, "Unable to complete mock payment."));
    }
  }

  async function openRazorpayCheckout(registration: RegistrationDto, intent: PaymentIntentSummaryDto) {
    if (!intent.checkoutKeyId || !intent.checkoutOrderId || !intent.checkoutAmount) {
      throw new Error("Razorpay checkout data is incomplete.");
    }

    await loadRazorpayScript();
    if (!window.Razorpay) {
      throw new Error("Razorpay Checkout did not load.");
    }

    const checkout = new window.Razorpay({
      key: intent.checkoutKeyId,
      amount: intent.checkoutAmount,
      currency: intent.currency,
      name: intent.checkoutName ?? "MatchFlow Arena",
      description: intent.checkoutDescription ?? registration.tournament.title,
      order_id: intent.checkoutOrderId,
      prefill: {
        name: intent.prefillName ?? registration.playerName,
        email: intent.prefillEmail ?? undefined
      },
      handler: (response) => {
        void verifyRazorpayPayment.mutateAsync({
          registrationId: registration.id,
          payload: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          }
        }).then(() => {
          setMessage("Razorpay payment verified and marked as paid.");
        }).catch(async (verifyError) => {
          setError(await getApiErrorMessage(verifyError, "Unable to verify Razorpay payment."));
        });
      },
      modal: {
        ondismiss: () => {
          setMessage("Razorpay checkout was closed before payment was completed.");
        }
      }
    });

    checkout.open();
  }

  if (registrations.length === 0) {
    return (
      <section className="empty-state account-empty-state">
        <h2>No registrations yet</h2>
        <p>Browse tournaments and submit a player registration when entries are open.</p>
        <a className="primary-action" href="/tournaments">Browse tournaments</a>
      </section>
    );
  }

  return (
    <section className="registration-list" aria-label="My tournament registrations">
      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="form-success">{message}</p> : null}
      {registrations.map((registration) => (
        <article className="registration-list-item" key={registration.id}>
          <div>
            <div className="status-pill-row registration-badges" style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
              <span className={`status-pill ${getStatusTone(registration.status)}`}>{formatLabel(registration.status)}</span>
              <span className={`status-pill ${getStatusTone(registration.paymentStatus)}`}>{formatLabel(registration.paymentStatus)}</span>
            </div>
            <span className="eyebrow">{registration.tournament.sport.name}</span>
            <h2 style={{ marginBottom: '4px' }}>{registration.tournament.title}</h2>
            <p style={{ fontSize: '15px' }}>
              <strong>{registration.category?.name ?? "Tournament registration"}</strong> ·{" "}
              {registration.tournament.city.name} ·{" "}
              {formatDateRange(registration.tournament.startsAt, registration.tournament.endsAt)}
            </p>
          </div>
          
          <dl className="registration-status-grid">
            <div><dt>Status</dt><dd>{formatLabel(registration.status)}</dd></div>
            <div><dt>Payment</dt><dd>{formatPaymentSummary(registration)}</dd></div>
            <div><dt>Registered</dt><dd>{formatDate(registration.createdAt)}</dd></div>
          </dl>

          <div className="registration-actions" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <a className="secondary-action" href={tournamentDetailRoute(registration.tournament.slug)}>
              View tournament
            </a>
            <a className="secondary-action" href={`${tournamentDetailRoute(registration.tournament.slug)}#fixtures-results`}>
              Results & fixtures
            </a>
            {registration.payment?.onlinePaymentAvailable ? (
              <button
                className="primary-action"
                type="button"
                disabled={createPaymentIntent.isPending || verifyRazorpayPayment.isPending}
                onClick={() => void onStartPayment(registration)}
              >
                {createPaymentIntent.isPending || verifyRazorpayPayment.isPending ? "Starting..." : "Start payment"}
              </button>
            ) : null}
            {registration.payment?.checkoutUrl ? (
              <a className="primary-action" href={registration.payment.checkoutUrl}>
                Complete payment
              </a>
            ) : null}
            {registration.payment?.provider === "mock" && registration.payment.latestIntentStatus === "requires_action" ? (
              <button
                className="primary-action"
                type="button"
                disabled={mockCompletePayment.isPending || !registration.payment.latestIntentId}
                onClick={() => void onMockComplete(registration.payment?.latestIntentId ?? "")}
              >
                {mockCompletePayment.isPending ? "Completing..." : "Simulate payment"}
              </button>
            ) : null}
            {registration.status === "pending" ? (
              <button
                className="secondary-action"
                type="button"
                style={{ borderColor: '#f87171', color: '#dc2626' }}
                disabled={cancelRegistration.isPending}
                onClick={() => void onCancel(registration.id)}
              >
                {cancelRegistration.isPending ? "Cancelling..." : "Cancel entry"}
              </button>
            ) : null}
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
            {registration.payment?.offlineInstructions ? (
              <p className="state-text compact-state" style={{ marginBottom: '8px' }}>
                <strong>Offline Instructions:</strong> {registration.payment.offlineInstructions}
                {registration.payment.paidAt ? ` (Paid ${formatDate(registration.payment.paidAt)})` : ""}
              </p>
            ) : null}
            {registration.payment?.latestIntentStatus && registration.payment.latestIntentStatus !== 'succeeded' ? (
              <p className="state-text compact-state">
                Online payment {formatLabel(registration.payment.latestIntentStatus)}
                {registration.payment.provider ? ` via ${formatLabel(registration.payment.provider)}` : ""}.
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </section>
  );
}

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay Checkout can only run in a browser."));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-razorpay-checkout]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Razorpay Checkout.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

function formatPaymentSummary(registration: RegistrationDto) {
  const payment = registration.payment;
  const amount = payment?.amount ?? registration.feeAmount;
  const currency = payment?.currency ?? registration.feeCurrency;
  const status = payment?.status ?? registration.paymentStatus;
  if (amount <= 0 || status === "not_required") {
    return "Not required";
  }
  return `${currency} ${amount} · ${formatLabel(status)}`;
}
