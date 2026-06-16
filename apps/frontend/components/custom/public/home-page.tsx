"use client";

import { DiscoveryControllerFindTournamentsStatusEnum } from "@matchflow/client-sdk";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";
import { TournamentCardV2 } from "@/components/custom/tournaments/tournament-card-v2";
import { useCities, useSports, useTournaments } from "@/hooks/use-discovery";
import { ROUTES } from "@/utils/route";
import { formatDateRange } from "@/components/custom/tournaments/tournament-format";

// Sport emoji/icon mapping
const SPORT_ICONS: Record<string, string> = {
  tennis: "🎾",
  badminton: "🏸",
  squash: "🎱",
  football: "⚽",
  cricket: "🏏",
  basketball: "🏀",
  volleyball: "🏐",
  tabletennis: "🏓",
  chess: "♟️",
  default: "🏆"
};

function getSportIcon(slug: string): string {
  const key = slug.toLowerCase().replace(/[^a-z]/g, "");
  return SPORT_ICONS[key] ?? SPORT_ICONS.default;
}

export function HomePageContent() {
  const sports = useSports();
  const cities = useCities();

  const upcomingTournaments = useTournaments({
    status: DiscoveryControllerFindTournamentsStatusEnum.Published,
    upcomingOnly: true,
    limit: 6
  });

  const allTournaments = useTournaments({
    status: DiscoveryControllerFindTournamentsStatusEnum.Published,
    limit: 3
  });

  const featuredItems = upcomingTournaments.data?.items ?? [];

  const liveItems = (allTournaments.data?.items ?? []).filter(
    (t) => t.status === "live" || t.status === "in_progress"
  );

  const upcomingRegistration = (upcomingTournaments.data?.items ?? [])
    .filter(
      (t) =>
        t.registrationAvailability === "open" ||
        t.registrationAvailability === "registration_open"
    )
    .slice(0, 3);

  const totalTournaments = upcomingTournaments.data?.pagination.total ?? 0;
  const totalSports = sports.data?.length ?? 0;
  const totalCities = cities.data?.length ?? 0;

  return (
    <main className="page-shell">
      <PublicHeader />

      {/* Live Ticker Strip — only visible when live matches exist */}
      {liveItems.length > 0 && (
        <div className="live-ticker-strip" role="marquee" aria-label="Live matches ticker">
          <div className="live-ticker-inner">
            <span className="live-ticker-label">Live</span>
            <div className="live-ticker-scroll">
              {/* Duplicate array to create seamless loop */}
              {[...liveItems, ...liveItems].map((t, i) => (
                <span key={`${t.id}-${i}`} className="ticker-match">
                  <span className="ticker-match-sport">{t.sport.name}</span>
                  <span className="ticker-match-teams">{t.title}</span>
                  <span className="ticker-match-score">{t.city.name}</span>
                  <span className="ticker-separator" aria-hidden="true">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section className="hero-section-v2" aria-labelledby="hero-heading">
        <div className="hero-content-v2">
          {/* Left column: copy */}
          <div className="hero-copy-v2">
            <span className="hero-eyebrow-v2">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Sports Tournament Discovery
            </span>

            <h1 className="hero-title-v2" id="hero-heading">
              Find your
              <br />
              <em>next match.</em>
            </h1>

            <p className="hero-subtitle-v2">
              Discover tournaments, track live fixtures, follow published results, and register for
              upcoming events — across top sports and cities.
            </p>

            <div className="hero-actions-v2">
              <a className="hero-cta-primary" href={ROUTES.TOURNAMENTS} id="hero-browse-btn">
                Browse Tournaments
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a className="hero-cta-secondary" href="#sports" id="hero-sports-btn">
                Browse Sports
              </a>
            </div>

            <div className="hero-stats-row" aria-label="Platform highlights">
              <div className="hero-stat">
                <span className="hero-stat-number">{totalTournaments || "—"}</span>
                <span className="hero-stat-label">Upcoming Events</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">{totalSports || "—"}</span>
                <span className="hero-stat-label">Sports</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">{totalCities || "—"}</span>
                <span className="hero-stat-label">Cities</span>
              </div>
            </div>
          </div>

          {/* Right column: live panel */}
          <aside className="live-matches-panel" aria-label="Live matches and upcoming registrations">
            <div className="live-matches-panel-header">
              <p className="live-matches-panel-title">
                {liveItems.length > 0 ? "Live Now" : "Opening Soon"}
              </p>
              {liveItems.length > 0 && <span className="live-badge">Live</span>}
            </div>

            {liveItems.length > 0 ? (
              liveItems.slice(0, 3).map((t) => (
                <a
                  key={t.id}
                  href={`/tournaments/${t.slug}`}
                  className="live-match-item"
                  aria-label={`${t.title} — live now in ${t.city.name}`}
                >
                  <span className="live-match-sport-tag">{t.sport.name}</span>
                  <p className="live-match-title">{t.title}</p>
                  <span className="live-match-venue">📍 {t.venue?.name ?? t.city.name}</span>
                </a>
              ))
            ) : (
              <p className="panel-empty-message">No live matches right now</p>
            )}

            {upcomingRegistration.length > 0 && (
              <>
                <p className="panel-section-label">Registration Open</p>
                {upcomingRegistration.map((t) => (
                  <a
                    key={t.id}
                    href={`/tournaments/${t.slug}`}
                    className="upcoming-deadline-item"
                    aria-label={`${t.title} — registration open`}
                  >
                    <span className="upcoming-deadline-icon" aria-hidden="true">⏰</span>
                    <div className="upcoming-deadline-info">
                      <span className="upcoming-deadline-title">{t.title}</span>
                      <span className="upcoming-deadline-date">
                        {formatDateRange(t.startsAt, t.endsAt)} · {t.city.name}
                      </span>
                    </div>
                  </a>
                ))}
              </>
            )}

            {liveItems.length === 0 && upcomingRegistration.length === 0 && (
              <p className="panel-empty-message">Check back as events go live</p>
            )}
          </aside>
        </div>
      </section>

      {/* ── Featured Upcoming Tournaments ──────────────────────────── */}
      <section className="content-band" aria-labelledby="featured-heading">
        <div className="section-heading section-heading-row">
          <div>
            <h2 id="featured-heading">Upcoming Tournaments</h2>
            <p>Published events from the current discovery catalog.</p>
          </div>
          <a className="secondary-action" href={ROUTES.TOURNAMENTS}>
            View all →
          </a>
        </div>

        {upcomingTournaments.isLoading && (
          <p className="state-text compact-state">Loading featured tournaments…</p>
        )}
        {upcomingTournaments.isError && (
          <p className="state-text compact-state">Unable to load tournaments right now.</p>
        )}
        {!upcomingTournaments.isLoading && featuredItems.length === 0 && (
          <p className="state-text compact-state">
            No upcoming public tournaments are available yet.
          </p>
        )}

        <div className="tournament-grid" role="list">
          {featuredItems.map((tournament) => (
            <div key={tournament.id} role="listitem">
              <TournamentCardV2 tournament={tournament} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Sport ────────────────────────────────────────── */}
      <section id="sports" className="content-band muted-band" aria-labelledby="sports-heading">
        <div className="section-heading">
          <h2 id="sports-heading">Browse by Sport</h2>
          <p>Jump into active sport categories and see available public tournaments.</p>
        </div>
        <div className="feature-grid browse-grid">
          {(sports.data ?? []).map((sport) => (
            <a
              className="sport-tile-v2"
              href={`/sports/${sport.slug}`}
              key={sport.id}
              id={`sport-tile-${sport.slug}`}
            >
              <div className="sport-tile-icon" aria-hidden="true">
                {getSportIcon(sport.slug)}
              </div>
              <h3 className="sport-tile-name">{sport.name}</h3>
              <p className="sport-tile-meta">View tournaments for {sport.name.toLowerCase()}</p>
              <span className="sport-tile-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Browse by City ─────────────────────────────────────────── */}
      <section className="content-band" aria-labelledby="cities-heading">
        <div className="section-heading">
          <h2 id="cities-heading">Browse by City</h2>
          <p>Find tournaments near active community sports locations.</p>
        </div>
        <div className="feature-grid browse-grid">
          {(cities.data ?? []).map((city) => (
            <a
              className="sport-tile-v2"
              href={`/locations/${city.slug}`}
              key={city.id}
              id={`city-tile-${city.slug}`}
            >
              <div className="sport-tile-icon" aria-hidden="true">
                📍
              </div>
              <h3 className="sport-tile-name">{city.name}</h3>
              <p className="sport-tile-meta">
                <span style={{ opacity: 0.6, fontSize: "12px", fontWeight: 600 }}>
                  {city.countryCode}
                </span>
                {" · "}
                Public tournaments in {city.name}
              </p>
              <span className="sport-tile-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Organizer CTA Band ─────────────────────────────────────── */}
      <section
        id="organizers"
        className="content-band"
        style={{
          background: "linear-gradient(135deg, #10231d 0%, #0f3027 100%)",
          borderTop: "none"
        }}
        aria-labelledby="organizer-heading"
      >
        <div
          className="section-heading"
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}
        >
          <span className="eyebrow" style={{ color: "#4ade80" }}>
            For Organizers
          </span>
          <h2 id="organizer-heading" style={{ color: "#fff", fontSize: 38 }}>
            Built for tournament operators.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, marginBottom: 28 }}>
            The organizer workspace keeps drafts, registrations, fixtures, and results organized
            without forcing the public experience to look like an admin tool.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="hero-cta-primary" href={ROUTES.SIGNUP} id="organizer-signup-cta">
              Get started free
            </a>
            <a className="hero-cta-secondary" href={ROUTES.LOGIN} id="organizer-login-cta">
              Log in
            </a>
          </div>
        </div>

        <div className="feature-grid" style={{ marginTop: 40 }}>
          {ORGANIZER_FEATURES.map((feature) => (
            <article
              className="feature-tile"
              key={feature.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              <span style={{ fontSize: 22, marginBottom: 10, display: "block" }}>
                {feature.icon}
              </span>
              <h3 style={{ color: "#fff", marginBottom: 8 }}>{feature.label}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)" }}>{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

const ORGANIZER_FEATURES: Array<{ icon: string; label: string; desc: string }> = [
  {
    icon: "📋",
    label: "Draft & Publish",
    desc: "Set up tournaments, categories, and entry requirements in minutes."
  },
  {
    icon: "📝",
    label: "Registration Management",
    desc: "Review entries, manage payments, and track player sign-ups."
  },
  {
    icon: "🏆",
    label: "Fixtures & Brackets",
    desc: "Generate knockout or round-robin brackets with automatic seeding."
  },
  {
    icon: "📊",
    label: "Live Scoring",
    desc: "Courtside app for real-time score submission during matches."
  },
  {
    icon: "📤",
    label: "Publish Results",
    desc: "Instantly surface completed scoreboards to public fans."
  },
  {
    icon: "💳",
    label: "Payment Tracking",
    desc: "Full audit trail for entry fees and reconciliation."
  }
];
