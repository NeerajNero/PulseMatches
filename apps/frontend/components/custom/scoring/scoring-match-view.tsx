"use client";

import { useEffect, useState } from "react";
import { useOrganizerFixtureResults, useUpdateMatchScore, useCompleteMatch } from "@/hooks/use-organizer-fixtures";
import { scoringFixtureRoute } from "@/utils/route";
import { formatLabel } from "@/components/custom/tournaments/tournament-format";

export function ScoringMatchView({
  matchId,
  fixtureSetId,
  tournamentId
}: Readonly<{
  matchId: string;
  fixtureSetId: string;
  tournamentId: string;
}>) {
  const fixtureSet = useOrganizerFixtureResults(tournamentId, fixtureSetId);
  const updateScore = useUpdateMatchScore(tournamentId, fixtureSetId);
  const completeMatch = useCompleteMatch(tournamentId, fixtureSetId);

  const match = fixtureSet.data?.rounds
    .flatMap(r => r.matches)
    .find(m => m.id === matchId);

  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (match) {
      const initialScores: Record<string, number> = {};
      match.entrants.forEach(e => {
        initialScores[e.id] = e.score ?? 0;
      });
      setScores(initialScores);
      setNotes(match.resultNotes ?? "");
    }
  }, [match]);

  if (fixtureSet.isLoading) return <main className="dashboard-shell"><p>Loading match...</p></main>;
  if (!match) return <main className="dashboard-shell"><p>Match not found.</p></main>;

  const entrants = match.entrants.filter(e => !e.isBye);

  const updateLocalScore = (entrantId: string, delta: number) => {
    setScores(prev => ({
      ...prev,
      [entrantId]: Math.max(0, (prev[entrantId] ?? 0) + delta)
    }));
  };

  const onAction = async (action: 'save' | 'complete') => {
    setIsSaving(true);
    setError(null);
    const payload = {
      scores: Object.entries(scores).map(([matchEntrantId, score]) => ({
        matchEntrantId,
        score
      })),
      winnerMatchEntrantId: action === 'complete' ? getWinnerId() : null,
      allowDraw: true, // Defaulting for MVP
      resultNotes: notes || null
    };

    try {
      if (action === 'complete') {
        await completeMatch.mutateAsync({ matchId, data: payload });
      } else {
        await updateScore.mutateAsync({ matchId, data: payload });
      }
      window.location.assign(scoringFixtureRoute(fixtureSetId, tournamentId));
    } catch (e) {
      setError("Failed to update match score.");
      setIsSaving(false);
    }
  };

  const getWinnerId = () => {
    if (entrants.length < 2) return null;
    const [e1, e2] = entrants;
    if (scores[e1.id] > (scores[e2.id] ?? 0)) return e1.id;
    if ((scores[e2.id] ?? 0) > scores[e1.id]) return e2.id;
    return null; // Draw
  };

  return (
    <main className="dashboard-shell scoring-workspace">
      <section className="dashboard-header" style={{ textAlign: 'center', position: 'relative' }}>
        <a 
          href={scoringFixtureRoute(fixtureSetId, tournamentId)} 
          style={{ position: 'absolute', left: 0, top: 0, fontSize: '14px', fontWeight: 700 }}
        >
          ← Back
        </a>
        <span className="eyebrow">Match {match.matchNumber} Scoring</span>
        <h1>{fixtureSet.data?.name}</h1>
        <p>{fixtureSet.data?.category.name}</p>
      </section>

      {error && <p className="form-error">{error}</p>}

      <section className="scoring-controls-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px 0' }}>
        {entrants.map((entrant, idx) => (
          <article key={entrant.id} className="organizer-panel" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <span className="eyebrow" style={{ color: idx === 0 ? 'var(--brand)' : 'var(--gold)' }}>
              {idx === 0 ? 'Side A' : 'Side B'}
            </span>
            <h2 style={{ fontSize: '24px', margin: '8px 0 24px' }}>{entrant.displayName}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
              <button 
                className="secondary-action" 
                style={{ width: '64px', height: '64px', fontSize: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => updateLocalScore(entrant.id, -1)}
              >
                -
              </button>
              
              <span style={{ fontSize: '64px', fontWeight: 900, minWidth: '80px', color: 'var(--foreground)' }}>
                {scores[entrant.id] ?? 0}
              </span>
              
              <button 
                className="primary-action" 
                style={{ width: '64px', height: '64px', fontSize: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => updateLocalScore(entrant.id, 1)}
              >
                +
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="organizer-panel" style={{ margin: '0 20px 40px' }}>
        <label>
          <span>Match Notes</span>
          <textarea 
            placeholder="Injuries, timeouts, or specific match events..."
            rows={3}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
      </section>

      <footer style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        background: 'var(--background)', 
        borderTop: '1px solid var(--line)',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        zIndex: 100
      }}>
        <a className="secondary-action" href={scoringFixtureRoute(fixtureSetId, tournamentId)} style={{ flex: 1, textAlign: 'center' }}>
          Cancel
        </a>
        <button 
          className="secondary-action" 
          style={{ flex: 1 }}
          disabled={isSaving}
          onClick={() => onAction('save')}
        >
          {isSaving ? '...' : 'Save'}
        </button>
        <button 
          className="primary-action" 
          style={{ flex: 2 }}
          disabled={isSaving}
          onClick={() => onAction('complete')}
        >
          {isSaving ? 'Completing...' : 'Complete Match'}
        </button>
      </footer>
      <div style={{ height: '100px' }} aria-hidden="true" />
    </main>
  );
}
