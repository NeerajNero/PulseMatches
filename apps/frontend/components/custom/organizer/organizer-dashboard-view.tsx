"use client";

import { formatDateRange, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { useOrganizerDashboard } from "@/hooks/use-organizer-tournaments";
import {
  organizerTournamentCategoriesRoute,
  organizerTournamentEditRoute,
  ROUTES
} from "@/utils/route";

export function OrganizerDashboardView() {
  const dashboard = useOrganizerDashboard();

  if (dashboard.isLoading) {
    return <p className="state-text compact-state">Loading dashboard.</p>;
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Unable to load dashboard</h2>
        <p>Check that the backend is running and your organizer profile exists.</p>
      </section>
    );
  }

  const cards = [
    { label: "Total tournaments", value: dashboard.data.totalTournaments },
    { label: "Drafts", value: dashboard.data.draftTournaments },
    { label: "Published", value: dashboard.data.publishedTournaments },
    { label: "Upcoming", value: dashboard.data.upcomingTournaments },
    { label: "Registrations", value: dashboard.data.totalRegistrations },
    { label: "Pending registrations", value: dashboard.data.pendingRegistrations }
  ];

  return (
    <>
      <section className="dashboard-grid organizer-stat-grid">
        {cards.map((card) => (
          <article className="feature-tile" key={card.label}>
            <span>{card.label}</span>
            <h3>{card.value}</h3>
          </article>
        ))}
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Recent tournaments</h2>
          <p>Continue editing drafts, manage categories, or review published tournament setup.</p>
        </div>
        {dashboard.data.recentTournaments.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No tournaments yet</h2>
            <p>Create a draft tournament to start setting up categories and registration details.</p>
            <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>
          </section>
        ) : (
          <div className="organizer-table">
            {dashboard.data.recentTournaments.map((tournament) => (
              <article className="organizer-table-row" key={tournament.id}>
                <div>
                  <span className={`status-pill ${tournament.status === "published" ? "status-pill-ready" : "status-pill-planned"}`}>
                    {formatLabel(tournament.status)}
                  </span>
                  <h3>{tournament.title}</h3>
                  <p>{tournament.sport.name} · {tournament.city.name} · {formatDateRange(tournament.startsAt, tournament.endsAt)}</p>
                </div>
                <div className="organizer-row-actions">
                  <a className="secondary-action" href={organizerTournamentEditRoute(tournament.id)}>Edit</a>
                  <a className="secondary-action" href={organizerTournamentCategoriesRoute(tournament.id)}>Categories</a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
