"use client";

import { FormEvent, useState } from "react";
import {
  OrganizerRegistrationDto,
  OrganizerRostersControllerFindRegistrationsStatusEnum
} from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import {
  useApproveRegistration,
  useCancelOrganizerRegistration,
  useOrganizerRegistrations,
  useOrganizerReportSummary,
  useOrganizerRosterSummary,
  useRejectRegistration
} from "@/hooks/use-organizer-rosters";
import { useOrganizerTournament, useTournamentCategories } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";

export function OrganizerRegistrationManagementView({ id }: Readonly<{ id: string }>) {
  const [filters, setFilters] = useState({ categoryId: "", from: "", search: "", status: "", to: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const categories = useTournamentCategories(id);
  const summary = useOrganizerRosterSummary(id);
  const reportSummary = useOrganizerReportSummary(id, { from: filters.from, to: filters.to });
  const registrations = useOrganizerRegistrations(id, {
    categoryId: filters.categoryId,
    from: filters.from,
    search: filters.search,
    status: filters.status as OrganizerRostersControllerFindRegistrationsStatusEnum | "",
    to: filters.to
  });
  const approve = useApproveRegistration(id);
  const reject = useRejectRegistration(id);
  const cancel = useCancelOrganizerRegistration(id);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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

  async function runAction(action: "approve" | "reject" | "cancel", registrationId: string) {
    setMessage(null);
    setError(null);
    try {
      if (action === "approve") {
        await approve.mutateAsync(registrationId);
        setMessage("Registration approved and participant created.");
      } else if (action === "reject") {
        await reject.mutateAsync({ registrationId });
        setMessage("Registration rejected.");
      } else {
        await cancel.mutateAsync(registrationId);
        setMessage("Registration cancelled.");
      }
    } catch (actionError) {
      setError(await getApiErrorMessage(actionError, "Unable to update registration."));
    }
  }

  if (tournament.isLoading) {
    return <p className="state-text compact-state">Loading registrations.</p>;
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
          <p>Review player registrations and approve eligible players into the tournament roster.</p>
        </div>
        <div className="export-action-row">
          <ExportCsvButton
            path={`/organizer/tournaments/${id}/registrations/export.csv`}
            params={{ category_id: filters.categoryId, from: filters.from, search: filters.search, status: filters.status, to: filters.to }}
          />
          <ExportCsvButton
            label="Export report CSV"
            path={`/organizer/tournaments/${id}/reports/registrations/export.csv`}
            params={{ category_id: filters.categoryId, from: filters.from, search: filters.search, status: filters.status, to: filters.to }}
          />
        </div>
      </div>
      <OrganizerTournamentManagementNav id={id} />

      <section className="organizer-stat-grid roster-stat-grid" aria-label="Roster summary">
        <article>
          <strong>{summary.data?.registrationsTotal ?? "-"}</strong>
          <span>Registrations</span>
        </article>
        <article>
          <strong>{summary.data?.registrationsPending ?? "-"}</strong>
          <span>Pending</span>
        </article>
        <article>
          <strong>{summary.data?.participantsActive ?? "-"}</strong>
          <span>Active participants</span>
        </article>
        <article>
          <strong>{summary.data?.teamsActive ?? "-"}</strong>
          <span>Active teams</span>
        </article>
      </section>

      <section className="organizer-stat-grid roster-stat-grid" aria-label="Registration report summary">
        <article>
          <strong>{getCount(reportSummary.data?.registrationsByStatus, "pending")}</strong>
          <span>Pending in range</span>
        </article>
        <article>
          <strong>{getCount(reportSummary.data?.registrationsByStatus, "confirmed")}</strong>
          <span>Confirmed in range</span>
        </article>
        <article>
          <strong>{reportSummary.data?.participantCount ?? "-"}</strong>
          <span>Participants in range</span>
        </article>
        <article>
          <strong>{reportSummary.data?.completedMatchCount ?? "-"}</strong>
          <span>Completed matches</span>
        </article>
      </section>

      <form className="filter-bar organizer-filter-bar" onSubmit={onSubmit}>
        <label>
          <span>Search</span>
          <input name="search" type="search" placeholder="Player name, email, phone" defaultValue={filters.search} />
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={filters.status}>
            <option value="">All statuses</option>
            <option value={OrganizerRostersControllerFindRegistrationsStatusEnum.Pending}>Pending</option>
            <option value={OrganizerRostersControllerFindRegistrationsStatusEnum.Confirmed}>Confirmed</option>
            <option value={OrganizerRostersControllerFindRegistrationsStatusEnum.Rejected}>Rejected</option>
            <option value={OrganizerRostersControllerFindRegistrationsStatusEnum.Cancelled}>Cancelled</option>
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
      {registrations.isLoading ? <p className="state-text compact-state">Loading registration list.</p> : null}
      {registrations.isError ? (
        <section className="empty-state account-empty-state">
          <h2>Unable to load registrations</h2>
          <p>Check your organizer access and backend connection.</p>
        </section>
      ) : null}
      {registrations.data?.length === 0 ? (
        <section className="empty-state account-empty-state">
          <h2>No registrations found</h2>
          <p>Try a different filter or wait for players to register.</p>
        </section>
      ) : null}

      <section className="organizer-table" aria-label="Tournament registrations">
        {(registrations.data ?? []).map((registration) => (
          <RegistrationRow
            key={registration.id}
            registration={registration}
            isBusy={approve.isPending || reject.isPending || cancel.isPending}
            onAction={runAction}
          />
        ))}
      </section>
    </section>
  );
}

function getCount(items: Array<{ status?: string; key?: string; count: number }> | undefined, key: string) {
  return items?.find((item) => item.status === key || item.key === key)?.count ?? 0;
}

function RegistrationRow({
  isBusy,
  onAction,
  registration
}: Readonly<{
  isBusy: boolean;
  onAction: (action: "approve" | "reject" | "cancel", registrationId: string) => Promise<void>;
  registration: OrganizerRegistrationDto;
}>) {
  return (
    <article className="organizer-table-row roster-table-row">
      <div>
        <span className={`status-pill ${getStatusTone(registration.status)}`}>{formatLabel(registration.status)}</span>
        <h3>{registration.playerName}</h3>
        <p>{registration.user.email} · {registration.phone ?? "No phone"}</p>
        <p>
          {registration.category?.name ?? "Tournament-level"} · {registration.category ? formatRegistrationFee(registration.category) : "No category fee"} ·{" "}
          Payment {formatLabel(registration.paymentStatus)}
        </p>
        <p>Registered {formatDateTime(registration.registeredAt)}</p>
      </div>
      <div className="organizer-row-actions">
        {registration.participantId ? <span className="status-pill status-pill-ready">Participant</span> : null}
        {registration.status === "pending" ? (
          <>
            <button className="primary-action" type="button" disabled={isBusy} onClick={() => void onAction("approve", registration.id)}>
              Approve
            </button>
            <button className="secondary-action" type="button" disabled={isBusy} onClick={() => void onAction("reject", registration.id)}>
              Reject
            </button>
          </>
        ) : null}
        {(registration.status === "pending" || registration.status === "confirmed") ? (
          <button className="secondary-action" type="button" disabled={isBusy} onClick={() => void onAction("cancel", registration.id)}>
            Cancel
          </button>
        ) : null}
      </div>
    </article>
  );
}

function formatRegistrationFee(category: NonNullable<OrganizerRegistrationDto["category"]>) {
  if (category.entryFeeAmount === 0) {
    return "Free entry";
  }
  return `${category.entryFeeCurrency} ${category.entryFeeAmount}`;
}
