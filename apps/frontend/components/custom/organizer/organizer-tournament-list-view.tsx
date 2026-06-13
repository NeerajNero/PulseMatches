"use client";

import { FormEvent, useState } from "react";
import { OrganizerTournamentsControllerFindTournamentsStatusEnum } from "@matchflow/client-sdk";
import { formatDateRange, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { useSports } from "@/hooks/use-discovery";
import {
  useOrganizerTournaments,
  usePublishTournament,
  useUnpublishTournament
} from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import {
  getPublicTournamentHref,
  getStatusTone
} from "@/components/custom/organizer/organizer-format";
import {
  organizerTournamentCategoriesRoute,
  organizerTournamentEditRoute,
  organizerTournamentFixturesRoute,
  organizerTournamentParticipantsRoute,
  organizerTournamentRegistrationsRoute,
  organizerTournamentTeamsRoute,
  ROUTES
} from "@/utils/route";

export function OrganizerTournamentListView() {
  const [filters, setFilters] = useState({ status: "", sport: "", search: "", page: 1 });
  const [actionError, setActionError] = useState<string | null>(null);
  const sports = useSports();
  const tournaments = useOrganizerTournaments({
    status: filters.status as OrganizerTournamentsControllerFindTournamentsStatusEnum | "",
    sport: filters.sport,
    search: filters.search,
    page: filters.page,
    limit: 12
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      status: String(form.get("status") ?? ""),
      sport: String(form.get("sport") ?? ""),
      search: String(form.get("search") ?? ""),
      page: 1
    });
  }

  function goToPage(page: number) {
    setFilters((current) => ({ ...current, page }));
  }

  return (
    <>
      <form className="filter-bar organizer-filter-bar" onSubmit={onSubmit}>
        <label>
          <span>Search</span>
          <input name="search" type="search" placeholder="Tournament name" defaultValue={filters.search} />
        </label>
        <label>
          <span>Status</span>
          <select name="status" defaultValue={filters.status}>
            <option value="">All statuses</option>
            <option value={OrganizerTournamentsControllerFindTournamentsStatusEnum.Draft}>Draft</option>
            <option value={OrganizerTournamentsControllerFindTournamentsStatusEnum.Published}>Published</option>
            <option value={OrganizerTournamentsControllerFindTournamentsStatusEnum.Archived}>Archived</option>
            <option value={OrganizerTournamentsControllerFindTournamentsStatusEnum.Blocked}>Blocked</option>
          </select>
        </label>
        <label>
          <span>Sport</span>
          <select name="sport" defaultValue={filters.sport}>
            <option value="">All sports</option>
            {(sports.data ?? []).map((sport) => (
              <option key={sport.id} value={sport.slug}>{sport.name}</option>
            ))}
          </select>
        </label>
        <button className="primary-action filter-action" type="submit">Apply filters</button>
      </form>

      {actionError ? <p className="form-error">{actionError}</p> : null}
      {tournaments.isLoading ? <p className="state-text compact-state">Loading tournaments.</p> : null}
      {tournaments.isError ? (
        <section className="empty-state account-empty-state">
          <h2>Unable to load tournaments</h2>
          <p>Check your organizer access and backend connection.</p>
        </section>
      ) : null}
      {tournaments.data?.items.length === 0 ? (
        <section className="empty-state account-empty-state">
          <h2>No tournaments found</h2>
          <p>Create a draft or adjust your filters.</p>
          <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>
        </section>
      ) : null}

      <section className="organizer-table" aria-label="Owned tournaments">
        {(tournaments.data?.items ?? []).map((tournament) => (
          <OrganizerTournamentRow
            key={tournament.id}
            tournament={tournament}
            onError={setActionError}
          />
        ))}
      </section>

      {tournaments.data ? (
        <footer className="pagination-strip organizer-pagination">
          <span>Page {tournaments.data.page} of {Math.max(tournaments.data.totalPages, 1)}</span>
          <span>{tournaments.data.total} tournaments</span>
          <div className="pagination-actions">
            <button
              className="secondary-action"
              type="button"
              disabled={filters.page <= 1}
              onClick={() => goToPage(filters.page - 1)}
            >
              Previous
            </button>
            <button
              className="secondary-action"
              type="button"
              disabled={!tournaments.data.hasNext}
              onClick={() => goToPage(filters.page + 1)}
            >
              Next
            </button>
          </div>
        </footer>
      ) : null}
    </>
  );
}

function OrganizerTournamentRow({
  onError,
  tournament
}: Readonly<{
  onError: (message: string | null) => void;
  tournament: NonNullable<ReturnType<typeof useOrganizerTournaments>["data"]>["items"][number];
}>) {
  const publishTournament = usePublishTournament(tournament.id);
  const unpublishTournament = useUnpublishTournament(tournament.id);
  const publicHref = getPublicTournamentHref(tournament);

  async function runPublish() {
    onError(null);
    try {
      await publishTournament.mutateAsync();
    } catch (error) {
      onError(await getApiErrorMessage(error, "Unable to publish tournament."));
    }
  }

  async function runUnpublish() {
    onError(null);
    try {
      await unpublishTournament.mutateAsync();
    } catch (error) {
      onError(await getApiErrorMessage(error, "Unable to unpublish tournament."));
    }
  }

  return (
    <article className="organizer-table-row">
      <div>
        <span className={`status-pill ${getStatusTone(tournament.status)}`}>{formatLabel(tournament.status)}</span>
        <h3>{tournament.title}</h3>
        <p>{tournament.sport.name} · {tournament.city.name} · {formatDateRange(tournament.startsAt, tournament.endsAt)}</p>
        <p>{tournament.registrationCount} registrations · {tournament.pendingRegistrationCount} pending</p>
      </div>
      <div className="organizer-row-actions">
        {publicHref ? <a className="secondary-action" href={publicHref}>Public page</a> : null}
        <a className="secondary-action" href={organizerTournamentEditRoute(tournament.id)}>Edit</a>
        <a className="secondary-action" href={organizerTournamentCategoriesRoute(tournament.id)}>Categories</a>
        <a className="secondary-action" href={organizerTournamentRegistrationsRoute(tournament.id)}>Registrations</a>
        <a className="secondary-action" href={organizerTournamentParticipantsRoute(tournament.id)}>Participants</a>
        <a className="secondary-action" href={organizerTournamentTeamsRoute(tournament.id)}>Teams</a>
        <a className="secondary-action" href={organizerTournamentFixturesRoute(tournament.id)}>Fixtures</a>
        {tournament.status === "published" ? (
          <button
            className="secondary-action"
            type="button"
            disabled={unpublishTournament.isPending}
            onClick={() => void runUnpublish()}
          >
            {unpublishTournament.isPending ? "Unpublishing" : "Unpublish"}
          </button>
        ) : (
          <button
            className="primary-action"
            type="button"
            disabled={publishTournament.isPending}
            onClick={() => void runPublish()}
          >
            {publishTournament.isPending ? "Publishing" : "Publish"}
          </button>
        )}
      </div>
    </article>
  );
}
