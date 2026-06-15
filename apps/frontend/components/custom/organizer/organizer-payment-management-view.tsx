"use client";

import { FormEvent, useState } from "react";
import type {
  CreatePaymentRefundRequestDto,
  OrganizerPaymentDetailDto,
  OrganizerPaymentDto,
  OrganizerRostersControllerFindPaymentsStatusEnum,
  UpdateRegistrationPaymentRequestDto
} from "@matchflow/client-sdk";
import { formatDateInputValue, toIsoDateTime } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import {
  useOrganizerPayments,
  useOrganizerPaymentDetail,
  useOrganizerReportSummary,
  useCreatePaymentRefund,
  useUpdateRegistrationPayment
} from "@/hooks/use-organizer-rosters";
import { useOrganizerTournament, useTournamentCategories } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";

const PAYMENT_STATUSES = [
  { label: "Pending offline", value: "pending_offline" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
  { label: "Waived", value: "waived" }
] as const;

export function OrganizerPaymentManagementView({ id }: Readonly<{ id: string }>) {
  const [filters, setFilters] = useState({ categoryId: "", from: "", search: "", status: "", to: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const categories = useTournamentCategories(id);
  const payments = useOrganizerPayments(id, {
    categoryId: filters.categoryId,
    from: filters.from,
    search: filters.search,
    status: filters.status as OrganizerRostersControllerFindPaymentsStatusEnum | "",
    to: filters.to
  });
  const reportSummary = useOrganizerReportSummary(id, { from: filters.from, to: filters.to });
  const updatePayment = useUpdateRegistrationPayment(id);
  const createRefund = useCreatePaymentRefund(id);

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      categoryId: String(form.get("categoryId") ?? ""),
      from: String(form.get("from") ?? ""),
      search: String(form.get("search") ?? ""),
      status: String(form.get("status") ?? ""),
      to: String(form.get("to") ?? "")
    });
  }

  async function savePayment(event: FormEvent<HTMLFormElement>, registrationId: string) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await updatePayment.mutateAsync({
        registrationId,
        data: readPaymentForm(event.currentTarget)
      });
      setMessage("Payment status updated.");
    } catch (saveError) {
      setError(await getApiErrorMessage(saveError, "Unable to update payment status."));
    }
  }

  async function saveRefund(event: FormEvent<HTMLFormElement>, registrationId: string) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await createRefund.mutateAsync({
        registrationId,
        data: readRefundForm(event.currentTarget)
      });
      event.currentTarget.reset();
      setMessage("Refund record saved.");
    } catch (saveError) {
      setError(await getApiErrorMessage(saveError, "Unable to save refund record."));
    }
  }

  if (tournament.isLoading) {
    return <p className="state-text compact-state">Loading payments.</p>;
  }

  if (tournament.isError || !tournament.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Tournament not found</h2>
        <p>This tournament may not exist or may belong to another organizer.</p>
      </section>
    );
  }

  return (
    <section className="organizer-panel">
      <div className="section-heading organizer-section-heading">
        <div>
          <h2>{tournament.data.title}</h2>
          <p>Track offline payment verification for paid registration categories. Players cannot update payment status.</p>
        </div>
        <div className="export-action-row">
          <ExportCsvButton
            path={`/organizer/tournaments/${id}/payments/export.csv`}
            params={{ category_id: filters.categoryId, from: filters.from, search: filters.search, status: filters.status, to: filters.to }}
          />
          <ExportCsvButton
            label="Export report CSV"
            path={`/organizer/tournaments/${id}/reports/payments/export.csv`}
            params={{ category_id: filters.categoryId, from: filters.from, search: filters.search, status: filters.status, to: filters.to }}
          />
        </div>
      </div>
      <OrganizerTournamentManagementNav id={id} />

      <section className="organizer-stat-grid roster-stat-grid" aria-label="Payment report summary">
        <article>
          <strong>{getCount(reportSummary.data?.paymentsByStatus, "paid")}</strong>
          <span>Paid in range</span>
        </article>
        <article>
          <strong>{getCount(reportSummary.data?.paymentsByStatus, "pending_offline")}</strong>
          <span>Pending in range</span>
        </article>
        <article>
          <strong>{formatReportMoney(reportSummary.data?.totalCollectedAmount ?? 0)}</strong>
          <span>Collected</span>
        </article>
        <article>
          <strong>{formatReportMoney(reportSummary.data?.totalRefundedAmount ?? 0)}</strong>
          <span>Refunded</span>
        </article>
      </section>

      <form className="filter-bar organizer-filter-bar" onSubmit={onFilter}>
        <label>
          <span>Search</span>
          <input name="search" type="search" placeholder="Player name, email, reference" defaultValue={filters.search} />
        </label>
        <label>
          <span>Payment status</span>
          <select name="status" defaultValue={filters.status}>
            <option value="">All statuses</option>
            <option value="not_required">Not required</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Category</span>
          <select name="categoryId" defaultValue={filters.categoryId}>
            <option value="">All categories</option>
            {(categories.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>From</span>
          <input name="from" type="date" defaultValue={filters.from} />
        </label>
        <label>
          <span>To</span>
          <input name="to" type="date" defaultValue={filters.to} />
        </label>
        <button className="primary-action filter-action" type="submit">Apply filters</button>
      </form>

      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {payments.isLoading ? <p className="state-text compact-state">Loading payment list.</p> : null}
      {payments.isError ? (
        <section className="empty-state account-empty-state">
          <h2>Unable to load payments</h2>
          <p>Check your organizer access and backend connection.</p>
        </section>
      ) : null}
      {payments.data?.length === 0 ? (
        <section className="empty-state account-empty-state">
          <h2>No payment rows found</h2>
          <p>Try a different filter or wait for paid-category registrations.</p>
        </section>
      ) : null}

      <section className="organizer-table" aria-label="Tournament payments">
        {(payments.data ?? []).map((payment) => (
          <PaymentRow
            key={payment.registrationId}
            tournamentId={id}
            isBusy={updatePayment.isPending}
            isRefundBusy={createRefund.isPending}
            payment={payment}
            onSubmit={savePayment}
            onRefundSubmit={saveRefund}
          />
        ))}
      </section>
    </section>
  );
}

function PaymentRow({
  isBusy,
  isRefundBusy,
  onSubmit,
  onRefundSubmit,
  tournamentId,
  payment
}: Readonly<{
  isBusy: boolean;
  isRefundBusy: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>, registrationId: string) => Promise<void>;
  onRefundSubmit: (event: FormEvent<HTMLFormElement>, registrationId: string) => Promise<void>;
  tournamentId: string;
  payment: OrganizerPaymentDto;
}>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detail = useOrganizerPaymentDetail(tournamentId, payment.registrationId, isExpanded);
  const isFree = payment.amount <= 0 || payment.paymentStatus === "not_required";
  const canRefund = payment.paymentStatus === "paid" && payment.amount > payment.refundedAmount;

  return (
    <article className="organizer-table-row roster-table-row">
      <div>
        <span className={`status-pill ${getPaymentTone(payment.paymentStatus)}`}>{formatLabel(payment.paymentStatus)}</span>
        <h3>{payment.playerName}</h3>
        <p>{payment.playerEmail ?? payment.user.email} · {payment.category?.name ?? "Tournament-level"}</p>
        <p>
          {formatMoney(payment.amount, payment.currency)} · Registration {formatLabel(payment.registrationStatus)}
        </p>
        <p>
          Mode {formatLabel(payment.paymentMode)}
          {payment.paymentProvider ? ` · Provider ${formatLabel(payment.paymentProvider)}` : ""}
          {payment.latestIntentStatus ? ` · Intent ${formatLabel(payment.latestIntentStatus)}` : ""}
        </p>
        {payment.latestIntentReference ? (
          <p>
            Provider reference {payment.latestIntentReference}
            {payment.latestIntentEventCount > 0 ? ` · Events ${payment.latestIntentEventCount}` : ""}
          </p>
        ) : null}
        {payment.refundCount > 0 ? (
          <p>
            Refunds {payment.refundCount} · {formatMoney(payment.refundedAmount, payment.currency)}
            {payment.latestRefundStatus ? ` · Latest ${formatLabel(payment.latestRefundStatus)}` : ""}
          </p>
        ) : null}
        <p>
          {payment.reference ? `Reference ${payment.reference} · ` : ""}
          {payment.paidAt ? `Paid ${formatDateTime(payment.paidAt)}` : `Updated ${formatDateTime(payment.updatedAt)}`}
        </p>
      </div>
      <form className="organizer-row-actions payment-row-form" onSubmit={(event) => void onSubmit(event, payment.registrationId)}>
        <label>
          <span className="sr-only">Payment status for {payment.playerName}</span>
          <select name="status" defaultValue={payment.paymentStatus} disabled={isFree || isBusy}>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Manual payment reference</span>
          <input
            name="reference"
            type="text"
            maxLength={160}
            placeholder="Reference"
            defaultValue={payment.reference ?? ""}
            disabled={isFree || isBusy}
          />
        </label>
        <label>
          <span className="sr-only">Paid at</span>
          <input
            name="paidAt"
            type="datetime-local"
            defaultValue={formatDateInputValue(payment.paidAt)}
            disabled={isFree || isBusy}
          />
        </label>
        <label>
          <span className="sr-only">Internal payment notes</span>
          <textarea
            name="internalNotes"
            maxLength={1000}
            placeholder="Internal notes"
            defaultValue={payment.internalNotes ?? ""}
            disabled={isFree || isBusy}
          />
        </label>
        <button className="primary-action" type="submit" disabled={isFree || isBusy}>
          {isBusy ? "Saving" : "Save payment"}
        </button>
        {isFree ? <p className="state-text compact-state">No payment required.</p> : null}
        <button className="secondary-action" type="button" onClick={() => setIsExpanded((current) => !current)}>
          {isExpanded ? "Hide details" : "View details"}
        </button>
      </form>
      {isExpanded ? (
        <PaymentDiagnostics
          canRefund={canRefund}
          detail={detail.data ?? null}
          isLoading={detail.isLoading}
          isError={detail.isError}
          isRefundBusy={isRefundBusy}
          onRefundSubmit={(event) => void onRefundSubmit(event, payment.registrationId)}
          payment={payment}
        />
      ) : null}
    </article>
  );
}

function readPaymentForm(form: HTMLFormElement): UpdateRegistrationPaymentRequestDto {
  const data = new FormData(form);
  return {
    status: String(data.get("status") ?? "pending_offline") as UpdateRegistrationPaymentRequestDto["status"],
    reference: String(data.get("reference") ?? "") || undefined,
    internalNotes: String(data.get("internalNotes") ?? "") || undefined,
    paidAt: toIsoDateTime(data.get("paidAt"))
  };
}

function readRefundForm(form: HTMLFormElement): CreatePaymentRefundRequestDto {
  const data = new FormData(form);
  return {
    amount: Number(data.get("amount") ?? 0),
    status: String(data.get("status") ?? "manual_recorded") as CreatePaymentRefundRequestDto["status"],
    reason: String(data.get("reason") ?? "") || undefined,
    internalNotes: String(data.get("internalNotes") ?? "") || undefined
  };
}

function PaymentDiagnostics({
  canRefund,
  detail,
  isError,
  isLoading,
  isRefundBusy,
  onRefundSubmit,
  payment
}: Readonly<{
  canRefund: boolean;
  detail: OrganizerPaymentDetailDto | null;
  isError: boolean;
  isLoading: boolean;
  isRefundBusy: boolean;
  onRefundSubmit: (event: FormEvent<HTMLFormElement>) => void;
  payment: OrganizerPaymentDto;
}>) {
  const remainingRefundAmount = Math.max(0, payment.amount - payment.refundedAmount);
  const defaultRefundStatus = payment.paymentProvider === "razorpay" ? "requested" : "manual_recorded";

  return (
    <section className="payment-diagnostics" aria-label={`Payment diagnostics for ${payment.playerName}`}>
      {isLoading ? <p className="state-text compact-state">Loading payment diagnostics.</p> : null}
      {isError ? <p className="form-error">Unable to load payment diagnostics.</p> : null}
      {detail ? (
        <>
          <div className="organizer-detail-grid">
            <div>
              <h4>Intents</h4>
              {detail.intents.length === 0 ? <p className="state-text compact-state">No online intents recorded.</p> : null}
              {detail.intents.slice(0, 3).map((intent) => (
                <p key={intent.id}>
                  {formatLabel(intent.provider)} · {formatLabel(intent.status)}
                  {intent.providerIntentId ? ` · ${intent.providerIntentId}` : ""}
                </p>
              ))}
            </div>
            <div>
              <h4>Events</h4>
              {detail.events.length === 0 ? <p className="state-text compact-state">No payment events recorded.</p> : null}
              {detail.events.slice(0, 5).map((event) => (
                <p key={event.id}>
                  {event.eventType} · {formatDateTime(event.createdAt)}
                  {event.signatureValid !== undefined && event.signatureValid !== null
                    ? ` · Signature ${event.signatureValid ? "valid" : "invalid"}`
                    : ""}
                </p>
              ))}
            </div>
            <div>
              <h4>Refunds</h4>
              {detail.refunds.length === 0 ? <p className="state-text compact-state">No refunds recorded.</p> : null}
              {detail.refunds.map((refund) => (
                <p key={refund.id}>
                  {formatMoney(refund.amount, refund.currency)} · {formatLabel(refund.status)}
                  {refund.processedAt ? ` · ${formatDateTime(refund.processedAt)}` : ""}
                </p>
              ))}
            </div>
          </div>

          <form className="organizer-row-actions payment-row-form refund-row-form" onSubmit={onRefundSubmit}>
            <label>
              <span>Refund amount</span>
              <input
                name="amount"
                type="number"
                min={1}
                max={remainingRefundAmount || payment.amount}
                defaultValue={remainingRefundAmount || payment.amount}
                disabled={!canRefund || isRefundBusy}
              />
            </label>
            <label>
              <span>Refund status</span>
              <select name="status" defaultValue={defaultRefundStatus} disabled={!canRefund || isRefundBusy}>
                <option value="manual_recorded">Manual recorded</option>
                <option value="requested">Requested</option>
              </select>
            </label>
            <label>
              <span>Reason</span>
              <input name="reason" type="text" maxLength={500} disabled={!canRefund || isRefundBusy} />
            </label>
            <label>
              <span>Internal notes</span>
              <textarea name="internalNotes" maxLength={1000} disabled={!canRefund || isRefundBusy} />
            </label>
            <button className="primary-action" type="submit" disabled={!canRefund || isRefundBusy}>
              {isRefundBusy ? "Saving" : payment.paymentProvider === "razorpay" ? "Request refund" : "Record refund"}
            </button>
            {!canRefund ? <p className="state-text compact-state">Refunds are available only for paid, not-yet-fully-refunded payments.</p> : null}
          </form>
        </>
      ) : null}
    </section>
  );
}

function getPaymentTone(status: string) {
  if (status === "paid" || status === "waived" || status === "not_required") {
    return "status-pill-ready";
  }
  if (status === "failed" || status === "refunded") {
    return "status-pill-planned";
  }
  return "status-pill-planned";
}

function formatMoney(amount: number, currency: string) {
  if (amount <= 0) {
    return "Free entry";
  }
  return `${currency} ${amount}`;
}

function formatReportMoney(amount: number) {
  return `INR ${amount}`;
}

function getCount(items: Array<{ status?: string; key?: string; count: number }> | undefined, key: string) {
  return items?.find((item) => item.status === key || item.key === key)?.count ?? 0;
}
