"use client";

import { FormEvent, useState } from "react";
import {
  CreateTeamMemberRequestDtoRoleEnum,
  OrganizerTeamMemberDto,
  UpdateTeamMemberRequestDtoRoleEnum
} from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import {
  useCreateTeamMember,
  useDeleteTeamMember,
  useOrganizerParticipants,
  useOrganizerTeam,
  useUpdateTeamMember
} from "@/hooks/use-organizer-rosters";
import { useOrganizerTournament } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { organizerTournamentTeamsRoute } from "@/utils/route";

export function OrganizerTeamDetailView({ id, teamId }: Readonly<{ id: string; teamId: string }>) {
  const [editingMember, setEditingMember] = useState<OrganizerTeamMemberDto | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const team = useOrganizerTeam(id, teamId);
  const participants = useOrganizerParticipants(id, { status: "active", categoryId: team.data?.category?.id ?? "" }, Boolean(team.data));
  const createMember = useCreateTeamMember(id, teamId);
  const updateMember = useUpdateTeamMember(id, teamId);
  const deleteMember = useDeleteTeamMember(id, teamId);

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await createMember.mutateAsync(readCreateMemberForm(event.currentTarget));
      event.currentTarget.reset();
      setMessage("Team member added.");
    } catch (addError) {
      setError(await getApiErrorMessage(addError, "Unable to add team member."));
    }
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingMember) {
      return;
    }
    setMessage(null);
    setError(null);
    try {
      await updateMember.mutateAsync({
        memberId: editingMember.id,
        data: readUpdateMemberForm(event.currentTarget, editingMember)
      });
      setEditingMember(null);
      setMessage("Team member updated.");
    } catch (updateError) {
      setError(await getApiErrorMessage(updateError, "Unable to update team member."));
    }
  }

  async function remove(memberId: string) {
    setMessage(null);
    setError(null);
    try {
      await deleteMember.mutateAsync(memberId);
      setMessage("Team member removed.");
    } catch (removeError) {
      setError(await getApiErrorMessage(removeError, "Unable to remove team member."));
    }
  }

  if (tournament.isLoading || team.isLoading) {
    return <p className="state-text compact-state">Loading team.</p>;
  }

  if (tournament.isError || team.isError || !tournament.data || !team.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Team not found</h2>
        <p>This team may not exist or may belong to another organizer.</p>
      </section>
    );
  }

  return (
    <section className="organizer-editor-grid">
      <article className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>{team.data.name}</h2>
          <p>
            {tournament.data.title} · {team.data.category?.name ?? "Tournament-level"} · {team.data.memberCount} members
          </p>
          <a className="text-link" href={organizerTournamentTeamsRoute(id)}>Back to teams</a>
        </div>
        <OrganizerTournamentManagementNav id={id} />

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <section className="organizer-table" aria-label="Team members">
          {team.data.members.map((member) => (
            <article className="organizer-table-row roster-table-row" key={member.id}>
              <div>
                <span className="status-pill status-pill-ready">{formatLabel(member.role)}</span>
                <h3>{member.displayName}</h3>
                <p>{member.email ?? "No email"} · {member.phone ?? "No phone"}</p>
                <p>{member.participantId ? "Linked participant" : "Manual team member"} · Added {formatDateTime(member.createdAt)}</p>
              </div>
              <div className="organizer-row-actions">
                <button className="secondary-action" type="button" onClick={() => setEditingMember(member)}>
                  Edit
                </button>
                <button
                  className="secondary-action"
                  type="button"
                  disabled={deleteMember.isPending}
                  onClick={() => void remove(member.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        {team.data.members.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No members yet</h2>
            <p>Add existing participants or manual team members.</p>
          </section>
        ) : null}
      </article>

      <aside className="organizer-side-panel">
        <article className="organizer-panel">
          <div className="section-heading organizer-section-heading">
            <h2>{editingMember ? "Edit member" : "Add member"}</h2>
            <p>{editingMember?.participantId ? "Participant-backed identity comes from the participant record." : "Use a participant or enter a manual member."}</p>
          </div>
          {editingMember ? (
            <EditMemberForm
              isPending={updateMember.isPending}
              member={editingMember}
              onCancel={() => setEditingMember(null)}
              onSubmit={update}
            />
          ) : (
            <AddMemberForm
              isPending={createMember.isPending}
              onSubmit={addMember}
              participants={participants.data ?? []}
            />
          )}
        </article>
      </aside>
    </section>
  );
}

function AddMemberForm({
  isPending,
  onSubmit,
  participants
}: Readonly<{
  isPending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  participants: { id: string; displayName: string; category?: { name: string } | null }[];
}>) {
  return (
    <form className="organizer-form" onSubmit={onSubmit}>
      <label>
        <span>Existing participant</span>
        <select name="participantId" defaultValue="">
          <option value="">Manual member</option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.displayName}{participant.category ? ` · ${participant.category.name}` : ""}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Manual name</span>
        <input name="displayName" type="text" minLength={2} maxLength={160} placeholder="Required when not using a participant" />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" maxLength={320} />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" type="tel" minLength={7} maxLength={40} />
      </label>
      <label>
        <span>Role</span>
        <select name="role" defaultValue={CreateTeamMemberRequestDtoRoleEnum.Player}>
          <option value={CreateTeamMemberRequestDtoRoleEnum.Captain}>Captain</option>
          <option value={CreateTeamMemberRequestDtoRoleEnum.Player}>Player</option>
          <option value={CreateTeamMemberRequestDtoRoleEnum.Substitute}>Substitute</option>
        </select>
      </label>
      <button className="primary-action form-action" type="submit" disabled={isPending}>
        {isPending ? "Adding" : "Add member"}
      </button>
    </form>
  );
}

function EditMemberForm({
  isPending,
  member,
  onCancel,
  onSubmit
}: Readonly<{
  isPending: boolean;
  member: OrganizerTeamMemberDto;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}>) {
  const identityDisabled = Boolean(member.participantId);
  return (
    <form className="organizer-form" onSubmit={onSubmit}>
      <label>
        <span>Name</span>
        <input name="displayName" type="text" minLength={2} maxLength={160} required defaultValue={member.displayName} disabled={identityDisabled} />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" maxLength={320} defaultValue={member.email ?? ""} disabled={identityDisabled} />
      </label>
      <label>
        <span>Phone</span>
        <input name="phone" type="tel" minLength={7} maxLength={40} defaultValue={member.phone ?? ""} disabled={identityDisabled} />
      </label>
      <label>
        <span>Role</span>
        <select name="role" defaultValue={member.role.toUpperCase() as UpdateTeamMemberRequestDtoRoleEnum}>
          <option value={UpdateTeamMemberRequestDtoRoleEnum.Captain}>Captain</option>
          <option value={UpdateTeamMemberRequestDtoRoleEnum.Player}>Player</option>
          <option value={UpdateTeamMemberRequestDtoRoleEnum.Substitute}>Substitute</option>
        </select>
      </label>
      <button className="primary-action form-action" type="submit" disabled={isPending}>
        {isPending ? "Saving" : "Save member"}
      </button>
      <button className="secondary-action form-action" type="button" onClick={onCancel}>
        Cancel edit
      </button>
    </form>
  );
}

function readCreateMemberForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const participantId = String(data.get("participantId") ?? "");
  return {
    participantId: participantId || undefined,
    displayName: participantId ? undefined : String(data.get("displayName") ?? ""),
    email: String(data.get("email") ?? "") || undefined,
    phone: String(data.get("phone") ?? "") || undefined,
    role: String(data.get("role") ?? CreateTeamMemberRequestDtoRoleEnum.Player) as CreateTeamMemberRequestDtoRoleEnum
  };
}

function readUpdateMemberForm(form: HTMLFormElement, member: OrganizerTeamMemberDto) {
  const data = new FormData(form);
  const role = String(data.get("role") ?? UpdateTeamMemberRequestDtoRoleEnum.Player) as UpdateTeamMemberRequestDtoRoleEnum;
  if (member.participantId) {
    return { role };
  }
  return {
    displayName: String(data.get("displayName") ?? ""),
    email: String(data.get("email") ?? "") || null,
    phone: String(data.get("phone") ?? "") || null,
    role
  };
}
