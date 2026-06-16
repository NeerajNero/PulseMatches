"use client";

import { useOrganizerFixtureResults } from "@/hooks/use-organizer-fixtures";
import { useOrganizerTournament } from "@/hooks/use-organizer-tournaments";
import { scoringMatchRoute, scoringTournamentRoute } from "@/utils/route";
import { formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";

export function ScoringFixtureView({ 
  fixtureSetId, 
  tournamentId 
}: Readonly<{ 
  fixtureSetId: string; 
  tournamentId: string; 
}>) {
  const tournament = useOrganizerTournament(tournamentId);
  const fixtureSet = useOrganizerFixtureResults(tournamentId, fixtureSetId);

  if (tournament.isLoading || fixtureSet.isLoading) {
    return <main className="dashboard-shell"><p>Loading fixtures...</p></main>;
  }

  if (fixtureSet.isError || !fixtureSet.data) {
    return (
      <main className="dashboard-shell">
        <section className="empty-state">
          <h2>Fixture set not found</h2>
          <a className="primary-action" href={scoringTournamentRoute(tournamentId)}>Back to Tournament</a>
        </section>
      </main>
    );
  }

  const fixture = fixtureSet.data;

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header" style={{ position: 'relative' }}>
        <a 
          href={scoringTournamentRoute(tournamentId)} 
          style={{ position: 'absolute', right: 0, top: 0, fontSize: '14px', fontWeight: 700 }}
        >
          ← Tournament Home
        </a>
        <div>
          <span className="eyebrow">{tournament.data?.title ?? "Tournament"}</span>
          <h1>{fixture.name ?? "Fixture Scoring"}</h1>
          <p>{fixture.category.name} · {formatLabel(fixture.format)}</p>
        </div>
      </section>

      {fixture.rounds.map((round) => (
        <section className="organizer-panel" key={round.id}>
          <div className="section-heading organizer-section-heading">
            <h3>{round.name}</h3>
            <p>{round.matches.length} matches</p>
          </div>
          <div className="organizer-table">
            {round.matches.map((match) => (
              <article className="organizer-table-row" key={match.id} style={{ padding: '16px' }}>
                <div style={{ flex: 1 }}>
                  <span className={`status-pill ${getStatusTone(match.status)}`} style={{ marginBottom: '8px' }}>
                    {formatLabel(match.status)}
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <div style={{ flex: 1 }}>
                       {match.entrants.map((e, idx) => (
                         <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: idx === 0 ? '1px solid var(--line)' : 'none' }}>
                           <span style={{ fontWeight: e.score !== null ? 700 : 400, fontSize: '18px' }}>{e.displayName}</span>
                           <span style={{ fontWeight: 900, color: 'var(--brand)', fontSize: '20px' }}>{e.score ?? '-'}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
                <div className="organizer-row-actions" style={{ marginLeft: '16px' }}>
                  <a 
                    className={match.status === 'completed' ? "secondary-action" : "primary-action"} 
                    href={scoringMatchRoute(match.id, fixtureSetId, tournamentId)}
                  >
                    {match.status === 'completed' ? 'Edit Score' : 'Score Match'}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
