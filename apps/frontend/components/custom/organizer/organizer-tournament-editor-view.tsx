"use client";

import { useState } from "react";
import type { CreateOrganizerTournamentRequestDto, UpdateOrganizerTournamentRequestDto } from "@matchflow/client-sdk";
import { OrganizerTournamentForm } from "@/components/custom/organizer/organizer-tournament-form";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { formatDateRange, formatLabel } from "@/components/custom/tournaments/tournament-format";
import {
  useOrganizerTournament,
  usePublishTournament,
  useUnpublishTournament,
  useUpdateOrganizerTournament
} from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import {
  organizerTournamentCategoriesRoute,
  ROUTES,
  tournamentDetailRoute
} from "@/utils/route";

export function OrganizerTournamentEditorView({ id }: Readonly<{ id: string }>) {
  const tournament = useOrganizerTournament(id);
  const updateTournament = useUpdateOrganizerTournament(id);
  const publishTournament = usePublishTournament(id);
  const unpublishTournament = useUnpublishTournament(id);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (tournament.isLoading) {
    return <p className="state-text compact-state">Loading tournament.</p>;
  }

  if (tournament.isError || !tournament.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Tournament not found</h2>
        <p>This tournament may not exist or may belong to another organizer.</p>
        <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Back to tournaments</a>
      </section>
    );
  }

  async function submit(input: CreateOrganizerTournamentRequestDto | UpdateOrganizerTournamentRequestDto) {
    setError(null);
    setSuccess(null);
    try {
      await updateTournament.mutateAsync(input);
      setSuccess("Tournament draft saved.");
    } catch (submitError) {
      setError(await getApiErrorMessage(submitError, "Unable to save tournament."));
    }
  }

  async function publish() {
    setError(null);
    setSuccess(null);
    try {
      await publishTournament.mutateAsync();
      setSuccess("Tournament published.");
    } catch (publishError) {
      setError(await getApiErrorMessage(publishError, "Unable to publish tournament."));
    }
  }

  async function unpublish() {
    setError(null);
    setSuccess(null);
    try {
      await unpublishTournament.mutateAsync();
      setSuccess("Tournament moved back to draft.");
    } catch (unpublishError) {
      setError(await getApiErrorMessage(unpublishError, "Unable to unpublish tournament."));
    }
  }

  return (
    <section className="organizer-editor-grid">
      <article className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Tournament setup</h2>
          <p>Slug: {tournament.data.slug}</p>
        </div>
        <OrganizerTournamentManagementNav id={tournament.data.id} />
        {success ? <p className="form-success">{success}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <OrganizerTournamentForm
          mode="edit"
          initialTournament={tournament.data}
          isPending={updateTournament.isPending}
          submitLabel="Save tournament"
          onSubmit={submit}
        />
      </article>

      <aside className="organizer-side-panel">
        <article className="feature-tile organizer-action-card">
          <span>Status</span>
          <h3>{formatLabel(tournament.data.status)}</h3>
          <p>{formatDateRange(tournament.data.startsAt, tournament.data.endsAt)}</p>
          <p>{tournament.data.categories.filter((category) => category.status === "active").length} active categories</p>
        </article>
        <div className="organizer-side-actions">
          <a className="secondary-action" href={organizerTournamentCategoriesRoute(tournament.data.id)}>
            Manage categories
          </a>
          {tournament.data.status === "published" ? (
            <>
              <a className="secondary-action" href={tournamentDetailRoute(tournament.data.slug)}>
                Public page
              </a>
              <button
                className="secondary-action"
                type="button"
                disabled={unpublishTournament.isPending}
                onClick={() => void unpublish()}
              >
                {unpublishTournament.isPending ? "Unpublishing" : "Unpublish"}
              </button>
            </>
          ) : (
            <button
              className="primary-action"
              type="button"
              disabled={publishTournament.isPending}
              onClick={() => void publish()}
            >
              {publishTournament.isPending ? "Publishing" : "Publish"}
            </button>
          )}
        </div>
      </aside>
    </section>
  );
}
