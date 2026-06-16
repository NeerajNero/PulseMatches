import type { TournamentListItemDto } from "@matchflow/client-sdk";
import {
  formatDateRange,
  formatFee,
  getPrimaryMedia,
  getVenueSummary
} from "@/components/custom/tournaments/tournament-format";
import { tournamentDetailRoute } from "@/utils/route";

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

function getSportIcon(sportSlug: string): string {
  const slug = sportSlug.toLowerCase().replace(/[^a-z]/g, "");
  return SPORT_ICONS[slug] ?? SPORT_ICONS.default;
}

function getStatusClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "live" || s === "in_progress") return "status-pill status-live";
  if (s === "registration_open" || s === "open") return "status-pill status-open";
  if (s === "upcoming" || s === "scheduled" || s === "planned") return "status-pill status-upcoming";
  if (s === "completed" || s === "closed") return "status-pill status-completed";
  return "status-pill status-pill-neutral";
}

function getStatusLabel(status: string): string {
  const s = status.toLowerCase();
  if (s === "live" || s === "in_progress") return "🔴 Live";
  if (s === "registration_open" || s === "open") return "✅ Registration Open";
  if (s === "upcoming" || s === "scheduled" || s === "planned") return "🔵 Upcoming";
  if (s === "completed" || s === "closed") return "Completed";
  return status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getEntryFeeDisplay(categories: TournamentListItemDto["categories"]): string {
  if (categories.length === 0) return "—";
  if (categories.every((c) => c.entryFeeAmount === 0)) return "Free";
  const first = categories.find((c) => c.entryFeeAmount > 0);
  return first ? formatFee(first) : "Free";
}

export function TournamentCardV2({ tournament }: Readonly<{ tournament: TournamentListItemDto }>) {
  const media = getPrimaryMedia(tournament);
  const icon = getSportIcon(tournament.sport.slug);

  return (
    <article className="tournament-card-v2">
      <div
        className={`tournament-card-v2-image${!media ? " tournament-card-v2-image-fallback" : ""}`}
        role={media ? "img" : "presentation"}
        aria-label={media ? (media.altText ?? tournament.title) : undefined}
        style={media ? { backgroundImage: `url(${media.url})` } : undefined}
      >
        {!media && (
          <span aria-hidden="true">
            {icon} {tournament.sport.name}
          </span>
        )}
        <div className="tournament-card-v2-status-overlay">
          <span className={getStatusClass(tournament.status)}>
            {getStatusLabel(tournament.status)}
          </span>
        </div>
      </div>

      <div className="tournament-card-v2-body">
        <div className="tournament-card-v2-sport">
          <span aria-hidden="true">{icon}</span>
          {tournament.sport.name}
        </div>

        <h2 className="tournament-card-v2-title">
          <a href={tournamentDetailRoute(tournament.slug)}>{tournament.title}</a>
        </h2>

        {tournament.shortDescription ? (
          <p className="tournament-card-v2-desc">{tournament.shortDescription}</p>
        ) : null}

        <dl className="tournament-card-v2-meta">
          <div className="tournament-card-v2-meta-item">
            <dt className="tournament-card-v2-meta-label">📅 Dates</dt>
            <dd className="tournament-card-v2-meta-value">
              {formatDateRange(tournament.startsAt, tournament.endsAt)}
            </dd>
          </div>
          <div className="tournament-card-v2-meta-item">
            <dt className="tournament-card-v2-meta-label">📍 Venue</dt>
            <dd className="tournament-card-v2-meta-value">{getVenueSummary(tournament)}</dd>
          </div>
          <div className="tournament-card-v2-meta-item">
            <dt className="tournament-card-v2-meta-label">💰 Entry</dt>
            <dd className="tournament-card-v2-meta-value">
              <span className="fee-badge">{getEntryFeeDisplay(tournament.categories)}</span>
            </dd>
          </div>
          <div className="tournament-card-v2-meta-item">
            <dt className="tournament-card-v2-meta-label">🏷️ Registration</dt>
            <dd className="tournament-card-v2-meta-value">
              <span className={getStatusClass(tournament.registrationAvailability)}>
                {getStatusLabel(tournament.registrationAvailability)}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="tournament-card-v2-footer">
        <span className="tournament-card-v2-city">📍 {tournament.city.name}</span>
        <a className="tournament-card-v2-link" href={tournamentDetailRoute(tournament.slug)}>
          View details →
        </a>
      </div>
    </article>
  );
}
