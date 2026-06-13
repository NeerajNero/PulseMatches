"use client";

import { useState } from "react";
import type { FixtureMatchDto, RoundRobinStandingDto, UpdateMatchScoreRequestDto } from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import {
  useCompleteMatch,
  useOrganizerFixtureResults,
  usePublishFixtureResults,
  useReopenMatch,
  useUnpublishFixtureResults,
  useUpdateMatchScore
} from "@/hooks/use-organizer-fixtures";
import { useOrganizerTournament } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { organizerTournamentFixtureRoute, organizerTournamentFixturesRoute } from "@/utils/route";

export function OrganizerFixtureScoringView({
  fixtureSetId,
  id
}: Readonly<{
  fixtureSetId: string;
  id: string;
}>) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const fixtureSet = useOrganizerFixtureResults(id, fixtureSetId);
  const updateMatchScore = useUpdateMatchScore(id, fixtureSetId);
  const completeMatch = useCompleteMatch(id, fixtureSetId);
  const reopenMatch = useReopenMatch(id, fixtureSetId);
  const publishFixtureResults = usePublishFixtureResults(id, tournament.data?.slug);
  const unpublishFixtureResults = useUnpublishFixtureResults(id, tournament.data?.slug);

  async function submitMatchScore(match: FixtureMatchDto, form: HTMLFormElement, action: "save" | "complete") {
    setMessage(null);
    setError(null);
    const payload = readScoreForm(match, form);
    try {
      if (action === "complete") {
        await completeMatch.mutateAsync({ matchId: match.id, data: payload });
        setMessage(`Match ${match.matchNumber} completed.`);
      } else {
        await updateMatchScore.mutateAsync({ matchId: match.id, data: payload });
        setMessage(`Match ${match.matchNumber} scores saved.`);
      }
    } catch (scoreError) {
      setError(await getApiErrorMessage(scoreError, "Unable to save match score."));
    }
  }

  async function onReopen(match: FixtureMatchDto) {
    setMessage(null);
    setError(null);
    try {
      await reopenMatch.mutateAsync(match.id);
      setMessage(`Match ${match.matchNumber} reopened.`);
    } catch (reopenError) {
      setError(await getApiErrorMessage(reopenError, "Unable to reopen match."));
    }
  }

  async function onPublish() {
    setMessage(null);
    setError(null);
    try {
      await publishFixtureResults.mutateAsync(fixtureSetId);
      setMessage("Fixture set is now visible publicly.");
    } catch (publishError) {
      setError(await getApiErrorMessage(publishError, "Unable to publish fixture results."));
    }
  }

  async function onUnpublish() {
    setMessage(null);
    setError(null);
    try {
      await unpublishFixtureResults.mutateAsync(fixtureSetId);
      setMessage("Fixture set is hidden from public results.");
    } catch (unpublishError) {
      setError(await getApiErrorMessage(unpublishError, "Unable to hide fixture results."));
    }
  }

  if (tournament.isLoading || fixtureSet.isLoading) {
    return <p className="state-text compact-state">Loading scoring view.</p>;
  }

  if (tournament.isError || !tournament.data || fixtureSet.isError || !fixtureSet.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Fixture set not found</h2>
        <p>This fixture set may not exist or may belong to another organizer.</p>
        <a className="secondary-action" href={organizerTournamentFixturesRoute(id)}>Back to fixtures</a>
      </section>
    );
  }

  const fixture = fixtureSet.data;
  const tournamentData = tournament.data;
  const isArchived = fixture.status === "archived";
  const isPublic = Boolean(fixture.publishedAt);

  return (
    <section className="organizer-editor-grid">
      <article className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>{fixture.name ?? `${formatLabel(fixture.format)} scoring`}</h2>
          <p>
            {tournamentData.title} · {fixture.category.name} · {formatLabel(fixture.entrantType)}
          </p>
        </div>
        <OrganizerTournamentManagementNav id={id} />

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="roster-stat-grid fixture-stat-grid">
          <article>
            <span>Format</span>
            <strong>{formatLabel(fixture.format)}</strong>
          </article>
          <article>
            <span>Status</span>
            <strong>{formatLabel(fixture.status)}</strong>
          </article>
          <article>
            <span>Matches</span>
            <strong>{fixture.matchCount}</strong>
          </article>
          <article>
            <span>Completed</span>
            <strong>{fixture.rounds.flatMap((round) => round.matches).filter((match) => match.status === "completed").length}</strong>
          </article>
          <article>
            <span>Public</span>
            <strong>{isPublic ? "Visible" : "Hidden"}</strong>
          </article>
        </div>

        <div className="organizer-row-actions fixture-detail-actions">
          <a className="secondary-action" href={organizerTournamentFixtureRoute(id, fixtureSetId)}>Fixture detail</a>
          <a className="secondary-action" href={organizerTournamentFixturesRoute(id)}>All fixture sets</a>
          {!isArchived && !isPublic ? (
            <button
              className="secondary-action"
              disabled={publishFixtureResults.isPending}
              type="button"
              onClick={() => void onPublish()}
            >
              Publish results
            </button>
          ) : null}
          {!isArchived && isPublic ? (
            <button
              className="secondary-action"
              disabled={unpublishFixtureResults.isPending}
              type="button"
              onClick={() => void onUnpublish()}
            >
              Hide results
            </button>
          ) : null}
        </div>

        <p className="state-text compact-state">
          {isPublic
            ? `Public since ${formatDateTime(fixture.publishedAt ?? "")}. Public pages show schedules, scores, winners, and standings only.`
            : "Publish results when this fixture set is ready for public read-only display."}
        </p>

        {isArchived ? (
          <p className="state-text compact-state">Archived fixture sets are read-only for scoring.</p>
        ) : null}

        {fixture.standings.length > 0 ? <RoundRobinStandings standings={fixture.standings} /> : null}

        <section className="fixture-round-list" aria-label="Scoring rounds">
          {fixture.rounds.map((round) => (
            <article className="fixture-round-panel" key={round.id}>
              <div className="section-heading organizer-section-heading">
                <h3>{round.name}</h3>
                <p>{formatLabel(round.stage)} · {round.matches.length} matches</p>
              </div>
              <div className="fixture-match-list">
                {round.matches.map((match) => (
                  <article className="fixture-match-card" key={match.id}>
                    <div className="fixture-match-summary">
                      <div>
                        <span className={`status-pill ${getStatusTone(match.status)}`}>{formatLabel(match.status)}</span>
                        <h4>Match {match.matchNumber}</h4>
                        <p>{formatEntrantsWithScores(match)}</p>
                      </div>
                      <div>
                        <p>{match.completedAt ? `Completed ${formatDateTime(match.completedAt)}` : match.scheduledAt ? formatDateTime(match.scheduledAt) : "Unscheduled"}</p>
                        <p>{formatWinner(match)}</p>
                      </div>
                    </div>
                    {match.resultNotes ? <p className="state-text compact-state">{match.resultNotes}</p> : null}
                    <ScoreForm
                      fixtureFormat={fixture.format}
                      isArchived={isArchived}
                      isPending={updateMatchScore.isPending || completeMatch.isPending || reopenMatch.isPending}
                      match={match}
                      onReopen={() => void onReopen(match)}
                      onSubmit={(form, action) => void submitMatchScore(match, form, action)}
                    />
                  </article>
                ))}
              </div>
            </article>
          ))}
        </section>
      </article>
    </section>
  );
}

function RoundRobinStandings({ standings }: Readonly<{ standings: RoundRobinStandingDto[] }>) {
  return (
    <section className="fixture-standings-panel" aria-label="Round robin standings">
      <div className="section-heading organizer-section-heading">
        <h3>Standings</h3>
        <p>Calculated from completed round-robin matches.</p>
      </div>
      <div className="table-scroll">
        <table className="standings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Entrant</th>
              <th>Played</th>
              <th>Wins</th>
              <th>Draws</th>
              <th>Losses</th>
              <th>Points</th>
              <th>For</th>
              <th>Against</th>
              <th>Diff</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing, index) => (
              <tr key={standing.entrantId}>
                <td>{index + 1}</td>
                <td>{standing.displayName}</td>
                <td>{standing.played}</td>
                <td>{standing.wins}</td>
                <td>{standing.draws}</td>
                <td>{standing.losses}</td>
                <td>{standing.points}</td>
                <td>{standing.scoreFor}</td>
                <td>{standing.scoreAgainst}</td>
                <td>{standing.scoreDifference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScoreForm({
  fixtureFormat,
  isArchived,
  isPending,
  match,
  onReopen,
  onSubmit
}: Readonly<{
  fixtureFormat: string;
  isArchived: boolean;
  isPending: boolean;
  match: FixtureMatchDto;
  onReopen: () => void;
  onSubmit: (form: HTMLFormElement, action: "save" | "complete") => void;
}>) {
  const realEntrants = match.entrants.filter((entrant) => !entrant.isBye);
  const canEdit = !isArchived && match.status !== "cancelled";
  const canComplete = canEdit && match.status !== "completed";
  const canReopen = !isArchived && match.status === "completed";

  return (
    <form
      className="organizer-form match-score-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event.currentTarget, "save");
      }}
    >
      <div className="score-entry-grid">
        {realEntrants.length > 0 ? realEntrants.map((entrant) => (
          <label key={entrant.id}>
            <span>{entrant.displayName}</span>
            <input
              name={`score:${entrant.id}`}
              type="number"
              min={0}
              step={1}
              defaultValue={entrant.score ?? 0}
              disabled={!canEdit}
            />
          </label>
        )) : (
          <p className="state-text compact-state">No real entrants are assigned to this match.</p>
        )}
      </div>
      <label>
        <span>Winner</span>
        <select name="winnerMatchEntrantId" defaultValue={match.winnerMatchEntrantId ?? ""} disabled={!canEdit}>
          <option value="">No winner selected</option>
          {realEntrants.map((entrant) => (
            <option key={entrant.id} value={entrant.id}>{entrant.displayName}</option>
          ))}
        </select>
      </label>
      {fixtureFormat === "round_robin" ? (
        <label className="checkbox-row">
          <input name="allowDraw" type="checkbox" disabled={!canEdit} />
          <span>Allow draw when scores are tied</span>
        </label>
      ) : null}
      <label>
        <span>Result notes</span>
        <textarea name="resultNotes" rows={2} maxLength={500} defaultValue={match.resultNotes ?? ""} disabled={!canEdit} />
      </label>
      <div className="organizer-row-actions">
        <button className="secondary-action form-action" type="submit" disabled={!canEdit || isPending}>
          {isPending ? "Saving" : "Save scores"}
        </button>
        <button
          className="primary-action form-action"
          type="button"
          disabled={!canComplete || isPending || realEntrants.length === 0}
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form) {
              onSubmit(form, "complete");
            }
          }}
        >
          Complete match
        </button>
        {canReopen ? (
          <button className="secondary-action form-action" type="button" disabled={isPending} onClick={onReopen}>
            Reopen
          </button>
        ) : null}
      </div>
    </form>
  );
}

function readScoreForm(match: FixtureMatchDto, form: HTMLFormElement): UpdateMatchScoreRequestDto {
  const data = new FormData(form);
  const scores = match.entrants
    .filter((entrant) => !entrant.isBye)
    .map((entrant) => ({
      matchEntrantId: entrant.id,
      score: Math.max(0, Number.parseInt(String(data.get(`score:${entrant.id}`) ?? "0"), 10) || 0)
    }));
  const winnerMatchEntrantId = String(data.get("winnerMatchEntrantId") ?? "").trim();
  const resultNotes = String(data.get("resultNotes") ?? "").trim();
  return {
    scores,
    winnerMatchEntrantId: winnerMatchEntrantId || null,
    allowDraw: data.get("allowDraw") === "on",
    resultNotes: resultNotes || null
  };
}

function formatEntrantsWithScores(match: FixtureMatchDto) {
  return match.entrants
    .sort((first, second) => first.slotNumber - second.slotNumber)
    .map((entrant) => {
      if (entrant.isBye) {
        return "BYE";
      }
      return `${entrant.displayName}${entrant.score === undefined || entrant.score === null ? "" : ` (${entrant.score})`}`;
    })
    .join(" vs ");
}

function formatWinner(match: FixtureMatchDto) {
  const winner = match.entrants.find((entrant) => entrant.id === match.winnerMatchEntrantId);
  if (winner) {
    return `Winner: ${winner.displayName}`;
  }
  if (match.status === "completed") {
    return "Completed as draw";
  }
  return "Winner not set";
}
