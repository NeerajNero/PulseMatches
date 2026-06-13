"use client";

import { useState } from "react";
import type { CreateOrganizerTournamentRequestDto, UpdateOrganizerTournamentRequestDto } from "@matchflow/client-sdk";
import { OrganizerTournamentForm } from "@/components/custom/organizer/organizer-tournament-form";
import { useCreateOrganizerTournament } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { organizerTournamentEditRoute } from "@/utils/route";

export function OrganizerTournamentCreateView() {
  const createTournament = useCreateOrganizerTournament();
  const [error, setError] = useState<string | null>(null);

  async function submit(input: CreateOrganizerTournamentRequestDto | UpdateOrganizerTournamentRequestDto) {
    setError(null);
    try {
      const tournament = await createTournament.mutateAsync(input as CreateOrganizerTournamentRequestDto);
      if (tournament) {
        window.location.assign(organizerTournamentEditRoute(tournament.id));
      }
    } catch (submitError) {
      setError(await getApiErrorMessage(submitError, "Unable to create tournament."));
    }
  }

  return (
    <section className="organizer-panel organizer-form-panel">
      <div className="section-heading organizer-section-heading">
        <h2>Create draft tournament</h2>
        <p>Drafts are visible only in your organizer workspace until explicitly published.</p>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <OrganizerTournamentForm
        mode="create"
        isPending={createTournament.isPending}
        submitLabel="Create draft"
        onSubmit={submit}
      />
    </section>
  );
}
