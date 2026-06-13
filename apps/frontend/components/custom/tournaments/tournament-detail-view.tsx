"use client";

import type { PublicFixtureMatchDto, PublicFixtureSetDto, PublicFixtureStandingDto } from "@matchflow/client-sdk";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";
import { RegistrationPanel } from "@/components/custom/registrations/registration-panel";
import {
  formatDateRange,
  formatDateTime,
  formatFee,
  formatLabel,
  getPrimaryMedia,
  getVenueSummary
} from "@/components/custom/tournaments/tournament-format";
import { usePublicTournamentFixtures, useTournamentDetail } from "@/hooks/use-discovery";
import { ROUTES } from "@/utils/route";

export function TournamentDetailView({ slug }: Readonly<{ slug: string }>) {
  const tournament = useTournamentDetail(slug);
  const publicFixtures = usePublicTournamentFixtures(slug);

  if (tournament.isLoading) {
    return (
      <main className="detail-shell">
        <PublicHeader />
        <p className="state-text">Loading tournament.</p>
      </main>
    );
  }

  if (tournament.isError || !tournament.data) {
    return (
      <main className="detail-shell">
        <PublicHeader />
        <section className="empty-state">
          <h1>Tournament not found</h1>
          <p>This tournament may be unavailable, private, or no longer published.</p>
          <a className="primary-action" href={ROUTES.TOURNAMENTS}>Back to tournaments</a>
        </section>
      </main>
    );
  }

  const detail = tournament.data;
  const media = getPrimaryMedia(detail);

  return (
    <main className="detail-shell">
      <PublicHeader />

      <header className="detail-hero detail-hero-expanded">
        <div>
          <a className="text-link" href={ROUTES.TOURNAMENTS}>Back to all tournaments</a>
          <span className="eyebrow">{detail.sport.name} in {detail.city.name}</span>
          <h1>{detail.title}</h1>
          <p>{detail.description ?? detail.shortDescription ?? "Tournament details are being prepared."}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#registration">Register</a>
            <a className="secondary-action" href={`/sports/${detail.sport.slug}`}>More {detail.sport.name}</a>
          </div>
        </div>
        {media ? (
          <div
            className="detail-hero-image"
            role="img"
            aria-label={media.altText ?? `${detail.title} tournament`}
            style={{ backgroundImage: `url(${media.url})` }}
          />
        ) : (
          <div className="detail-hero-image detail-hero-image-fallback" aria-hidden="true">
            {detail.sport.name}
          </div>
        )}
      </header>

      <section className="detail-grid">
        <article className="detail-panel">
          <h2>Schedule</h2>
          <dl className="detail-list">
            <div><dt>Date range</dt><dd>{formatDateRange(detail.startsAt, detail.endsAt)}</dd></div>
            <div><dt>Starts</dt><dd>{formatDateTime(detail.startsAt)}</dd></div>
            <div><dt>Ends</dt><dd>{formatDateTime(detail.endsAt)}</dd></div>
            <div><dt>Registration</dt><dd>{formatLabel(detail.registrationAvailability)}</dd></div>
          </dl>
        </article>

        <article className="detail-panel">
          <h2>Venue</h2>
          <p>{getVenueSummary(detail)}</p>
          <p>{detail.venue?.address ?? detail.city.name}</p>
          <a className="text-link" href={`/locations/${detail.city.slug}`}>More in {detail.city.name}</a>
        </article>

        <article className="detail-panel">
          <h2>Organizer</h2>
          <p>{detail.organizer.organizationName}</p>
          <p>Status: {formatLabel(detail.organizer.verificationStatus)}</p>
          <p className="muted-copy">Public publishing for unverified organizers is reserved for later approval workflows.</p>
        </article>
      </section>

      <section className="content-band detail-categories">
        <div className="section-heading section-heading-row">
          <div>
            <h2>Events and categories</h2>
            <p>Choose an available category in the registration panel when entries are open.</p>
          </div>
          <span className="status-pill status-pill-ready">{formatLabel(detail.registrationAvailability)}</span>
        </div>
        <div className="category-grid">
          {detail.categories.map((category) => (
            <article className="feature-tile category-card" key={category.id}>
              <span>{formatLabel(category.participantType)}</span>
              <h3>{category.name}</h3>
              <p>{formatLabel(category.formatType)} - {formatLabel(category.genderType)}</p>
              <p>{formatFee(category)}</p>
              <p>{category.capacity ? `${category.capacity} capacity` : "Open capacity"}</p>
            </article>
          ))}
        </div>
      </section>

      <div id="registration">
        <RegistrationPanel tournament={detail} />
      </div>

      <PublicFixtureResultsSection
        fixtureSets={publicFixtures.data ?? []}
        isError={publicFixtures.isError}
        isLoading={publicFixtures.isLoading}
      />

      <PublicFooter />
    </main>
  );
}

function PublicFixtureResultsSection({
  fixtureSets,
  isError,
  isLoading
}: Readonly<{
  fixtureSets: PublicFixtureSetDto[];
  isError: boolean;
  isLoading: boolean;
}>) {
  return (
    <section className="content-band muted-band public-results-section" id="fixtures-results">
      <div className="section-heading">
        <h2>Fixtures and results</h2>
        <p>Published schedules and completed results from the organizer.</p>
      </div>

      {isLoading ? <p className="state-text compact-state">Loading published fixtures.</p> : null}
      {isError ? (
        <section className="empty-state account-empty-state">
          <h3>Unable to load fixtures</h3>
          <p>Public tournament details are still available above.</p>
        </section>
      ) : null}
      {!isLoading && !isError && fixtureSets.length === 0 ? (
        <section className="empty-state account-empty-state">
          <h3>No published fixtures yet</h3>
          <p>Check back after the organizer publishes schedules or results.</p>
        </section>
      ) : null}

      <div className="public-fixture-grid">
        {fixtureSets.map((fixtureSet) => (
          <PublicFixtureSetCard fixtureSet={fixtureSet} key={fixtureSet.id} />
        ))}
      </div>
    </section>
  );
}

function PublicFixtureSetCard({ fixtureSet }: Readonly<{ fixtureSet: PublicFixtureSetDto }>) {
  return (
    <article className="public-fixture-set">
      <div className="section-heading section-heading-row">
        <div>
          <span className="eyebrow">{fixtureSet.category.name}</span>
          <h3>{fixtureSet.name ?? `${formatLabel(fixtureSet.format)} fixtures`}</h3>
          <p>
            {formatLabel(fixtureSet.format)} · {formatLabel(fixtureSet.entrantType)} · {fixtureSet.completedMatchCount} of{" "}
            {fixtureSet.matchCount} completed
          </p>
        </div>
        <span className="status-pill status-pill-ready">Published</span>
      </div>

      {fixtureSet.standings.length > 0 ? <PublicStandings standings={fixtureSet.standings} /> : null}

      <div className="fixture-round-list" aria-label={`${fixtureSet.category.name} public fixtures`}>
        {fixtureSet.rounds.map((round) => (
          <article className="fixture-round-panel" key={`${fixtureSet.id}:${round.roundNumber}`}>
            <div className="section-heading organizer-section-heading">
              <h4>{round.name}</h4>
              <p>{formatLabel(round.stage)} · {round.matches.length} matches</p>
            </div>
            <div className="public-match-grid">
              {round.matches.map((match) => (
                <PublicMatchCard key={match.id} match={match} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

function PublicMatchCard({ match }: Readonly<{ match: PublicFixtureMatchDto }>) {
  return (
    <article className="public-match-card">
      <div className="fixture-match-summary">
        <div>
          <span className="eyebrow">Match {match.matchNumber}</span>
          <h5>{formatPublicEntrants(match)}</h5>
          <p>{formatPublicWinner(match)}</p>
        </div>
        <div>
          <span className={`status-pill ${match.status === "completed" ? "status-pill-ready" : "status-pill-planned"}`}>
            {formatLabel(match.status)}
          </span>
          <p>{match.scheduledAt ? formatDateTime(match.scheduledAt) : "Schedule pending"}</p>
          <p>{[match.venueName, match.courtName].filter(Boolean).join(" · ") || "Venue to be assigned"}</p>
        </div>
      </div>
    </article>
  );
}

function PublicStandings({ standings }: Readonly<{ standings: PublicFixtureStandingDto[] }>) {
  return (
    <section className="fixture-standings-panel" aria-label="Public round robin standings">
      <div className="section-heading organizer-section-heading">
        <h4>Standings</h4>
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
            {standings.map((standing) => (
              <tr key={`${standing.rank}:${standing.displayName}`}>
                <td>{standing.rank}</td>
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

function formatPublicEntrants(match: PublicFixtureMatchDto) {
  return [...match.entrants]
    .sort((first, second) => first.slotNumber - second.slotNumber)
    .map((entrant) => {
      const score = entrant.score === undefined || entrant.score === null ? "" : ` (${entrant.score})`;
      return `${entrant.displayName}${score}`;
    })
    .join(" vs ");
}

function formatPublicWinner(match: PublicFixtureMatchDto) {
  const winner = match.entrants.find((entrant) => entrant.isWinner);
  if (winner) {
    return `Winner: ${winner.displayName}`;
  }
  if (match.status === "completed") {
    return "Completed as draw";
  }
  return "Result pending";
}
