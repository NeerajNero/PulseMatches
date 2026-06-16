"use client";

import { useOrganizerTournament } from "@/hooks/use-organizer-tournaments";
import { useOrganizerReportSummary } from "@/hooks/use-organizer-rosters";
import { useOrganizerFixtures } from "@/hooks/use-organizer-fixtures";
import { ROUTES, scoringFixtureRoute } from "@/utils/route";
import { formatDateRange, formatLabel } from "@/components/custom/tournaments/tournament-format";

export function ScoringTournamentView({ id }: Readonly<{ id: string }>) {
  const tournament = useOrganizerTournament(id);
  const roster = useOrganizerReportSummary(id, {});
  const fixtures = useOrganizerFixtures(id);

  if (tournament.isLoading || roster.isLoading || fixtures.isLoading) {
    return <main className="dashboard-shell"><p>Loading tournament details...</p></main>;
  }

  if (tournament.isError || !tournament.data) {
    return (
      <main className="dashboard-shell">
        <section className="empty-state">
          <h2>Tournament not found</h2>
          <a className="primary-action" href="/scoring">Back to Scoring</a>
        </section>
      </main>
    );
  }

  const t = tournament.data;

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header" style={{ position: 'relative' }}>
        <a 
          href="/scoring" 
          style={{ position: 'absolute', right: 0, top: 0, fontSize: '14px', fontWeight: 700 }}
        >
          ← Control Center
        </a>
        <div>
          <span className="eyebrow">Scoring</span>
          <h1>{t.title}</h1>
          <p>{t.sport.name} · {t.venue?.name ?? t.city.name} · {formatDateRange(t.startsAt, t.endsAt)}</p>
        </div>
      </section>

      <section className="dashboard-grid organizer-stat-grid">
        <article className="feature-tile" style={{ borderTop: '4px solid var(--brand)' }}>
          <span>Total Matches</span>
          <h3>{(roster.data?.fixtureCount ?? 0) * 2}</h3>
        </article>
        <article className="feature-tile" style={{ borderTop: '4px solid var(--ready)' }}>
          <span>Scored</span>
          <h3>{roster.data?.completedMatchCount ?? 0}</h3>
        </article>
        <article className="feature-tile" style={{ borderTop: '4px solid var(--gold)' }}>
          <span>Remaining</span>
          <h3>{((roster.data?.fixtureCount ?? 0) * 2) - (roster.data?.completedMatchCount ?? 0)}</h3>
        </article>
        <article className="feature-tile">
          <span>Participants</span>
          <h3>{roster.data?.participantCount ?? 0}</h3>
        </article>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Fixture Sets</h2>
          <p>Select a fixture set to start or resume match scoring.</p>
        </div>

        {(fixtures.data ?? []).length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No fixtures generated</h2>
            <p>Go to tournament management to generate fixtures for your categories.</p>
            <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Manage Tournament</a>
          </section>
        ) : (
          <div className="organizer-table">
            {(fixtures.data ?? []).map((fixture) => (
              <article className="organizer-table-row" key={fixture.id} style={{ padding: '20px' }}>
                <div>
                  <span className="status-pill status-pill-info">{formatLabel(fixture.format)}</span>
                  <h3 style={{ marginTop: '8px' }}>{fixture.name ?? "Tournament Fixtures"}</h3>
                  <p>{fixture.category.name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{fixture.matchCount} total matches</p>
                </div>
                <div className="organizer-row-actions">
                  <a className="primary-action" href={scoringFixtureRoute(fixture.id, id)}>
                    Enter Scores
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
