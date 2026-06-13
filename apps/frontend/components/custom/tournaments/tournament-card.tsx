import type { TournamentListItemDto } from "@matchflow/client-sdk";
import {
  formatDateRange,
  formatFee,
  formatLabel,
  getPrimaryMedia,
  getVenueSummary
} from "@/components/custom/tournaments/tournament-format";
import { tournamentDetailRoute } from "@/utils/route";

export function TournamentCard({ tournament }: Readonly<{ tournament: TournamentListItemDto }>) {
  const media = getPrimaryMedia(tournament);
  const categoryPreview = tournament.categories.slice(0, 3);

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
      <div className="tournament-card-meta">
        <span>{tournament.sport.name}</span>
        <span>{tournament.city.name}</span>
      </div>
      <h2><a href={tournamentDetailRoute(tournament.slug)}>{tournament.title}</a></h2>
      <p>{tournament.shortDescription ?? "Tournament details are available on the event page."}</p>
      <dl className="card-detail-list">
        <div>
          <dt>Date</dt>
          <dd>{formatDateRange(tournament.startsAt, tournament.endsAt)}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{getVenueSummary(tournament)}</dd>
        </div>
        <div>
          <dt>Organizer</dt>
          <dd>{tournament.organizer.organizationName}</dd>
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
        <span>{formatLabel(tournament.registrationAvailability)}</span>
        <a href={tournamentDetailRoute(tournament.slug)}>View details</a>
      </div>
    </article>
  );
}
