"use client";

import { FormEvent, useState } from "react";
import {
  FixtureMatchDto,
  UpdateMatchScheduleRequestDto,
  UpdateMatchScheduleRequestDtoStatusEnum
} from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { formatDateInputValue, getStatusTone } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import {
  useArchiveFixtureSet,
  useOrganizerFixtureSet,
  usePublishFixtureResults,
  useUnpublishFixtureResults,
  useUpdateMatchSchedule
} from "@/hooks/use-organizer-fixtures";
import { useOrganizerTournament } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import {
  organizerTournamentFixtureScoringRoute,
  organizerTournamentFixturesRoute,
  scoringFixtureRoute
} from "@/utils/route";

export function OrganizerFixtureDetailView({
  fixtureSetId,
  id
}: Readonly<{
  fixtureSetId: string;
  id: string;
}>) {
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const fixtureSet = useOrganizerFixtureSet(id, fixtureSetId);
  const updateMatchSchedule = useUpdateMatchSchedule(id, fixtureSetId);
  const archiveFixtureSet = useArchiveFixtureSet(id);
  const publishFixtureResults = usePublishFixtureResults(id, tournament.data?.slug);
  const unpublishFixtureResults = useUnpublishFixtureResults(id, tournament.data?.slug);

  async function onSchedule(matchId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await updateMatchSchedule.mutateAsync({
        matchId,
        data: readScheduleForm(event.currentTarget)
      });
      setEditingMatchId(null);
      setMessage("Match schedule updated.");
    } catch (scheduleError) {
      setError(await getApiErrorMessage(scheduleError, "Unable to update match schedule."));
    }
  }

  async function onArchive() {
    if (!window.confirm("Archive this fixture set? This does not delete stored matches.")) {
      return;
    }
    setMessage(null);
    setError(null);
    try {
      await archiveFixtureSet.mutateAsync(fixtureSetId);
      setMessage("Fixture set archived.");
    } catch (archiveError) {
      setError(await getApiErrorMessage(archiveError, "Unable to archive fixture set."));
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
    return <p className="state-text compact-state">Loading fixture set.</p>;
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
          <h2>{fixture.name ?? `${formatLabel(fixture.format)} fixtures`}</h2>
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
            <span>Scheduled</span>
            <strong>{fixture.scheduledMatchCount}</strong>
          </article>
          <article>
            <span>Public</span>
            <strong>{fixture.publishedAt ? "Visible" : "Hidden"}</strong>
          </article>
        </div>

        <div className="organizer-row-actions fixture-detail-actions">
          <a className="secondary-action" href={organizerTournamentFixturesRoute(id)}>All fixture sets</a>
          <a className="primary-action" href={organizerTournamentFixtureScoringRoute(id, fixtureSetId)}>Score matches</a>
          <a className="primary-action" href={scoringFixtureRoute(fixtureSetId, id)} style={{ background: 'var(--gold)', color: 'black' }}>Open in Scoring App</a>
          <ExportCsvButton path={`/organizer/tournaments/${id}/fixtures/${fixtureSetId}/results/export.csv`} />
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
          {!isArchived ? (
            <button className="secondary-action" disabled={archiveFixtureSet.isPending} type="button" onClick={() => void onArchive()}>
              Archive fixture set
            </button>
          ) : null}
        </div>

        <p className="state-text compact-state">
          {isPublic
            ? `Public since ${formatDateTime(fixture.publishedAt ?? "")}. Public pages exclude private notes and contact details.`
            : "This fixture set is hidden from public tournament pages until results are published."}
        </p>

        {fixture.rounds.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No rounds generated</h2>
            <p>Archive this fixture set and generate a replacement if needed.</p>
          </section>
        ) : null}

        <section className="fixture-round-list" aria-label="Fixture rounds">
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
                        <p>{formatEntrants(match)}</p>
                      </div>
                      <div>
                        <p>{match.scheduledAt ? formatDateTime(match.scheduledAt) : "Unscheduled"}</p>
                        <p>{[match.venueName, match.courtName].filter(Boolean).join(" · ") || "Venue not assigned"}</p>
                        <p>{formatMatchResult(match)}</p>
                      </div>
                    </div>
                    {match.notes ? <p className="state-text compact-state">{match.notes}</p> : null}
                    {match.resultNotes ? <p className="state-text compact-state">{match.resultNotes}</p> : null}
                    {editingMatchId === match.id ? (
                      <ScheduleForm
                        isPending={updateMatchSchedule.isPending}
                        match={match}
                        onCancel={() => setEditingMatchId(null)}
                        onSubmit={(event) => void onSchedule(match.id, event)}
                      />
                    ) : (
                      <button
                        className="secondary-action"
                        disabled={fixture.status === "archived"}
                        type="button"
                        onClick={() => setEditingMatchId(match.id)}
                      >
                        Edit schedule
                      </button>
                    )}
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

function ScheduleForm({
  isPending,
  match,
  onCancel,
  onSubmit
}: Readonly<{
  isPending: boolean;
  match: FixtureMatchDto;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}>) {
  return (
    <form className="organizer-form match-schedule-form" onSubmit={onSubmit}>
      <label>
        <span>Date and time</span>
        <input name="scheduledAt" type="datetime-local" defaultValue={formatDateInputValue(match.scheduledAt)} />
      </label>
      <label>
        <span>Status</span>
        <select name="status" defaultValue={match.status.toUpperCase() as UpdateMatchScheduleRequestDtoStatusEnum}>
          <option value={UpdateMatchScheduleRequestDtoStatusEnum.Unscheduled}>Unscheduled</option>
          <option value={UpdateMatchScheduleRequestDtoStatusEnum.Scheduled}>Scheduled</option>
          <option value={UpdateMatchScheduleRequestDtoStatusEnum.Postponed}>Postponed</option>
          <option value={UpdateMatchScheduleRequestDtoStatusEnum.Cancelled}>Cancelled</option>
        </select>
      </label>
      <label>
        <span>Venue or ground</span>
        <input name="venueName" type="text" maxLength={180} defaultValue={match.venueName ?? ""} />
      </label>
      <label>
        <span>Court or field</span>
        <input name="courtName" type="text" maxLength={120} defaultValue={match.courtName ?? ""} />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" maxLength={500} rows={3} defaultValue={match.notes ?? ""} />
      </label>
      <div className="organizer-row-actions">
        <button className="primary-action form-action" type="submit" disabled={isPending}>
          {isPending ? "Saving" : "Save schedule"}
        </button>
        <button className="secondary-action form-action" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function readScheduleForm(form: HTMLFormElement): UpdateMatchScheduleRequestDto {
  const data = new FormData(form);
  const scheduledAt = String(data.get("scheduledAt") ?? "").trim();
  const venueName = String(data.get("venueName") ?? "").trim();
  const courtName = String(data.get("courtName") ?? "").trim();
  const notes = String(data.get("notes") ?? "").trim();
  return {
    scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    venueName: venueName || null,
    courtName: courtName || null,
    notes: notes || null,
    status: String(data.get("status") ?? UpdateMatchScheduleRequestDtoStatusEnum.Unscheduled) as UpdateMatchScheduleRequestDtoStatusEnum
  };
}

function formatEntrants(match: FixtureMatchDto) {
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

function formatMatchResult(match: FixtureMatchDto) {
  const winner = match.entrants.find((entrant) => entrant.id === match.winnerMatchEntrantId);
  if (winner) {
    return `Winner: ${winner.displayName}`;
  }
  if (match.status === "completed") {
    return "Completed as draw";
  }
  return "Result not entered";
}
