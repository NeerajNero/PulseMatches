"use client";

import { useOrganizerTournaments } from "@/hooks/use-organizer-tournaments";
import { ROUTES, scoringTournamentRoute } from "@/utils/route";
import { formatDateRange, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";

export function ScoringHomeView() {
  const tournaments = useOrganizerTournaments({ limit: 20 });

  if (tournaments.isLoading) {
    return <main className="dashboard-shell"><p>Loading scoring dashboard...</p></main>;
  }

  const activeTournaments = tournaments.data?.items.filter(t => t.status === 'published') ?? [];

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Match-Day Operations</span>
          <h1>Scoring Control Center</h1>
          <p>Live tournament scoring and match management.</p>
        </div>
        <div className="organizer-header-actions">
          <a className="secondary-action" href={ROUTES.ORGANIZER_DASHBOARD}>Organizer Dashboard</a>
        </div>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Active Tournaments</h2>
          <p>Select a published tournament to manage live scoring and fixtures.</p>
        </div>

        {activeTournaments.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No active tournaments</h2>
            <p>Publish a tournament from your dashboard to enable live scoring.</p>
            <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Manage Tournaments</a>
          </section>
        ) : (
          <div className="organizer-table">
            {activeTournaments.map((tournament) => (
              <article className="organizer-table-row" key={tournament.id} style={{ padding: '20px' }}>
                <div>
                  <span className={`status-pill ${getStatusTone(tournament.status)}`}>{formatLabel(tournament.status)}</span>
                  <h3 style={{ marginTop: '8px' }}>{tournament.title}</h3>
                  <p>{tournament.sport.name} · {tournament.city.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{formatDateRange(tournament.startsAt, tournament.endsAt)}</p>
                </div>
                <div className="organizer-row-actions">
                  <a className="primary-action" href={scoringTournamentRoute(tournament.id)}>
                    Open Scoring
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Recent & Upcoming</h2>
          <p>Quick access to recent tournament activity.</p>
        </div>
        <div className="dashboard-grid">
           <a className="feature-tile browse-tile" href={ROUTES.ORGANIZER_TOURNAMENTS}>
             <span>Management</span>
             <h2>All Tournaments</h2>
             <p>View draft and archived events.</p>
           </a>
           <a className="feature-tile browse-tile" href={ROUTES.ORGANIZER_DASHBOARD}>
             <span>Dashboard</span>
             <h2>Back to Admin</h2>
             <p>Manage registrations and payments.</p>
           </a>
        </div>
      </section>
    </main>
  );
}
