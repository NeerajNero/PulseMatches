"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  FixtureSetDto,
  GenerateFixtureSetRequestDtoEntrantTypeEnum,
  GenerateFixtureSetRequestDtoFormatEnum,
  TournamentCategoryDto
} from "@matchflow/client-sdk";
import { formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { getStatusTone } from "@/components/custom/organizer/organizer-format";
import { OrganizerTournamentManagementNav } from "@/components/custom/organizer/organizer-tournament-management-nav";
import {
  useArchiveFixtureSet,
  useGenerateFixtureSet,
  useOrganizerFixtures,
  usePublishFixtureResults,
  useUnpublishFixtureResults
} from "@/hooks/use-organizer-fixtures";
import { useOrganizerTournament, useTournamentCategories } from "@/hooks/use-organizer-tournaments";
import { getApiErrorMessage } from "@/lib/apis/api-error";
import { organizerTournamentFixtureRoute } from "@/utils/route";

export function OrganizerFixtureManagementView({ id }: Readonly<{ id: string }>) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tournament = useOrganizerTournament(id);
  const categories = useTournamentCategories(id);
  const fixtures = useOrganizerFixtures(id);
  const generateFixtureSet = useGenerateFixtureSet(id);
  const archiveFixtureSet = useArchiveFixtureSet(id);
  const publishFixtureResults = usePublishFixtureResults(id, tournament.data?.slug);
  const unpublishFixtureResults = useUnpublishFixtureResults(id, tournament.data?.slug);
  const activeCategories = useMemo(
    () => (categories.data ?? []).filter((category) => category.status === "active"),
    [categories.data]
  );

  async function onGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const data = new FormData(event.currentTarget);
    const categoryId = String(data.get("categoryId") ?? "");
    const name = String(data.get("name") ?? "").trim();

    try {
      const fixtureSet = await generateFixtureSet.mutateAsync({
        categoryId,
        data: {
          format: String(data.get("format")) as GenerateFixtureSetRequestDtoFormatEnum,
          entrantType: String(data.get("entrantType")) as GenerateFixtureSetRequestDtoEntrantTypeEnum,
          name: name || undefined,
          replaceExisting: Boolean(data.get("replaceExisting"))
        }
      });
      setMessage(`Fixture set generated with ${fixtureSet?.matchCount ?? 0} matches.`);
    } catch (generateError) {
      setError(await getApiErrorMessage(generateError, "Unable to generate fixtures."));
    }
  }

  async function onArchive(fixtureSet: FixtureSetDto) {
    if (!window.confirm("Archive this fixture set? Scheduled match details will stay stored but this fixture set will be inactive.")) {
      return;
    }
    setMessage(null);
    setError(null);
    try {
      await archiveFixtureSet.mutateAsync(fixtureSet.id);
      setMessage("Fixture set archived.");
    } catch (archiveError) {
      setError(await getApiErrorMessage(archiveError, "Unable to archive fixture set."));
    }
  }

  async function onPublish(fixtureSet: FixtureSetDto) {
    setMessage(null);
    setError(null);
    try {
      await publishFixtureResults.mutateAsync(fixtureSet.id);
      setMessage("Fixture set is now visible publicly.");
    } catch (publishError) {
      setError(await getApiErrorMessage(publishError, "Unable to publish fixture results."));
    }
  }

  async function onUnpublish(fixtureSet: FixtureSetDto) {
    setMessage(null);
    setError(null);
    try {
      await unpublishFixtureResults.mutateAsync(fixtureSet.id);
      setMessage("Fixture set is hidden from public results.");
    } catch (unpublishError) {
      setError(await getApiErrorMessage(unpublishError, "Unable to hide fixture results."));
    }
  }

  if (tournament.isLoading) {
    return <p className="state-text compact-state">Loading fixtures.</p>;
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
          <p>Generate knockout or round-robin fixtures from active rosters, then schedule matches.</p>
        </div>
        <OrganizerTournamentManagementNav id={id} />

        {message ? <p className="form-success">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {fixtures.isLoading ? <p className="state-text compact-state">Loading fixture sets.</p> : null}
        {fixtures.isError ? (
          <section className="empty-state account-empty-state">
            <h2>Unable to load fixtures</h2>
            <p>Check your organizer access and backend connection.</p>
          </section>
        ) : null}
        {fixtures.data?.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No fixtures generated</h2>
            <p>Generate fixtures after approving participants or creating teams for a category.</p>
          </section>
        ) : null}

        <section className="fixture-set-grid" aria-label="Fixture sets">
          {(fixtures.data ?? []).map((fixtureSet) => (
            <FixtureSetCard
              fixtureSet={fixtureSet}
              id={id}
              isArchiving={archiveFixtureSet.isPending}
              isPublishing={publishFixtureResults.isPending || unpublishFixtureResults.isPending}
              key={fixtureSet.id}
              onArchive={() => void onArchive(fixtureSet)}
              onPublish={() => void onPublish(fixtureSet)}
              onUnpublish={() => void onUnpublish(fixtureSet)}
            />
          ))}
        </section>
      </article>

      <aside className="organizer-side-panel">
        <article className="organizer-panel">
          <div className="section-heading organizer-section-heading">
            <h2>Generate fixture set</h2>
            <p>Singles categories use active participants. Doubles and team categories use active teams.</p>
          </div>
          {activeCategories.length === 0 ? (
            <section className="empty-state account-empty-state">
              <h2>No active categories</h2>
              <p>Add an active category before generating fixtures.</p>
            </section>
          ) : (
            <FixtureGenerationForm
              categories={activeCategories}
              isPending={generateFixtureSet.isPending}
              onSubmit={onGenerate}
            />
          )}
        </article>
      </aside>
    </section>
  );
}

function FixtureSetCard({
  fixtureSet,
  id,
  isArchiving,
  isPublishing,
  onArchive,
  onPublish,
  onUnpublish
}: Readonly<{
  fixtureSet: FixtureSetDto;
  id: string;
  isArchiving: boolean;
  isPublishing: boolean;
  onArchive: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}>) {
  const isArchived = fixtureSet.status === "archived";
  const isPublic = Boolean(fixtureSet.publishedAt);
  return (
    <article className="fixture-set-card">
      <div>
        <div className="status-pill-row">
          <span className={`status-pill ${getStatusTone(fixtureSet.status)}`}>{formatLabel(fixtureSet.status)}</span>
          <span className={`status-pill ${isPublic ? "status-pill-ready" : "status-pill-planned"}`}>
            {isPublic ? "Visible publicly" : "Hidden from public"}
          </span>
        </div>
        <h3>{fixtureSet.name ?? `${formatLabel(fixtureSet.format)} fixtures`}</h3>
        <p>{fixtureSet.category.name} · {formatLabel(fixtureSet.entrantType)} · {formatLabel(fixtureSet.format)}</p>
      </div>
      <dl className="fixture-meta-grid">
        <div>
          <dt>Matches</dt>
          <dd>{fixtureSet.matchCount}</dd>
        </div>
        <div>
          <dt>Scheduled</dt>
          <dd>{fixtureSet.scheduledMatchCount}</dd>
        </div>
        <div>
          <dt>Generated</dt>
          <dd>{fixtureSet.generatedAt ? formatDateTime(fixtureSet.generatedAt) : "Not set"}</dd>
        </div>
        <div>
          <dt>Public</dt>
          <dd>{fixtureSet.publishedAt ? formatDateTime(fixtureSet.publishedAt) : "Hidden"}</dd>
        </div>
      </dl>
      <div className="organizer-row-actions">
        <a className="secondary-action" href={organizerTournamentFixtureRoute(id, fixtureSet.id)}>View matches</a>
        {!isArchived && !isPublic ? (
          <button className="secondary-action" disabled={isPublishing} type="button" onClick={onPublish}>
            Publish results
          </button>
        ) : null}
        {!isArchived && isPublic ? (
          <button className="secondary-action" disabled={isPublishing} type="button" onClick={onUnpublish}>
            Hide results
          </button>
        ) : null}
        {!isArchived ? (
          <button className="secondary-action" disabled={isArchiving} type="button" onClick={onArchive}>
            Archive
          </button>
        ) : null}
      </div>
    </article>
  );
}

function FixtureGenerationForm({
  categories,
  isPending,
  onSubmit
}: Readonly<{
  categories: TournamentCategoryDto[];
  isPending: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}>) {
  return (
    <form className="organizer-form" onSubmit={onSubmit}>
      <label>
        <span>Category</span>
        <select name="categoryId" required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} · {formatLabel(category.participantType)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Format</span>
        <select name="format" required>
          <option value={GenerateFixtureSetRequestDtoFormatEnum.Knockout}>Knockout</option>
          <option value={GenerateFixtureSetRequestDtoFormatEnum.RoundRobin}>Round robin</option>
        </select>
      </label>
      <label>
        <span>Entrant type</span>
        <select name="entrantType" required>
          <option value={GenerateFixtureSetRequestDtoEntrantTypeEnum.Participant}>Participants</option>
          <option value={GenerateFixtureSetRequestDtoEntrantTypeEnum.Team}>Teams</option>
        </select>
      </label>
      <label>
        <span>Fixture name</span>
        <input name="name" type="text" minLength={2} maxLength={180} placeholder="Main draw" />
      </label>
      <label className="checkbox-field organizer-checkbox-field">
        <input name="replaceExisting" type="checkbox" value="true" />
        <span>Archive existing matching fixture set before generating</span>
      </label>
      <p className="state-text compact-state">
        Generation requires at least two active entrants in the selected category.
      </p>
      <button className="primary-action form-action" type="submit" disabled={isPending}>
        {isPending ? "Generating" : "Generate fixtures"}
      </button>
    </form>
  );
}
