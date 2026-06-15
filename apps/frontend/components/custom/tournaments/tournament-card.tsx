import type { TournamentListItemDto } from "@matchflow/client-sdk";
import {
  formatDateRange,
  formatFee,
  formatLabel,
  getPrimaryMedia,
  getStatusTone,
  getVenueSummary
} from "@/components/custom/tournaments/tournament-format";
import { tournamentDetailRoute } from "@/utils/route";

export function TournamentCard({ tournament }: Readonly<{ tournament: TournamentListItemDto }>) {
  const media = getPrimaryMedia(tournament);
  const categoryPreview = tournament.categories.slice(0, 3);
  const availabilityTone = getStatusTone(tournament.registrationAvailability);

  return (
    <article className="tournament-card">
      {media ? (
        <div
          className="tournament-card-image"
          role="img"
          aria-label={media.altText ?? `${tournament.title} tournament`}
          style={{ backgroundImage: `url(${media.url})` }}
        />
      ) : (
        <div className="tournament-card-image tournament-card-image-fallback" aria-hidden="true">
          {tournament.sport.name}
        </div>
      )}
      <div className="status-pill-row tournament-card-badges">
        <span className={`status-pill ${getStatusTone(tournament.status)}`}>{formatLabel(tournament.status)}</span>
        <span className={`status-pill ${availabilityTone}`}>{formatLabel(tournament.registrationAvailability)}</span>
      </div>
      <h2><a href={tournamentDetailRoute(tournament.slug)}>{tournament.title}</a></h2>
      <p>{tournament.shortDescription ?? "Tournament details are available on the event page."}</p>
      <dl className="card-detail-list tournament-card-details">
        <div>
          <dt>Sport</dt>
          <dd>{tournament.sport.name}</dd>
        </div>
        <div>
          <dt>Start date</dt>
          <dd>{formatDateRange(tournament.startsAt, tournament.endsAt)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{getVenueSummary(tournament)}</dd>
        </div>
        <div>
          <dt>Entry fee</dt>
          <dd>{formatEntryFee(tournament.categories)}</dd>
        </div>
      </dl>
      {categoryPreview.length > 0 ? (
        <div className="category-chip-row" aria-label="Tournament categories">
          {categoryPreview.map((category) => (
            <span className="category-chip" key={category.id}>
              {category.name} - {formatFee(category)}
            </span>
          ))}
        </div>
      ) : null}
      <div className="tournament-card-footer">
        <span>{tournament.city.name}</span>
        <a href={tournamentDetailRoute(tournament.slug)}>View details</a>
      </div>
    </article>
  );
}

function formatEntryFee(categories: TournamentListItemDto["categories"]) {
  if (categories.length === 0) {
    return "Not set";
  }
  if (categories.every((category) => category.entryFeeAmount === 0)) {
    return "Free entry";
  }
  const firstPaidCategory = categories.find((category) => category.entryFeeAmount > 0);
  return firstPaidCategory ? formatFee(firstPaidCategory) : "Free entry";
}
