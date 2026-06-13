"use client";

import { formatAdminDate, formatAdminLabel, formatAdminMoney, getAdminStatusTone } from "@/components/custom/admin/admin-format";
import { useAdminPaymentDetail } from "@/hooks/use-admin";
import { ROUTES } from "@/utils/route";

export function AdminPaymentDetailView({ paymentRecordId }: Readonly<{ paymentRecordId: string }>) {
  const detail = useAdminPaymentDetail(paymentRecordId);

  if (detail.isLoading) {
    return <p className="state-text compact-state">Loading payment diagnostics.</p>;
  }

  if (detail.isError || !detail.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Payment record not found</h2>
        <p>This record may not exist, or your admin session may have expired.</p>
        <a className="secondary-action" href={ROUTES.ADMIN_PAYMENTS}>Back to payments</a>
      </section>
    );
  }

  const payment = detail.data;

  return (
    <section className="organizer-panel admin-panel">
      <div className="organizer-row-actions">
        <a className="secondary-action" href={ROUTES.ADMIN_PAYMENTS}>Back to payments</a>
      </div>
      <section className="organizer-table">
        <article className="organizer-table-row admin-table-row">
          <div>
            <span className={`status-pill ${getAdminStatusTone(payment.status)}`}>{formatAdminLabel(payment.status)}</span>
            <h2>{payment.player.displayName}</h2>
            <p>{payment.player.email} · {payment.tournamentTitle}</p>
            <p>{payment.categoryName ?? "Tournament-level"} · {formatAdminMoney(payment.amount, payment.currency)}</p>
            <p>
              Provider {formatAdminLabel(payment.provider)}
              {" · "}
              Mode {formatAdminLabel(payment.mode)}
              {payment.reference ? ` · Reference ${payment.reference}` : ""}
            </p>
          </div>
          <p>{payment.paidAt ? `Paid ${formatAdminDate(payment.paidAt)}` : `Updated ${formatAdminDate(payment.updatedAt)}`}</p>
        </article>
      </section>

      <section className="organizer-detail-grid admin-detail-grid">
        <article>
          <h3>Intents</h3>
          {payment.intents.length === 0 ? <p>No payment intents recorded.</p> : payment.intents.map((intent) => (
            <div className="admin-diagnostic-block" key={intent.id}>
              <strong>{formatAdminLabel(intent.provider)} · {formatAdminLabel(intent.status)}</strong>
              <p>{formatAdminMoney(intent.amount, intent.currency)} · Intent {intent.providerIntentId ?? intent.id}</p>
              <p>Created {formatAdminDate(intent.createdAt)}{intent.expiresAt ? ` · Expires ${formatAdminDate(intent.expiresAt)}` : ""}</p>
              {intent.attempts.map((attempt) => (
                <p key={attempt.id}>Attempt {formatAdminLabel(attempt.status)}{attempt.providerAttemptId ? ` · ${attempt.providerAttemptId}` : ""}</p>
              ))}
            </div>
          ))}
        </article>

        <article>
          <h3>Events</h3>
          {payment.events.length === 0 ? <p>No payment events recorded.</p> : payment.events.map((event) => (
            <div className="admin-diagnostic-block" key={event.id}>
              <strong>{event.eventType}</strong>
              <p>
                Provider {formatAdminLabel(event.provider)}
                {event.signatureValid === null ? "" : ` · Signature ${event.signatureValid ? "valid" : "invalid"}`}
              </p>
              <p>{Object.entries(event.payloadSummary).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "No public payload summary"}</p>
              <p>Created {formatAdminDate(event.createdAt)}</p>
            </div>
          ))}
        </article>

        <article>
          <h3>Refunds</h3>
          {payment.refunds.length === 0 ? <p>No refunds recorded.</p> : payment.refunds.map((refund) => (
            <div className="admin-diagnostic-block" key={refund.id}>
              <strong>{formatAdminLabel(refund.status)}</strong>
              <p>{formatAdminMoney(refund.amount, refund.currency)} · Provider {formatAdminLabel(refund.provider)}</p>
              {refund.reason ? <p>Reason {refund.reason}</p> : null}
              <p>{refund.processedAt ? `Processed ${formatAdminDate(refund.processedAt)}` : `Created ${formatAdminDate(refund.createdAt)}`}</p>
            </div>
          ))}
        </article>
      </section>
    </section>
  );
}
