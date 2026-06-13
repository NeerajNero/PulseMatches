"use client";

import { FormEvent, useMemo } from "react";
import type {
  CreateOrganizerTournamentRequestDto,
  OrganizerTournamentDto,
  UpdateOrganizerTournamentRequestDto
} from "@matchflow/client-sdk";
import {
  formatDateInputValue,
  getDefaultDateInput,
  toIsoDateTime
} from "@/components/custom/organizer/organizer-format";
import { useCities, useSports } from "@/hooks/use-discovery";

interface OrganizerTournamentFormProps {
  initialTournament?: OrganizerTournamentDto;
  isPending: boolean;
  mode: "create" | "edit";
  onSubmit: (input: CreateOrganizerTournamentRequestDto | UpdateOrganizerTournamentRequestDto) => Promise<void>;
  submitLabel: string;
}

export function OrganizerTournamentForm({
  initialTournament,
  isPending,
  mode,
  onSubmit,
  submitLabel
}: Readonly<OrganizerTournamentFormProps>) {
  const sports = useSports();
  const cities = useCities();
  const defaults = useMemo(() => ({
    startsAt: initialTournament
      ? formatDateInputValue(initialTournament.startsAt)
      : getDefaultDateInput(14),
    endsAt: initialTournament
      ? formatDateInputValue(initialTournament.endsAt)
      : getDefaultDateInput(15),
    registrationOpensAt: initialTournament?.registrationOpensAt
      ? formatDateInputValue(initialTournament.registrationOpensAt)
      : "",
    registrationClosesAt: initialTournament?.registrationClosesAt
      ? formatDateInputValue(initialTournament.registrationClosesAt)
      : ""
  }), [initialTournament]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const maxParticipantsValue = String(form.get("maxParticipants") ?? "").trim();
    const registrationOpensAt = toIsoDateTime(form.get("registrationOpensAt"));
    const registrationClosesAt = toIsoDateTime(form.get("registrationClosesAt"));
    const basePayload = {
      title: String(form.get("title") ?? ""),
      shortDescription: String(form.get("shortDescription") ?? "") || undefined,
      description: String(form.get("description") ?? "") || undefined,
      sportId: String(form.get("sportId") ?? ""),
      cityId: String(form.get("cityId") ?? ""),
      startsAt: toIsoDateTime(form.get("startsAt")) ?? "",
      endsAt: toIsoDateTime(form.get("endsAt")) ?? "",
      registrationOpensAt,
      registrationClosesAt,
      maxParticipants: maxParticipantsValue ? Number(maxParticipantsValue) : undefined
    };

    await onSubmit(mode === "create"
      ? basePayload satisfies CreateOrganizerTournamentRequestDto
      : basePayload satisfies UpdateOrganizerTournamentRequestDto);
  }

  return (
    <form className="organizer-form" onSubmit={handleSubmit}>
      <label>
        <span>Tournament title</span>
        <input name="title" type="text" minLength={3} maxLength={220} required defaultValue={initialTournament?.title ?? ""} />
      </label>
      <label>
        <span>Short description</span>
        <input name="shortDescription" type="text" maxLength={300} defaultValue={initialTournament?.shortDescription ?? ""} />
      </label>
      <label>
        <span>Description</span>
        <textarea name="description" rows={5} maxLength={4000} defaultValue={initialTournament?.description ?? ""} />
      </label>
      <div className="organizer-form-grid">
        <label>
          <span>Sport</span>
          <select name="sportId" required defaultValue={initialTournament?.sport.id ?? ""}>
            <option value="">Select sport</option>
            {(sports.data ?? []).map((sport) => (
              <option key={sport.id} value={sport.id}>{sport.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>City</span>
          <select name="cityId" required defaultValue={initialTournament?.city.id ?? ""}>
            <option value="">Select city</option>
            {(cities.data ?? []).map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="organizer-form-grid">
        <label>
          <span>Starts at</span>
          <input name="startsAt" type="datetime-local" required defaultValue={defaults.startsAt} />
        </label>
        <label>
          <span>Ends at</span>
          <input name="endsAt" type="datetime-local" required defaultValue={defaults.endsAt} />
        </label>
      </div>
      <div className="organizer-form-grid">
        <label>
          <span>Registration opens</span>
          <input name="registrationOpensAt" type="datetime-local" defaultValue={defaults.registrationOpensAt} />
        </label>
        <label>
          <span>Registration closes</span>
          <input name="registrationClosesAt" type="datetime-local" defaultValue={defaults.registrationClosesAt} />
        </label>
      </div>
      <label>
        <span>Max participants</span>
        <input
          name="maxParticipants"
          type="number"
          min={1}
          inputMode="numeric"
          defaultValue={initialTournament?.maxParticipants ?? ""}
        />
      </label>
      <button className="primary-action form-action" type="submit" disabled={isPending || sports.isLoading || cities.isLoading}>
        {isPending ? "Saving" : submitLabel}
      </button>
    </form>
  );
}
