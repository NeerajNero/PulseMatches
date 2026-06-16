"use client";

import { useState } from "react";
import type {
  PublicFixtureMatchDto,
  PublicFixtureSetDto,
  PublicFixtureStandingDto,
  TournamentDetailDto
} from "@matchflow/client-sdk";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";
import { RegistrationPanel } from "@/components/custom/registrations/registration-panel";
import {
  formatDateRange,
  formatDateTime,
  formatFee,
  formatLabel,
  getPrimaryMedia,
  getStatusTone,
  getVenueSummary
} from "@/components/custom/tournaments/tournament-format";
import { usePublicTournamentFixtures, useTournamentDetail } from "@/hooks/use-discovery";
import { ROUTES } from "@/utils/route";
import { PushNotificationPrompt } from "@/components/custom/mobile/push-notification-prompt";

// ─── Tab types ────────────────────────────────────────────────────────────────

type TabId = "overview" | "fixtures" | "results" | "register";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "fixtures", label: "Fixtures & Brackets" },
  { id: "results", label: "Results & Standings" },
  { id: "register", label: "Register" }
];

// ─── Root export ──────────────────────────────────────────────────────────────

export function TournamentDetailView({ slug }: Readonly<{ slug: string }>) {
  const tournament = useTournamentDetail(slug);
  const publicFixtures = usePublicTournamentFixtures(slug);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (tournament.isLoading) {
    return (
      <main className="detail-shell">
        <PublicHeader />
        <p className="state-text">Loading tournament…</p>
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
          <a className="primary-action" href={ROUTES.TOURNAMENTS}>
            Back to tournaments
          </a>
        </section>
      </main>
    );
  }

  const detail = tournament.data;
  const media = getPrimaryMedia(detail);
  const fixtureSets = publicFixtures.data ?? [];

  // Derive counts for tab labels
  const completedMatches = fixtureSets.flatMap((fs) =>
    fs.rounds.flatMap((r) => r.matches.filter((m) => m.status === "completed"))
  );
  const liveMatches = fixtureSets.flatMap((fs) =>
    fs.rounds.flatMap((r) => r.matches.filter((m) => m.status === "live" || m.status === "in_progress"))
  );

  return (
    <main className="detail-shell">
      <PublicHeader />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <header className="detail-hero detail-hero-expanded">
        <div className="detail-hero-copy">
          <a className="text-link" href={ROUTES.TOURNAMENTS}>
            ← Back to all tournaments
          </a>
          <span className="eyebrow">
            {detail.sport.name} · {detail.city.name}
          </span>
          <h1>{detail.title}</h1>
          <p>{detail.description ?? detail.shortDescription ?? "Tournament details are being prepared."}</p>
          <div className="status-pill-row detail-hero-badges">
            <span className={`status-pill ${getStatusTone(detail.status)}`}>
              {formatLabel(detail.status)}
            </span>
            <span className={`status-pill ${getStatusTone(detail.registrationAvailability)}`}>
              {formatLabel(detail.registrationAvailability)}
            </span>
          </div>
          <div className="hero-actions">
            <button
              className="primary-action"
              type="button"
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
            <a className="secondary-action" href={`/sports/${detail.sport.slug}`}>
              More {detail.sport.name}
            </a>
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

      {/* ── Tab Bar ───────────────────────────────────────────────── */}
      <nav className="detail-tab-bar" aria-label="Tournament sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            className={`detail-tab${activeTab === tab.id ? " detail-tab-active" : ""}`}
            type="button"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === "results" && liveMatches.length > 0 && (
              <span
                style={{
                  background: "rgba(220,38,38,0.12)",
                  borderRadius: "999px",
                  color: "#991b1b",
                  fontSize: "10px",
                  fontWeight: 800,
                  marginLeft: 6,
                  padding: "2px 6px"
                }}
              >
                Live
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Tab Panels ────────────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="detail-tab-panel" key="overview">
          <OverviewTab detail={detail} />
        </div>
      )}

      {activeTab === "fixtures" && (
        <div className="detail-tab-panel" key="fixtures">
          <FixturesTab
            fixtureSets={fixtureSets}
            isError={publicFixtures.isError}
            isLoading={publicFixtures.isLoading}
          />
        </div>
      )}

      {activeTab === "results" && (
        <div className="detail-tab-panel" key="results">
          <ResultsTab
            fixtureSets={fixtureSets}
            isError={publicFixtures.isError}
            isLoading={publicFixtures.isLoading}
            completedCount={completedMatches.length}
          />
        </div>
      )}

      {activeTab === "register" && (
        <div className="detail-tab-panel" key="register">
          <RegistrationPanel tournament={detail} />
        </div>
      )}

      <PublicFooter />
    </main>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ detail }: Readonly<{ detail: TournamentDetailDto }>) {
  return (
    <div>
      <PushNotificationPrompt tournamentTitle={detail.title} />
      <div className="detail-grid">
        {/* Schedule */}
        <article className="detail-panel">
          <h2>Schedule</h2>
          <dl className="detail-list">
            <div>
              <dt>Sport</dt>
              <dd>{detail.sport.name}</dd>
            </div>
            <div>
              <dt>Date range</dt>
              <dd>{formatDateRange(detail.startsAt, detail.endsAt)}</dd>
            </div>
            <div>
              <dt>Starts</dt>
              <dd>{formatDateTime(detail.startsAt)}</dd>
            </div>
            <div>
              <dt>Ends</dt>
              <dd>{formatDateTime(detail.endsAt)}</dd>
            </div>
            <div>
              <dt>Registration</dt>
              <dd>{formatLabel(detail.registrationAvailability)}</dd>
            </div>
          </dl>
        </article>

        {/* Venue */}
        <article className="detail-panel">
          <h2>Venue</h2>
          <p>{getVenueSummary(detail)}</p>
          <p>{detail.venue?.address ?? detail.city.name}</p>
          <a className="text-link" href={`/locations/${detail.city.slug}`}>
            More in {detail.city.name}
          </a>
        </article>

        {/* Organizer */}
        <article className="detail-panel">
          <h2>Organizer</h2>
          <p>{detail.organizer.organizationName}</p>
          <p>Status: {formatLabel(detail.organizer.verificationStatus)}</p>
          <p className="muted-copy">
            Public publishing for unverified organizers is reserved for later approval workflows.
          </p>
        </article>
      </div>

      {/* Categories */}
      <section
        className="detail-categories"
        style={{ marginTop: 40 }}
        aria-labelledby="categories-heading"
      >
        <div className="section-heading section-heading-row">
          <div>
            <h2 id="categories-heading">Events and categories</h2>
            <p>Choose an available category in the registration panel when entries are open.</p>
          </div>
          <span className={`status-pill ${getStatusTone(detail.registrationAvailability)}`}>
            {formatLabel(detail.registrationAvailability)}
          </span>
        </div>
        <div className="category-grid">
          {detail.categories.map((category) => (
            <article className="feature-tile category-card" key={category.id}>
              <span>{formatLabel(category.participantType)}</span>
              <h3>{category.name}</h3>
              <p>
                {formatLabel(category.formatType)} — {formatLabel(category.genderType)}
              </p>
              <p>{formatFee(category)}</p>
              <p>{category.capacity ? `${category.capacity} capacity` : "Open capacity"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Fixtures Tab ─────────────────────────────────────────────────────────────

function FixturesTab({
  fixtureSets,
  isError,
  isLoading
}: Readonly<{
  fixtureSets: PublicFixtureSetDto[];
  isError: boolean;
  isLoading: boolean;
}>) {
  if (isLoading) {
    return <p className="state-text compact-state">Loading fixtures…</p>;
  }
  if (isError) {
    return (
      <section className="empty-state account-empty-state">
        <h3>Unable to load fixtures</h3>
        <p>Public tournament details are still available in the Overview tab.</p>
      </section>
    );
  }
  if (fixtureSets.length === 0) {
    return (
      <section className="empty-state account-empty-state">
        <h3>No published fixtures yet</h3>
        <p>Check back after the organizer publishes schedules or brackets.</p>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 32 }}>
      {fixtureSets.map((fs) => (
        <FixtureSetBracket key={fs.id} fixtureSet={fs} />
      ))}
    </div>
  );
}

function FixtureSetBracket({ fixtureSet }: Readonly<{ fixtureSet: PublicFixtureSetDto }>) {
  const isKnockout =
    fixtureSet.format === "single_elimination" || fixtureSet.format === "double_elimination";

  return (
    <article className="public-fixture-set">
      <div className="section-heading section-heading-row">
        <div>
          <span className="eyebrow">{fixtureSet.category.name}</span>
          <h3>{fixtureSet.name ?? `${formatLabel(fixtureSet.format)} fixtures`}</h3>
          <p>
            {formatLabel(fixtureSet.format)} · {formatLabel(fixtureSet.entrantType)} ·{" "}
            {fixtureSet.completedMatchCount} of {fixtureSet.matchCount} completed
          </p>
        </div>
        <span className={`status-pill ${getStatusTone(fixtureSet.status)}`}>
          {formatLabel(fixtureSet.status)}
        </span>
      </div>

      {isKnockout ? (
        <BracketView fixtureSet={fixtureSet} />
      ) : (
        <div className="fixture-round-list" aria-label={`${fixtureSet.category.name} fixtures`}>
          {fixtureSet.rounds.map((round) => (
            <article
              className="fixture-round-panel"
              key={`${fixtureSet.id}:${round.roundNumber}`}
            >
              <div className="section-heading organizer-section-heading">
                <h4>{round.name}</h4>
                <p>
                  {formatLabel(round.stage)} · {round.matches.length} matches
                </p>
              </div>
              <div className="public-match-grid">
                {round.matches.map((match) => (
                  <PublicMatchCard key={match.id} match={match} />
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </article>
  );
}

function BracketView({ fixtureSet }: Readonly<{ fixtureSet: PublicFixtureSetDto }>) {
  return (
    <div className="bracket-container">
      <div className="bracket-rounds">
        {fixtureSet.rounds.map((round) => (
          <div className="bracket-round" key={`${fixtureSet.id}:${round.roundNumber}`}>
            <div className="bracket-round-header">{round.name}</div>
            {round.matches.map((match) => {
              const isLive = match.status === "live" || match.status === "in_progress";
              const isCompleted = match.status === "completed";
              let cardClass = "bracket-match-card";
              if (isLive) cardClass += " bracket-match-live";
              else if (isCompleted) cardClass += " bracket-match-completed";

              const sorted = [...match.entrants].sort(
                (a, b) => a.slotNumber - b.slotNumber
              );

              return (
                <div className="bracket-match-wrapper" key={match.id}>
                  <div className={cardClass}>
                    {sorted.map((entrant) => {
                      const isBye = entrant.displayName.toLowerCase() === "bye";
                      let entrantClass = "bracket-entrant";
                      if (entrant.isWinner) entrantClass += " bracket-entrant-winner";
                      if (isBye) entrantClass += " bracket-bye";
                      return (
                        <div className={entrantClass} key={entrant.slotNumber}>
                          <span className="bracket-entrant-name">{entrant.displayName}</span>
                          {entrant.score !== null && entrant.score !== undefined && (
                            <span className="bracket-entrant-score">{entrant.score}</span>
                          )}
                        </div>
                      );
                    })}
                    <div className="bracket-match-status">
                      {isLive ? "🔴 Live" : isCompleted ? "Completed" : match.scheduledAt ? formatDateTime(match.scheduledAt) : "TBD"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results Tab ──────────────────────────────────────────────────────────────

function ResultsTab({
  fixtureSets,
  isError,
  isLoading,
  completedCount
}: Readonly<{
  fixtureSets: PublicFixtureSetDto[];
  isError: boolean;
  isLoading: boolean;
  completedCount: number;
}>) {
  if (isLoading) {
    return <p className="state-text compact-state">Loading results…</p>;
  }
  if (isError) {
    return (
      <section className="empty-state account-empty-state">
        <h3>Unable to load results</h3>
        <p>Public tournament details are still available in the Overview tab.</p>
      </section>
    );
  }
  if (fixtureSets.length === 0 || completedCount === 0) {
    return (
      <section className="empty-state account-empty-state">
        <h3>No results published yet</h3>
        <p>Results will appear here as matches are completed and published by the organizer.</p>
      </section>
    );
  }

  return (
    <div style={{ display: "grid", gap: 40 }}>
      {fixtureSets.map((fs) => (
        <FixtureSetResults key={fs.id} fixtureSet={fs} />
      ))}
    </div>
  );
}

function FixtureSetResults({ fixtureSet }: Readonly<{ fixtureSet: PublicFixtureSetDto }>) {
  const allMatches = fixtureSet.rounds.flatMap((r) =>
    r.matches.map((m) => ({ match: m, roundName: r.name, roundStage: r.stage }))
  );

  const relevantMatches = allMatches.filter(
    ({ match }) =>
      match.status === "completed" ||
      match.status === "live" ||
      match.status === "in_progress"
  );

  return (
    <div>
      <div className="section-heading section-heading-row" style={{ marginBottom: 20 }}>
        <div>
          <span className="eyebrow">{fixtureSet.category.name}</span>
          <h3>{fixtureSet.name ?? formatLabel(fixtureSet.format)}</h3>
        </div>
        <span className={`status-pill ${getStatusTone(fixtureSet.status)}`}>
          {formatLabel(fixtureSet.status)}
        </span>
      </div>

      {fixtureSet.standings.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <StandingsV2 standings={fixtureSet.standings} />
        </div>
      )}

      {relevantMatches.length > 0 && (
        <div className="live-results-section">
          {relevantMatches.map(({ match, roundName }) => (
            <MatchResultCard
              key={match.id}
              match={match}
              categoryName={fixtureSet.category.name}
              roundName={roundName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchResultCard({
  match,
  categoryName,
  roundName
}: Readonly<{
  match: PublicFixtureMatchDto;
  categoryName: string;
  roundName: string;
}>) {
  const isLive = match.status === "live" || match.status === "in_progress";
  const isCompleted = match.status === "completed";

  let cardClass = "live-result-card";
  if (isLive) cardClass += " result-card-live";
  else if (isCompleted) cardClass += " result-card-completed";

  const sorted = [...match.entrants].sort((a, b) => a.slotNumber - b.slotNumber);

  return (
    <article className={cardClass}>
      <div className="live-result-header">
        <div>
          <span className="live-result-category">{categoryName}</span>
          <span style={{ margin: "0 6px", color: "var(--muted)" }}>·</span>
          <span className="live-result-round">{roundName}</span>
        </div>
        <span className={`status-pill ${getStatusTone(match.status)}`}>
          {isLive ? "🔴 Live" : formatLabel(match.status)}
        </span>
      </div>

      <div className="live-result-body">
        <div className="match-versus">
          {sorted.map((entrant) => (
            <div
              key={entrant.slotNumber}
              className={`match-entrant-row${entrant.isWinner ? " entrant-winner" : ""}`}
            >
              <span className="match-entrant-name">{entrant.displayName}</span>
              {entrant.score !== null && entrant.score !== undefined && (
                <span className="match-entrant-score">{entrant.score}</span>
              )}
            </div>
          ))}
        </div>

        <div className="match-result-footer">
          <span>
            {match.scheduledAt ? formatDateTime(match.scheduledAt) : "Time TBD"}
          </span>
          <span>
            {[match.venueName, match.courtName].filter(Boolean).join(" · ") || "Venue TBD"}
          </span>
        </div>

        {isCompleted && (() => {
          const winner = sorted.find((e) => e.isWinner);
          return winner ? (
            <span className="match-winner-tag">🏆 {winner.displayName} won</span>
          ) : (
            <span className="match-winner-tag">Draw</span>
          );
        })()}
      </div>
    </article>
  );
}

// ─── Standings V2 ─────────────────────────────────────────────────────────────

function StandingsV2({
  standings
}: Readonly<{ standings: PublicFixtureStandingDto[] }>) {
  return (
    <div className="standings-panel-v2">
      <div className="standings-panel-v2-header">
        <h4 className="standings-panel-v2-title">Standings</h4>
        <span className="muted-copy" style={{ fontSize: 13 }}>
          Calculated from completed matches
        </span>
      </div>
      <div className="table-scroll">
        <table className="standings-table-v2" aria-label="Round robin standings">
          <thead>
            <tr>
              <th className="standings-rank-cell">#</th>
              <th className="standings-name-cell">Entrant</th>
              <th className="standings-number-cell">P</th>
              <th className="standings-number-cell">W</th>
              <th className="standings-number-cell">D</th>
              <th className="standings-number-cell">L</th>
              <th className="standings-number-cell">For</th>
              <th className="standings-number-cell">Agst</th>
              <th className="standings-number-cell">Diff</th>
              <th className="standings-points-cell">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => {
              const rankClass =
                s.rank === 1
                  ? " standings-rank-1"
                  : s.rank === 2
                  ? " standings-rank-2"
                  : s.rank === 3
                  ? " standings-rank-3"
                  : "";
              const diffClass =
                s.scoreDifference > 0
                  ? " standings-diff-positive"
                  : s.scoreDifference < 0
                  ? " standings-diff-negative"
                  : "";
              return (
                <tr key={`${s.rank}:${s.displayName}`}>
                  <td className={`standings-rank-cell${rankClass}`}>{s.rank}</td>
                  <td className="standings-name-cell">{s.displayName}</td>
                  <td className="standings-number-cell">{s.played}</td>
                  <td className="standings-number-cell">{s.wins}</td>
                  <td className="standings-number-cell">{s.draws}</td>
                  <td className="standings-number-cell">{s.losses}</td>
                  <td className="standings-number-cell">{s.scoreFor}</td>
                  <td className="standings-number-cell">{s.scoreAgainst}</td>
                  <td className={`standings-number-cell${diffClass}`}>
                    {s.scoreDifference > 0 ? `+${s.scoreDifference}` : s.scoreDifference}
                  </td>
                  <td className="standings-points-cell">{s.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Existing helpers (preserved) ─────────────────────────────────────────────

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
          <span className={`status-pill ${getStatusTone(match.status)}`}>
            {formatLabel(match.status)}
          </span>
          <p>{match.scheduledAt ? formatDateTime(match.scheduledAt) : "Schedule pending"}</p>
          <p>
            {[match.venueName, match.courtName].filter(Boolean).join(" · ") ||
              "Venue to be assigned"}
          </p>
        </div>
      </div>
    </article>
  );
}

function formatPublicEntrants(match: PublicFixtureMatchDto) {
  return [...match.entrants]
    .sort((first, second) => first.slotNumber - second.slotNumber)
    .map((entrant) => {
      const score =
        entrant.score === undefined || entrant.score === null ? "" : ` (${entrant.score})`;
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
