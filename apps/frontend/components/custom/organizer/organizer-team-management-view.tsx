"use client";

import { FormEvent, useState } from "react";
import {
  OrganizerRostersControllerFindTeamsStatusEnum,
  OrganizerTeamDto,
  UpdateTeamRequestDtoStatusEnum
} from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { ExportCsvButton } from "@/components/ui/export-csv-button";
import {
  useCreateTeam,
  useDeleteTeam,
  useOrganizerTeams,
  useUpdateTeam
} from "@/hooks/use-organizer-rosters";
import { useOrganizerTournament, useTournamentCategories } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { organizerTournamentTeamRoute } from "@/utils/route";

export function OrganizerTeamManagementView({ id }: Readonly<{ id: string }>) {
  const [filters, setFilters] = useState({ categoryId: "", search: "", status: "" });
  const [editingTeam, setEditingTeam] = useState<OrganizerTeamDto | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const categories = useTournamentCategories(id);
  const teams = useOrganizerTeams(id, {
    categoryId: filters.categoryId,
    search: filters.search,
    status: filters.status as OrganizerRostersControllerFindTeamsStatusEnum | ""
  });
  const createTeam = useCreateTeam(id);
  const updateTeam = useUpdateTeam(id);
  const deleteTeam = useDeleteTeam(id);

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      categoryId: String(form.get("categoryId") ?? ""),
      search: String(form.get("search") ?? ""),
      status: String(form.get("status") ?? "")
    });
  }

  async function saveTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const input = readTeamForm(event.currentTarget);
    try {
      if (editingTeam) {
        await updateTeam.mutateAsync({
          teamId: editingTeam.id,
          data: {
            ...input,
            status: String(new FormData(event.currentTarget).get("status") ?? UpdateTeamRequestDtoStatusEnum.Active) as UpdateTeamRequestDtoStatusEnum
          }
        });
        setEditingTeam(null);
        setMessage("Team updated.");
      } else {
        await createTeam.mutateAsync(input);
        event.currentTarget.reset();
        setMessage("Team created.");
      }
    } catch (saveError) {
      setError(await getApiErrorMessage(saveError, "Unable to save team."));
    }
  }

  async function withdraw(teamId: string) {
    setMessage(null);
    setError(null);
    try {
      await deleteTeam.mutateAsync(teamId);
      setMessage("Team withdrawn.");
    } catch (withdrawError) {
      setError(await getApiErrorMessage(withdrawError, "Unable to withdraw team."));
    }
  }

  if (tournament.isLoading) {
    return <p className="state-text compact-state">Loading teams.</p>;
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
            <p>Build doubles and team-sport rosters without generating fixtures yet.</p>
          </div>
          <ExportCsvButton
            path={`/organizer/tournaments/${id}/teams/export.csv`}
            params={{ category_id: filters.categoryId, search: filters.search, status: filters.status }}
          />
        </div>
        <OrganizerTournamentManagementNav id={id} />

        <form className="filter-bar organizer-filter-bar" onSubmit={onFilter}>
          <label>
            <span>Search</span>
            <input name="search" type="search" placeholder="Team name" defaultValue={filters.search} />
          </label>
          <label>
            <span>Status</span>
            <select name="status" defaultValue={filters.status}>
              <option value="">All statuses</option>
              <option value={OrganizerRostersControllerFindTeamsStatusEnum.Active}>Active</option>
              <option value={OrganizerRostersControllerFindTeamsStatusEnum.Withdrawn}>Withdrawn</option>
              <option value={OrganizerRostersControllerFindTeamsStatusEnum.Disqualified}>Disqualified</option>
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
        {teams.isLoading ? <p className="state-text compact-state">Loading teams list.</p> : null}
        {teams.isError ? (
          <section className="empty-state account-empty-state">
            <h2>Unable to load teams</h2>
            <p>Check your organizer access and backend connection.</p>
          </section>
        ) : null}
        {teams.data?.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No teams found</h2>
            <p>Create a team for doubles or team categories.</p>
          </section>
        ) : null}

        <section className="organizer-table" aria-label="Tournament teams">
          {(teams.data ?? []).map((team) => (
            <article className="organizer-table-row roster-table-row" key={team.id}>
              <div>
                <span className={`status-pill ${getStatusTone(team.status)}`}>{formatLabel(team.status)}</span>
                <h3>{team.name}</h3>
                <p>{team.category?.name ?? "Tournament-level"} · {team.memberCount} members · {team.seed ? `Seed ${team.seed}` : "No seed"}</p>
                <p>Created {formatDateTime(team.createdAt)}</p>
              </div>
              <div className="organizer-row-actions">
                <a className="secondary-action" href={organizerTournamentTeamRoute(id, team.id)}>Members</a>
                <button className="secondary-action" type="button" onClick={() => setEditingTeam(team)}>
                  Edit
                </button>
                {team.status === "active" ? (
                  <button
                    className="secondary-action"
                    type="button"
                    disabled={deleteTeam.isPending}
                    onClick={() => void withdraw(team.id)}
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
            <h2>{editingTeam ? "Edit team" : "Create team"}</h2>
            <p>Teams are available for doubles and team categories. Singles categories are managed through participants.</p>
          </div>
          <TeamForm
            categories={categories.data ?? []}
            isPending={createTeam.isPending || updateTeam.isPending}
            onCancel={editingTeam ? () => setEditingTeam(null) : undefined}
            onSubmit={saveTeam}
            team={editingTeam}
          />
        </article>
      </aside>
    </section>
  );
}

function TeamForm({
  categories,
  isPending,
  onCancel,
  onSubmit,
  team
}: Readonly<{
  categories: { id: string; name: string; participantType: string }[];
  isPending: boolean;
  onCancel?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  team?: OrganizerTeamDto | null;
}>) {
  return (
    <form className="organizer-form" onSubmit={onSubmit}>
      <label>
        <span>Category</span>
        <select name="categoryId" defaultValue={team?.category?.id ?? ""}>
          <option value="">Tournament-level</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} · {formatLabel(category.participantType)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Team name</span>
        <input name="name" type="text" minLength={2} maxLength={180} required defaultValue={team?.name ?? ""} />
      </label>
      <label>
        <span>Seed</span>
        <input name="seed" type="number" min={1} max={999} defaultValue={team?.seed ?? ""} />
      </label>
      {team ? (
        <label>
          <span>Status</span>
          <select name="status" defaultValue={team.status.toUpperCase() as UpdateTeamRequestDtoStatusEnum}>
            <option value={UpdateTeamRequestDtoStatusEnum.Active}>Active</option>
            <option value={UpdateTeamRequestDtoStatusEnum.Withdrawn}>Withdrawn</option>
            <option value={UpdateTeamRequestDtoStatusEnum.Disqualified}>Disqualified</option>
          </select>
        </label>
      ) : null}
      <button className="primary-action form-action" type="submit" disabled={isPending}>
        {isPending ? "Saving" : team ? "Save team" : "Create team"}
      </button>
      {onCancel ? (
        <button className="secondary-action form-action" type="button" onClick={onCancel}>
          Cancel edit
        </button>
      ) : null}
    </form>
  );
}

function readTeamForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const seedValue = String(data.get("seed") ?? "").trim();
  return {
    tournamentCategoryId: String(data.get("categoryId") ?? "") || undefined,
    name: String(data.get("name") ?? ""),
    seed: seedValue ? Number(seedValue) : undefined
  };
}
