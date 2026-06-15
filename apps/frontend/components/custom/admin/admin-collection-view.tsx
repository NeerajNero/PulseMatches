"use client";

import type {
  AdminAuditEventDto,
  AdminControllerListAuditEventsRequest,
  AdminControllerListNotificationsRequest,
  AdminControllerListOrganizersRequest,
  AdminControllerListPaymentsRequest,
  AdminControllerListReconciliationRunsRequest,
  AdminControllerListRegistrationsRequest,
  AdminControllerListTournamentsRequest,
  AdminControllerListUsersRequest,
  AdminNotificationDto,
  AdminOrganizerDto,
  AdminPaymentDto,
  AdminReconciliationRunDto,
  AdminRegistrationDto,
  AdminTournamentDto,
  AdminUserDto
} from "@matchflow/client-sdk";
import { FormEvent, useState } from "react";
import { formatAdminDate, formatAdminLabel, formatAdminMoney, getAdminStatusTone } from "@/components/custom/admin/admin-format";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import {
  useAdminAuditEvents,
  useAdminNotifications,
  useAdminOrganizers,
  useAdminPayments,
  useAdminReconciliationRuns,
  useAdminRegistrations,
  useAdminTournaments,
  useAdminUsers,
  useRejectOrganizer,
  useResetOrganizerVerification,
  useRetryNotification,
  useSkipNotification,
  useVerifyOrganizer
} from "@/hooks/use-admin";
import { adminOrganizerDetailRoute, adminPaymentDetailRoute } from "@/utils/route";

export type AdminCollectionKind =
  | "users"
  | "organizers"
  | "tournaments"
  | "registrations"
  | "payments"
  | "notifications"
  | "reconciliation"
  | "audit";

interface AdminFilters {
  from: string;
  page: number;
  search: string;
  status: string;
  role: string;
  provider: string;
  to: string;
}

const DEFAULT_FILTERS: AdminFilters = {
  from: "",
  page: 1,
  search: "",
  status: "",
  role: "",
  provider: "",
  to: ""
};

export function AdminCollectionView({ kind }: Readonly<{ kind: AdminCollectionKind }>) {
  switch (kind) {
    case "users":
      return <AdminUsersView />;
    case "organizers":
      return <AdminOrganizersView />;
    case "tournaments":
      return <AdminTournamentsView />;
    case "registrations":
      return <AdminRegistrationsView />;
    case "payments":
      return <AdminPaymentsView />;
    case "notifications":
      return <AdminNotificationsView />;
    case "reconciliation":
      return <AdminReconciliationView />;
    case "audit":
      return <AdminAuditView />;
  }
}

function AdminUsersView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const users = useAdminUsers({
    page: filters.page,
    limit: 20,
    search: filters.search,
    role: filters.role as AdminControllerListUsersRequest["role"]
  });

  return (
    <AdminListFrame
      title="Users"
      description="Inspect safe account and role summaries. Password hashes and tokens are never returned."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Player", value: "PLAYER" },
        { label: "Organizer", value: "ORGANIZER" },
        { label: "Admin", value: "ADMIN" }
      ]}
      statusLabel="Role"
      exportPath="/admin/users/export.csv"
      exportParams={{ search: filters.search, role: filters.role }}
      query={users}
      renderItems={(items) => items.map((user) => <UserRow key={user.id} user={user} />)}
    />
  );
}

function AdminOrganizersView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const organizers = useAdminOrganizers({
    page: filters.page,
    limit: 20,
    search: filters.search,
    verificationStatus: filters.status
  } as AdminControllerListOrganizersRequest);

  return (
    <AdminListFrame
      title="Organizers"
      description="Review organizer verification state with narrow audited support actions."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Pending", value: "pending" },
        { label: "Verified", value: "verified" },
        { label: "Rejected", value: "rejected" }
      ]}
      statusLabel="Verification"
      exportPath="/admin/organizers/export.csv"
      exportParams={{ search: filters.search, verification_status: filters.status }}
      query={organizers}
      renderItems={(items) => items.map((organizer) => <OrganizerRow key={organizer.id} organizer={organizer} />)}
    />
  );
}

function AdminTournamentsView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const tournaments = useAdminTournaments({
    page: filters.page,
    limit: 20,
    search: filters.search,
    status: filters.status as AdminControllerListTournamentsRequest["status"]
  });

  return (
    <AdminListFrame
      title="Tournaments"
      description="Inspect public and draft tournament state across organizers."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
        { label: "Blocked", value: "blocked" }
      ]}
      exportPath="/admin/tournaments/export.csv"
      exportParams={{ search: filters.search, status: filters.status }}
      query={tournaments}
      renderItems={(items) => items.map((tournament) => <TournamentRow key={tournament.id} tournament={tournament} />)}
    />
  );
}

function AdminRegistrationsView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const registrations = useAdminRegistrations({
    page: filters.page,
    limit: 20,
    from: filters.from,
    search: filters.search,
    status: filters.status as AdminControllerListRegistrationsRequest["status"],
    to: filters.to
  } as unknown as AdminControllerListRegistrationsRequest);

  return (
    <AdminListFrame
      title="Registrations"
      description="Inspect registration status and payment state without approval or cancellation actions."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Rejected", value: "rejected" },
        { label: "Cancelled", value: "cancelled" }
      ]}
      exportPath="/admin/registrations/export.csv"
      exportParams={{ from: filters.from, search: filters.search, status: filters.status, to: filters.to }}
      secondaryExportLabel="Export report CSV"
      secondaryExportPath="/admin/reports/registrations/export.csv"
      secondaryExportParams={{ from: filters.from, search: filters.search, status: filters.status, to: filters.to }}
      showDateFilters
      query={registrations}
      renderItems={(items) => items.map((registration) => <RegistrationRow key={registration.id} registration={registration} />)}
    />
  );
}

function AdminPaymentsView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const payments = useAdminPayments({
    page: filters.page,
    limit: 20,
    from: filters.from,
    search: filters.search,
    status: filters.status as AdminControllerListPaymentsRequest["status"],
    provider: filters.provider as AdminControllerListPaymentsRequest["provider"],
    to: filters.to
  } as unknown as AdminControllerListPaymentsRequest);

  return (
    <AdminListFrame
      title="Payments"
      description="Inspect safe payment summaries, latest intent status, and refund counts."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Pending offline", value: "pending_offline" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
        { label: "Waived", value: "waived" }
      ]}
      providerOptions={[
        { label: "Manual", value: "manual" },
        { label: "Mock", value: "mock" },
        { label: "Razorpay", value: "razorpay" }
      ]}
      exportPath="/admin/payments/export.csv"
      exportParams={{ from: filters.from, search: filters.search, status: filters.status, provider: filters.provider, to: filters.to }}
      secondaryExportLabel="Export report CSV"
      secondaryExportPath="/admin/reports/payments/export.csv"
      secondaryExportParams={{ from: filters.from, search: filters.search, status: filters.status, provider: filters.provider, to: filters.to }}
      showDateFilters
      query={payments}
      renderItems={(items) => items.map((payment) => <PaymentRow key={payment.id} payment={payment} />)}
    />
  );
}

function AdminNotificationsView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const notifications = useAdminNotifications({
    page: filters.page,
    limit: 20,
    search: filters.search,
    status: filters.status as AdminControllerListNotificationsRequest["status"]
  });

  return (
    <AdminListFrame
      title="Notifications"
      description="Inspect outbox delivery state and request audited retry or skip transitions."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Sent", value: "sent" },
        { label: "Failed", value: "failed" },
        { label: "Skipped", value: "skipped" }
      ]}
      exportPath="/admin/notifications/export.csv"
      exportParams={{ search: filters.search, status: filters.status }}
      query={notifications}
      renderItems={(items) => items.map((notification) => <NotificationRow key={notification.id} notification={notification} />)}
    />
  );
}

function AdminReconciliationView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const runs = useAdminReconciliationRuns({
    page: filters.page,
    limit: 20,
    from: filters.from,
    provider: filters.provider as AdminControllerListReconciliationRunsRequest["provider"],
    status: filters.status as AdminControllerListReconciliationRunsRequest["status"],
    to: filters.to
  } as unknown as AdminControllerListReconciliationRunsRequest);

  return (
    <AdminListFrame
      title="Reconciliation runs"
      description="Inspect one-shot payment reconciliation run summaries."
      filters={filters}
      onFilters={setFilters}
      statusOptions={[
        { label: "Started", value: "started" },
        { label: "Completed", value: "completed" },
        { label: "Failed", value: "failed" }
      ]}
      providerOptions={[
        { label: "Manual", value: "manual" },
        { label: "Mock", value: "mock" },
        { label: "Razorpay", value: "razorpay" }
      ]}
      exportPath="/admin/reconciliation-runs/export.csv"
      exportParams={{ from: filters.from, provider: filters.provider, status: filters.status, to: filters.to }}
      showDateFilters
      query={runs}
      renderItems={(items) => items.map((run) => <ReconciliationRow key={run.id} run={run} />)}
    />
  );
}

function AdminAuditView() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const audit = useAdminAuditEvents({
    page: filters.page,
    limit: 20,
    search: filters.search
  } as AdminControllerListAuditEventsRequest);

  return (
    <AdminListFrame
      title="Audit events"
      description="Inspect recent sanitized audit events. Full metadata payloads are not exposed."
      filters={filters}
      onFilters={setFilters}
      exportPath="/admin/audit-events/export.csv"
      exportParams={{ search: filters.search }}
      query={audit}
      renderItems={(items) => items.map((event) => <AuditRow key={event.id} event={event} />)}
    />
  );
}

function AdminListFrame<TItem>({
  description,
  exportParams,
  exportPath,
  filters,
  onFilters,
  providerOptions,
  query,
  renderItems,
  secondaryExportLabel,
  secondaryExportParams,
  secondaryExportPath,
  showDateFilters = false,
  statusLabel = "Status",
  statusOptions,
  title
}: Readonly<{
  description: string;
  exportParams?: Record<string, string>;
  exportPath?: string;
  filters: AdminFilters;
  onFilters: (filters: AdminFilters) => void;
  providerOptions?: Array<{ label: string; value: string }>;
  query: { data?: { items: TItem[]; pagination: { page: number; totalPages: number; total: number } } | null; isError: boolean; isLoading: boolean };
  renderItems: (items: TItem[]) => React.ReactNode;
  secondaryExportLabel?: string;
  secondaryExportParams?: Record<string, string>;
  secondaryExportPath?: string;
  showDateFilters?: boolean;
  statusLabel?: string;
  statusOptions?: Array<{ label: string; value: string }>;
  title: string;
}>) {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onFilters({
      ...filters,
      page: 1,
      search: String(form.get("search") ?? ""),
      status: String(form.get("status") ?? ""),
      provider: String(form.get("provider") ?? ""),
      from: String(form.get("from") ?? ""),
      to: String(form.get("to") ?? "")
    });
  }

  return (
    <section className="organizer-panel admin-panel">
      <div className="section-heading organizer-section-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="export-action-row">
          {exportPath ? <ExportCsvButton path={exportPath} params={exportParams} /> : null}
          {secondaryExportPath ? (
            <ExportCsvButton label={secondaryExportLabel} path={secondaryExportPath} params={secondaryExportParams} />
          ) : null}
        </div>
      </div>

      <form className="filter-bar organizer-filter-bar admin-filter-bar" onSubmit={onSubmit}>
        <label>
          <span>Search</span>
          <input name="search" type="search" placeholder="Search support records" defaultValue={filters.search} />
        </label>
        {statusOptions ? (
          <label>
            <span>{statusLabel}</span>
            <select name="status" defaultValue={filters.status}>
              <option value="">All</option>
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ) : null}
        {providerOptions ? (
          <label>
            <span>Provider</span>
            <select name="provider" defaultValue={filters.provider}>
              <option value="">All providers</option>
              {providerOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ) : null}
        {showDateFilters ? (
          <>
            <label>
              <span>From</span>
              <input name="from" type="date" defaultValue={filters.from} />
            </label>
            <label>
              <span>To</span>
              <input name="to" type="date" defaultValue={filters.to} />
            </label>
          </>
        ) : null}
        <button className="primary-action filter-action" type="submit">Apply filters</button>
      </form>

      {query.isLoading ? <p className="state-text compact-state">Loading {title.toLowerCase()}.</p> : null}
      {query.isError ? (
        <section className="empty-state account-empty-state">
          <h2>Unable to load {title.toLowerCase()}</h2>
          <p>Check your admin role and backend connection.</p>
        </section>
      ) : null}
      {query.data?.items.length === 0 ? (
        <section className="empty-state account-empty-state">
          <h2>No records found</h2>
          <p>Try a different search or filter.</p>
        </section>
      ) : null}
      <section className="organizer-table admin-table" aria-label={title}>
        {query.data ? renderItems(query.data.items) : null}
      </section>
      {query.data ? (
        <PaginationControls
          page={query.data.pagination.page}
          total={query.data.pagination.total}
          totalPages={query.data.pagination.totalPages}
          onPage={(page) => onFilters({ ...filters, page })}
        />
      ) : null}
    </section>
  );
}

function UserRow({ user }: Readonly<{ user: AdminUserDto }>) {
  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(user.status)}`}>{formatAdminLabel(user.status)}</span>
        <h3>{user.displayName}</h3>
        <p>{user.email} · Roles {user.roles.join(", ")}</p>
        <p>{user.organizer ? `${user.organizer.organizationName} · ${formatAdminLabel(user.organizer.verificationStatus)}` : "No organizer profile"}</p>
      </div>
      <p>{user.registrationCount} registrations · Joined {formatAdminDate(user.createdAt)}</p>
    </article>
  );
}

function OrganizerRow({ organizer }: Readonly<{ organizer: AdminOrganizerDto }>) {
  const verifyOrganizer = useVerifyOrganizer();
  const rejectOrganizer = useRejectOrganizer();
  const resetOrganizer = useResetOrganizerVerification();
  const isBusy = verifyOrganizer.isPending || rejectOrganizer.isPending || resetOrganizer.isPending;

  function onVerify() {
    if (!window.confirm(`Verify ${organizer.organizationName}? Verified organizers can publish tournaments.`)) {
      return;
    }
    verifyOrganizer.mutate(organizer.id);
  }

  function onReject() {
    const reason = window.prompt(`Reject verification for ${organizer.organizationName}? Add an optional reason for the audit trail.`);
    if (reason === null) {
      return;
    }
    rejectOrganizer.mutate({ organizerId: organizer.id, body: { reason } });
  }

  function onReset() {
    if (!window.confirm(`Reset ${organizer.organizationName} back to pending verification?`)) {
      return;
    }
    resetOrganizer.mutate(organizer.id);
  }

  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(organizer.verificationStatus)}`}>{formatAdminLabel(organizer.verificationStatus)}</span>
        <h3>{organizer.organizationName}</h3>
        <p>{organizer.user.displayName} · {organizer.user.email}</p>
        <p>Slug {organizer.slug} · Status {formatAdminLabel(organizer.status)}</p>
      </div>
      <div className="organizer-row-actions admin-row-actions">
        <a className="secondary-action" href={adminOrganizerDetailRoute(organizer.id)}>Details</a>
        {organizer.verificationStatus !== "verified" ? (
          <button className="primary-action" type="button" disabled={isBusy} onClick={onVerify}>Verify</button>
        ) : null}
        {organizer.verificationStatus === "pending" ? (
          <button className="secondary-action" type="button" disabled={isBusy} onClick={onReject}>Reject</button>
        ) : null}
        {organizer.verificationStatus !== "pending" ? (
          <button className="secondary-action" type="button" disabled={isBusy} onClick={onReset}>Reset</button>
        ) : null}
        <p>{organizer.tournamentCount} tournaments · Created {formatAdminDate(organizer.createdAt)}</p>
      </div>
    </article>
  );
}

function TournamentRow({ tournament }: Readonly<{ tournament: AdminTournamentDto }>) {
  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(tournament.status)}`}>{formatAdminLabel(tournament.status)}</span>
        <h3>{tournament.title}</h3>
        <p>{tournament.sport} · {tournament.city} · {formatAdminLabel(tournament.visibility)}</p>
        <p>{tournament.organizer.organizationName} · {tournament.organizer.user.email}</p>
      </div>
      <p>{tournament.registrationCount} registrations · Created {formatAdminDate(tournament.createdAt)}</p>
    </article>
  );
}

function RegistrationRow({ registration }: Readonly<{ registration: AdminRegistrationDto }>) {
  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(registration.status)}`}>{formatAdminLabel(registration.status)}</span>
        <h3>{registration.playerName}</h3>
        <p>{registration.player.email} · {registration.tournamentTitle}</p>
        <p>{registration.categoryName ?? "Tournament-level"} · Payment {formatAdminLabel(registration.paymentStatus)}</p>
      </div>
      <p>Created {formatAdminDate(registration.createdAt)}</p>
    </article>
  );
}

function PaymentRow({ payment }: Readonly<{ payment: AdminPaymentDto }>) {
  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(payment.status)}`}>{formatAdminLabel(payment.status)}</span>
        <h3>{payment.player.displayName}</h3>
        <p>{payment.tournamentTitle} · {formatAdminMoney(payment.amount, payment.currency)}</p>
        <p>
          Provider {formatAdminLabel(payment.provider)}
          {payment.latestIntentStatus ? ` · Intent ${formatAdminLabel(payment.latestIntentStatus)}` : ""}
          {` · Events ${payment.eventCount}`}
        </p>
        <p>Refunds {payment.refundCount} · {formatAdminMoney(payment.refundedAmount, payment.currency)}</p>
      </div>
      <div className="organizer-row-actions">
        <a className="secondary-action" href={adminPaymentDetailRoute(payment.id)}>View details</a>
      </div>
    </article>
  );
}

function NotificationRow({ notification }: Readonly<{ notification: AdminNotificationDto }>) {
  const retryNotification = useRetryNotification();
  const skipNotification = useSkipNotification();
  const isBusy = retryNotification.isPending || skipNotification.isPending;

  function onRetry() {
    if (!window.confirm("Return this notification to pending so the notification processor can retry it?")) {
      return;
    }
    retryNotification.mutate(notification.id);
  }

  function onSkip() {
    const reason = window.prompt("Mark this notification as skipped? Add an optional audit reason.");
    if (reason === null) {
      return;
    }
    skipNotification.mutate({ notificationId: notification.id, body: { reason } });
  }

  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(notification.status)}`}>{formatAdminLabel(notification.status)}</span>
        <h3>{formatAdminLabel(notification.type)}</h3>
        <p>{formatAdminLabel(notification.channel)} · {notification.recipientEmail ?? "No recipient"}</p>
        <p>Attempts {notification.attempts}{notification.provider ? ` · Provider ${notification.provider}` : ""}</p>
        {notification.lastError ? <p>Error {notification.lastError}</p> : null}
      </div>
      <div className="organizer-row-actions admin-row-actions">
        {notification.status === "failed" || notification.status === "skipped" ? (
          <button className="primary-action" type="button" disabled={isBusy} onClick={onRetry}>Retry</button>
        ) : null}
        {notification.status === "pending" || notification.status === "failed" ? (
          <button className="secondary-action" type="button" disabled={isBusy} onClick={onSkip}>Skip</button>
        ) : null}
        <p>{notification.processedAt ? `Processed ${formatAdminDate(notification.processedAt)}` : `Created ${formatAdminDate(notification.createdAt)}`}</p>
      </div>
    </article>
  );
}

function ReconciliationRow({ run }: Readonly<{ run: AdminReconciliationRunDto }>) {
  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className={`status-pill ${getAdminStatusTone(run.status)}`}>{formatAdminLabel(run.status)}</span>
        <h3>{formatAdminLabel(run.provider)}</h3>
        <p>Checked {run.checkedCount} · Updated {run.updatedCount} · Failed {run.failedCount}</p>
        {run.error ? <p>Error {run.error}</p> : null}
      </div>
      <p>{run.completedAt ? `Completed ${formatAdminDate(run.completedAt)}` : `Started ${formatAdminDate(run.startedAt)}`}</p>
    </article>
  );
}

function AuditRow({ event }: Readonly<{ event: AdminAuditEventDto }>) {
  return (
    <article className="organizer-table-row admin-table-row">
      <div>
        <span className="status-pill status-pill-planned">{event.entityType}</span>
        <h3>{event.action}</h3>
        <p>{event.actor ? `${event.actor.displayName} · ${event.actor.email}` : "System event"}</p>
        <p>{Object.entries(event.metadataSummary).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "No public metadata summary"}</p>
      </div>
      <p>Created {formatAdminDate(event.createdAt)}</p>
    </article>
  );
}

function PaginationControls({
  onPage,
  page,
  total,
  totalPages
}: Readonly<{
  onPage: (page: number) => void;
  page: number;
  total: number;
  totalPages: number;
}>) {
  return (
    <div className="pagination-controls admin-pagination">
      <button className="secondary-action" type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span>Page {page} of {totalPages} · {total} records</span>
      <button className="secondary-action" type="button" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
