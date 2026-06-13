"use client";

import { FormEvent, useState } from "react";
import {
  OrganizerParticipantDto,
  OrganizerRostersControllerFindParticipantsStatusEnum,
  UpdateParticipantRequestDtoStatusEnum
} from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import {
  useCreateParticipant,
  useDeleteParticipant,
  useOrganizerParticipants,
  useUpdateParticipant
} from "@/hooks/use-organizer-rosters";
import { useOrganizerTournament, useTournamentCategories } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";

export function OrganizerParticipantManagementView({ id }: Readonly<{ id: string }>) {
  const [filters, setFilters] = useState({ categoryId: "", search: "", status: "" });
  const [editingParticipant, setEditingParticipant] = useState<OrganizerParticipantDto | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const categories = useTournamentCategories(id);
  const participants = useOrganizerParticipants(id, {
    categoryId: filters.categoryId,
    search: filters.search,
    status: filters.status as OrganizerRostersControllerFindParticipantsStatusEnum | ""
  });
  const createParticipant = useCreateParticipant(id);
  const updateParticipant = useUpdateParticipant(id);
  const deleteParticipant = useDeleteParticipant(id);

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      categoryId: String(form.get("categoryId") ?? ""),
      search: String(form.get("search") ?? ""),
      status: String(form.get("status") ?? "")
    });
  }

  async function saveParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const input = readParticipantForm(event.currentTarget);
    try {
      if (editingParticipant) {
        const status = String(new FormData(event.currentTarget).get("status") ?? UpdateParticipantRequestDtoStatusEnum.Active) as UpdateParticipantRequestDtoStatusEnum;
        const data = editingParticipant.source === "registration" ? { status } : { ...input, status };
        await updateParticipant.mutateAsync({
          participantId: editingParticipant.id,
          data
        });
        setEditingParticipant(null);
        setMessage("Participant updated.");
      } else {
        await createParticipant.mutateAsync(input);
        event.currentTarget.reset();
        setMessage("Manual participant added.");
      }
    } catch (saveError) {
      setError(await getApiErrorMessage(saveError, "Unable to save participant."));
    }
  }

  async function withdraw(participantId: string) {
    setMessage(null);
    setError(null);
    try {
      await deleteParticipant.mutateAsync(participantId);
      setMessage("Participant withdrawn.");
    } catch (withdrawError) {
      setError(await getApiErrorMessage(withdrawError, "Unable to withdraw participant."));
    }
  }

  if (tournament.isLoading) {
    return <p className="state-text compact-state">Loading participants.</p>;
  }

  if (tournament.isError || !tournament.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Tournament not found</h2>
        <p>This tournament may not exist or may belong to another organizer.</p>
      </section>
    );
  }

  return (
    <section className="organizer-editor-grid">
      <article className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2>{tournament.data.title}</h2>
            <p>Participants are approved registrations or manual entries that can be used for future fixture generation.</p>
          </div>
          <ExportCsvButton
            path={`/organizer/tournaments/${id}/participants/export.csv`}
            params={{ category_id: filters.categoryId, search: filters.search, status: filters.status }}
          />
        </div>
        <OrganizerTournamentManagementNav id={id} />

        <form className="filter-bar organizer-filter-bar" onSubmit={onFilter}>
          <label>
            <span>Search</span>
            <input name="search" type="search" placeholder="Name, email, phone" defaultValue={filters.search} />
          </label>
          <label>
            <span>Status</span>
            <select name="status" defaultValue={filters.status}>
              <option value="">All statuses</option>
              <option value={OrganizerRostersControllerFindParticipantsStatusEnum.Active}>Active</option>
              <option value={OrganizerRostersControllerFindParticipantsStatusEnum.Withdrawn}>Withdrawn</option>
              <option value={OrganizerRostersControllerFindParticipantsStatusEnum.Disqualified}>Disqualified</option>
            </select>
          </label>
          <label>
            <span>Category</span>
            <select name="categoryId" defaultValue={filters.categoryId}>
              <option value="">All categories</option>
              {(categories.data ?? []).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <button className="primary-action filter-action" type="submit">Apply filters</button>
        </form>

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {participants.isLoading ? <p className="state-text compact-state">Loading participant list.</p> : null}
        {participants.isError ? (
          <section className="empty-state account-empty-state">
            <h2>Unable to load participants</h2>
            <p>Check your organizer access and backend connection.</p>
          </section>
        ) : null}
        {participants.data?.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No participants found</h2>
            <p>Approve registrations or add a manual participant.</p>
          </section>
        ) : null}

        <section className="organizer-table" aria-label="Tournament participants">
          {(participants.data ?? []).map((participant) => (
            <article className="organizer-table-row roster-table-row" key={participant.id}>
              <div>
                <span className={`status-pill ${getStatusTone(participant.status)}`}>{formatLabel(participant.status)}</span>
                <h3>{participant.displayName}</h3>
                <p>{participant.email ?? participant.user?.email ?? "No email"} · {participant.phone ?? "No phone"}</p>
                <p>
                  {participant.category?.name ?? "Tournament-level"} · {formatLabel(participant.source)}
                  {participant.registrationId ? " registration" : " entry"}
                </p>
                <p>Added {formatDateTime(participant.createdAt)}</p>
              </div>
              <div className="organizer-row-actions">
                <button className="secondary-action" type="button" onClick={() => setEditingParticipant(participant)}>
                  Edit
                </button>
                {participant.status === "active" ? (
                  <button
                    className="secondary-action"
                    type="button"
                    disabled={deleteParticipant.isPending}
                    onClick={() => void withdraw(participant.id)}
                  >
                    Withdraw
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </article>

      <aside className="organizer-side-panel">
        <article className="organizer-panel">
          <div className="section-heading organizer-section-heading">
            <h2>{editingParticipant ? "Edit participant" : "Add participant"}</h2>
            <p>{editingParticipant?.source === "registration" ? "Only status can be changed for registration-backed participants." : "Manual participants are internal organizer entries."}</p>
          </div>
          <ParticipantForm
            categories={categories.data ?? []}
            isPending={createParticipant.isPending || updateParticipant.isPending}
            participant={editingParticipant}
            onCancel={editingParticipant ? () => setEditingParticipant(null) : undefined}
            onSubmit={saveParticipant}
          />
        </article>
      </aside>
    </section>
  );
}

function ParticipantForm({
  categories,
  isPending,
  onCancel,
  onSubmit,
  participant
}: Readonly<{
  categories: { id: string; name: string }[];
  isPending: boolean;
  onCancel?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  participant?: OrganizerParticipantDto | null;
}>) {
  const identityDisabled = participant?.source === "registration";

  return (
    <form className="organizer-form" onSubmit={onSubmit}>
      <label>
        <span>Category</span>
        <select name="categoryId" defaultValue={participant?.category?.id ?? ""} disabled={identityDisabled}>
          <option value="">Tournament-level</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Name</span>
        <input name="displayName" type="text" minLength={2} maxLength={160} required defaultValue={participant?.displayName ?? ""} disabled={identityDisabled} />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" maxLength={320} defaultValue={participant?.email ?? ""} disabled={identityDisabled} />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" type="tel" minLength={7} maxLength={40} defaultValue={participant?.phone ?? ""} disabled={identityDisabled} />
      </label>
      {participant ? (
        <label>
          <span>Status</span>
          <select name="status" defaultValue={toUpdateParticipantStatus(participant.status)}>
            <option value={UpdateParticipantRequestDtoStatusEnum.Active}>Active</option>
            <option value={UpdateParticipantRequestDtoStatusEnum.Withdrawn}>Withdrawn</option>
            <option value={UpdateParticipantRequestDtoStatusEnum.Disqualified}>Disqualified</option>
          </select>
        </label>
      ) : null}
      <button className="primary-action form-action" type="submit" disabled={isPending}>
        {isPending ? "Saving" : participant ? "Save participant" : "Add participant"}
      </button>
      {onCancel ? (
        <button className="secondary-action form-action" type="button" onClick={onCancel}>
          Cancel edit
        </button>
      ) : null}
    </form>
  );
}

function readParticipantForm(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    tournamentCategoryId: String(data.get("categoryId") ?? "") || undefined,
    displayName: String(data.get("displayName") ?? ""),
    email: String(data.get("email") ?? "") || undefined,
    phone: String(data.get("phone") ?? "") || undefined
  };
}

function toUpdateParticipantStatus(status: string) {
  return status.toUpperCase() as UpdateParticipantRequestDtoStatusEnum;
}
