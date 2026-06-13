"use client";

import { FormEvent, useState } from "react";
import {
  CreateTournamentCategoryRequestDtoFormatTypeEnum,
  CreateTournamentCategoryRequestDtoGenderTypeEnum,
  CreateTournamentCategoryRequestDtoParticipantTypeEnum,
  TournamentCategoryDto,
  UpdateTournamentCategoryRequestDtoStatusEnum
} from "@matchflow/client-sdk";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import { formatFee, formatLabel } from "@/components/custom/tournaments/tournament-format";
import {
  useCreateTournamentCategory,
  useDeleteTournamentCategory,
  useOrganizerTournament,
  useTournamentCategories,
  useUpdateTournamentCategory
} from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { organizerTournamentEditRoute } from "@/utils/route";

export function OrganizerCategoryManagerView({ id }: Readonly<{ id: string }>) {
  const tournament = useOrganizerTournament(id);
  const categories = useTournamentCategories(id);
  const createCategory = useCreateTournamentCategory(id);
  const updateCategory = useUpdateTournamentCategory(id);
  const deleteCategory = useDeleteTournamentCategory(id);
  const [editingCategory, setEditingCategory] = useState<TournamentCategoryDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await createCategory.mutateAsync(readCategoryForm(event.currentTarget));
      event.currentTarget.reset();
      setSuccess("Category created.");
    } catch (createError) {
      setError(await getApiErrorMessage(createError, "Unable to create category."));
    }
  }

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCategory) {
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await updateCategory.mutateAsync({
        categoryId: editingCategory.id,
        data: readCategoryForm(event.currentTarget)
      });
      setEditingCategory(null);
      setSuccess("Category updated.");
    } catch (updateError) {
      setError(await getApiErrorMessage(updateError, "Unable to update category."));
    }
  }

  async function deactivate(categoryId: string) {
    if (!window.confirm("Deactivate this category? Players will no longer be able to register for it.")) {
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await deleteCategory.mutateAsync(categoryId);
      setSuccess("Category deactivated.");
    } catch (deleteError) {
      setError(await getApiErrorMessage(deleteError, "Unable to deactivate category."));
    }
  }

  if (tournament.isLoading || categories.isLoading) {
    return <p className="state-text compact-state">Loading categories.</p>;
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
          <h2>{tournament.data.title}</h2>
          <p>Categories are the event divisions players register for and organizers use for rosters, fixtures, and scoring.</p>
          <a className="text-link" href={organizerTournamentEditRoute(tournament.data.id)}>Back to tournament setup</a>
        </div>
        <OrganizerTournamentManagementNav id={tournament.data.id} />
        {success ? <p className="form-success">{success}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <section className="organizer-table" aria-label="Tournament categories">
          {(categories.data ?? []).map((category) => (
            <article className="organizer-table-row" key={category.id}>
              <div>
                <span className={`status-pill ${category.status === "active" ? "status-pill-ready" : "status-pill-planned"}`}>
                  {formatLabel(category.status)}
                </span>
                <h3>{category.name}</h3>
                <p>
                  {formatLabel(category.formatType)} · {formatLabel(category.participantType)} ·{" "}
                  {formatLabel(category.genderType)} · {formatFee(category)}
                </p>
                <p>{category.capacity ? `${category.capacity} capacity` : "Open capacity"}</p>
              </div>
              <div className="organizer-row-actions">
                <button className="secondary-action" type="button" onClick={() => setEditingCategory(category)}>
                  Edit
                </button>
                {category.status === "active" ? (
                  <button
                    className="secondary-action"
                    type="button"
                    disabled={deleteCategory.isPending}
                    onClick={() => void deactivate(category.id)}
                  >
                    Deactivate
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
        {(categories.data ?? []).length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No categories yet</h2>
            <p>Add at least one active category before publishing this tournament.</p>
          </section>
        ) : null}
      </article>

      <aside className="organizer-side-panel">
        <article className="organizer-panel">
          <div className="section-heading organizer-section-heading">
            <h2>{editingCategory ? "Edit category" : "Add category"}</h2>
            <p>{editingCategory ? editingCategory.code : "A stable code will be generated from the category name if omitted."}</p>
          </div>
          <CategoryForm
            category={editingCategory}
            isPending={editingCategory ? updateCategory.isPending : createCategory.isPending}
            onCancel={editingCategory ? () => setEditingCategory(null) : undefined}
            onSubmit={editingCategory ? update : create}
          />
        </article>
      </aside>
    </section>
  );
}

function CategoryForm({
  category,
  isPending,
  onCancel,
  onSubmit
}: Readonly<{
  category?: TournamentCategoryDto | null;
  isPending: boolean;
  onCancel?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}>) {
  return (
    <form className="organizer-form" onSubmit={onSubmit}>
      <label>
        <span>Name</span>
        <input name="name" type="text" minLength={2} maxLength={160} required defaultValue={category?.name ?? ""} />
      </label>
      <label>
        <span>Code</span>
        <input name="code" type="text" minLength={2} maxLength={120} defaultValue={category?.code ?? ""} />
      </label>
      <div className="organizer-form-grid">
        <label>
          <span>Format</span>
          <select name="formatType" required defaultValue={toCreateFormat(category?.formatType)}>
            <option value={CreateTournamentCategoryRequestDtoFormatTypeEnum.Knockout}>Knockout</option>
            <option value={CreateTournamentCategoryRequestDtoFormatTypeEnum.RoundRobin}>Round robin</option>
            <option value={CreateTournamentCategoryRequestDtoFormatTypeEnum.League}>League</option>
            <option value={CreateTournamentCategoryRequestDtoFormatTypeEnum.Friendly}>Friendly</option>
            <option value={CreateTournamentCategoryRequestDtoFormatTypeEnum.Custom}>Custom</option>
          </select>
        </label>
        <label>
          <span>Participants</span>
          <select name="participantType" required defaultValue={toCreateParticipant(category?.participantType)}>
            <option value={CreateTournamentCategoryRequestDtoParticipantTypeEnum.Singles}>Singles</option>
            <option value={CreateTournamentCategoryRequestDtoParticipantTypeEnum.Doubles}>Doubles</option>
            <option value={CreateTournamentCategoryRequestDtoParticipantTypeEnum.Team}>Team</option>
          </select>
        </label>
      </div>
      <label>
        <span>Division</span>
        <select name="genderType" defaultValue={toCreateGender(category?.genderType)}>
          <option value={CreateTournamentCategoryRequestDtoGenderTypeEnum.Open}>Open</option>
          <option value={CreateTournamentCategoryRequestDtoGenderTypeEnum.Male}>Male</option>
          <option value={CreateTournamentCategoryRequestDtoGenderTypeEnum.Female}>Female</option>
          <option value={CreateTournamentCategoryRequestDtoGenderTypeEnum.Mixed}>Mixed</option>
        </select>
      </label>
      <div className="organizer-form-grid">
        <label>
          <span>Min age</span>
          <input name="minAge" type="number" min={0} defaultValue={category?.minAge ?? ""} />
        </label>
        <label>
          <span>Max age</span>
          <input name="maxAge" type="number" min={0} defaultValue={category?.maxAge ?? ""} />
        </label>
      </div>
      <div className="organizer-form-grid">
        <label>
          <span>Entry fee</span>
          <input name="entryFeeAmount" type="number" min={0} defaultValue={category?.entryFeeAmount ?? 0} />
        </label>
        <label>
          <span>Currency</span>
          <input name="entryFeeCurrency" type="text" minLength={3} maxLength={3} defaultValue={category?.entryFeeCurrency ?? "INR"} />
        </label>
      </div>
      <label>
        <span>Capacity</span>
        <input name="capacity" type="number" min={1} defaultValue={category?.capacity ?? ""} />
      </label>
      {category ? (
        <label>
          <span>Status</span>
          <select name="status" defaultValue={category.status === "active" ? UpdateTournamentCategoryRequestDtoStatusEnum.Active : UpdateTournamentCategoryRequestDtoStatusEnum.Inactive}>
            <option value={UpdateTournamentCategoryRequestDtoStatusEnum.Active}>Active</option>
            <option value={UpdateTournamentCategoryRequestDtoStatusEnum.Inactive}>Inactive</option>
          </select>
        </label>
      ) : null}
      <button className="primary-action form-action" type="submit" disabled={isPending}>
        {isPending ? "Saving" : category ? "Save category" : "Add category"}
      </button>
      {onCancel ? (
        <button className="secondary-action form-action" type="button" onClick={onCancel}>
          Cancel edit
        </button>
      ) : null}
    </form>
  );
}

function readCategoryForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const minAge = numberOrUndefined(data.get("minAge"));
  const maxAge = numberOrUndefined(data.get("maxAge"));
  const capacity = numberOrUndefined(data.get("capacity"));

  return {
    name: String(data.get("name") ?? ""),
    code: String(data.get("code") ?? "") || undefined,
    formatType: String(data.get("formatType") ?? CreateTournamentCategoryRequestDtoFormatTypeEnum.Knockout) as CreateTournamentCategoryRequestDtoFormatTypeEnum,
    participantType: String(data.get("participantType") ?? CreateTournamentCategoryRequestDtoParticipantTypeEnum.Singles) as CreateTournamentCategoryRequestDtoParticipantTypeEnum,
    genderType: String(data.get("genderType") ?? CreateTournamentCategoryRequestDtoGenderTypeEnum.Open) as CreateTournamentCategoryRequestDtoGenderTypeEnum,
    minAge,
    maxAge,
    entryFeeAmount: numberOrUndefined(data.get("entryFeeAmount")) ?? 0,
    entryFeeCurrency: String(data.get("entryFeeCurrency") ?? "INR").toUpperCase(),
    capacity,
    status: data.get("status") ? String(data.get("status")) as UpdateTournamentCategoryRequestDtoStatusEnum : undefined
  };
}

function numberOrUndefined(value: FormDataEntryValue | null) {
  const stringValue = String(value ?? "").trim();
  return stringValue ? Number(stringValue) : undefined;
}

function toCreateFormat(value?: string) {
  return (value?.toUpperCase() ?? CreateTournamentCategoryRequestDtoFormatTypeEnum.Knockout) as CreateTournamentCategoryRequestDtoFormatTypeEnum;
}

function toCreateParticipant(value?: string) {
  return (value?.toUpperCase() ?? CreateTournamentCategoryRequestDtoParticipantTypeEnum.Singles) as CreateTournamentCategoryRequestDtoParticipantTypeEnum;
}

function toCreateGender(value?: string) {
  return (value?.toUpperCase() ?? CreateTournamentCategoryRequestDtoGenderTypeEnum.Open) as CreateTournamentCategoryRequestDtoGenderTypeEnum;
}
