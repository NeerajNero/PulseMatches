"use client";

import { FormEvent, useMemo, useState } from "react";
import { DiscoveryControllerFindTournamentsStatusEnum } from "@matchflow/client-sdk";
import { PageHeader } from "@/components/custom/public/page-header";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";
import { TournamentCard } from "@/components/custom/tournaments/tournament-card";
import { useCities, useSports, useTournaments } from "@/hooks/use-discovery";

interface TournamentCollectionViewProps {
  description: string;
  eyebrow: string;
  fixedCity?: string;
  fixedSport?: string;
  showCityFilter?: boolean;
  showSportFilter?: boolean;
  title: string;
}

export function TournamentCollectionView({
  description,
  eyebrow,
  fixedCity,
  fixedSport,
  showCityFilter = true,
  showSportFilter = true,
  title
}: Readonly<TournamentCollectionViewProps>) {
  const [filters, setFilters] = useState({
    city: fixedCity ?? "",
    sport: fixedSport ?? "",
    dateWindow: "all",
    search: "",
    page: 1
  });
  const sports = useSports();
  const cities = useCities();
  const dateRange = useMemo(() => getDateRange(filters.dateWindow), [filters.dateWindow]);
  const tournaments = useTournaments({
    city: fixedCity ?? filters.city,
    sport: fixedSport ?? filters.sport,
    status: DiscoveryControllerFindTournamentsStatusEnum.Published,
    upcomingOnly: filters.dateWindow === "upcoming",
    startsFrom: dateRange.startsFrom,
    startsTo: dateRange.startsTo,
    search: filters.search,
    page: filters.page,
    limit: 12
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      city: fixedCity ?? String(form.get("city") ?? ""),
      sport: fixedSport ?? String(form.get("sport") ?? ""),
      dateWindow: String(form.get("dateWindow") ?? "all"),
      search: String(form.get("search") ?? ""),
      page: 1
    });
  }

  function goToPage(page: number) {
    setFilters((current) => ({ ...current, page }));
  }

  return (
    <main className="listing-shell">
      <PublicHeader />
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <form className="filter-bar discovery-filter-bar" onSubmit={onSubmit}>
        <label>
          <span>Search</span>
          <input name="search" type="search" placeholder="Tournament name or keyword" defaultValue={filters.search} />
        </label>
        {showCityFilter ? (
          <label>
            <span>City</span>
            <select name="city" defaultValue={filters.city}>
              <option value="">All cities</option>
              {(cities.data ?? []).map((city) => (
                <option key={city.id} value={city.slug}>{city.name}</option>
              ))}
            </select>
          </label>
        ) : null}
        {showSportFilter ? (
          <label>
            <span>Sport</span>
            <select name="sport" defaultValue={filters.sport}>
              <option value="">All sports</option>
              {(sports.data ?? []).map((sport) => (
                <option key={sport.id} value={sport.slug}>{sport.name}</option>
              ))}
            </select>
          </label>
        ) : null}
        <label>
          <span>Dates</span>
          <select name="dateWindow" defaultValue={filters.dateWindow}>
            <option value="all">All dates</option>
            <option value="upcoming">Upcoming only</option>
            <option value="next-30">Next 30 days</option>
          </select>
        </label>
        <button className="primary-action filter-action" type="submit">Apply filters</button>
      </form>

      {tournaments.isLoading ? <p className="state-text compact-state listing-state">Loading tournaments.</p> : null}
      {tournaments.isError ? <p className="state-text compact-state listing-state">Unable to load tournaments. Check that the backend is running.</p> : null}
      {!tournaments.isLoading && tournaments.data?.items.length === 0 ? (
        <section className="empty-state listing-empty-state">
          <h2>No tournaments found</h2>
          <p>Try a different sport, city, date window, or search term.</p>
        </section>
      ) : null}

      {tournaments.data ? (
        <div className="listing-summary-bar">
          <span>Showing {tournaments.data.items.length} of {tournaments.data.pagination.total} published tournaments</span>
          <span>Page {tournaments.data.pagination.page} of {Math.max(tournaments.data.pagination.totalPages, 1)}</span>
        </div>
      ) : null}

      <section className="tournament-grid" aria-label="Tournament results">
        {(tournaments.data?.items ?? []).map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </section>

      {tournaments.data ? (
        <footer className="pagination-strip">
          <span>
            Page {tournaments.data.pagination.page} of {Math.max(tournaments.data.pagination.totalPages, 1)}
          </span>
          <span>{tournaments.data.pagination.total} tournaments</span>
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
              disabled={!tournaments.data.pagination.hasNext}
              onClick={() => goToPage(filters.page + 1)}
            >
              Next
            </button>
          </div>
        </footer>
      ) : null}

      <PublicFooter />
    </main>
  );
}

function getDateRange(dateWindow: string) {
  if (dateWindow !== "next-30") {
    return {} as { startsFrom?: string; startsTo?: string };
  }

  const startsFrom = new Date();
  const startsTo = new Date();
  startsTo.setDate(startsTo.getDate() + 30);

  return {
    startsFrom: startsFrom.toISOString(),
    startsTo: startsTo.toISOString()
  } as { startsFrom?: string; startsTo?: string };
}
