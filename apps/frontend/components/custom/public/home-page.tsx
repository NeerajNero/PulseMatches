"use client";

import { DiscoveryControllerFindTournamentsStatusEnum } from "@matchflow/client-sdk";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";
import { TournamentCard } from "@/components/custom/tournaments/tournament-card";
import { useCities, useSports, useTournaments } from "@/hooks/use-discovery";
import { ROUTES } from "@/utils/route";

const organizerTools = [
  "Draft tournament setup",
  "Category planning",
  "Registration workflow planning",
  "Fixture and scoring roadmap"
];

export function HomePageContent() {
  const sports = useSports();
  const cities = useCities();
  const tournaments = useTournaments({
    status: DiscoveryControllerFindTournamentsStatusEnum.Published,
    upcomingOnly: true,
    limit: 3
  });

  return (
    <main className="page-shell">
      <PublicHeader />

      <section className="hero-section product-hero">
        <div className="hero-copy">
          <span className="eyebrow">Sports tournament discovery</span>
          <h1>Find your next match day.</h1>
          <p>
            Discover tournaments, register online, track fixtures, and follow published results across
            active sports and cities.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href={ROUTES.TOURNAMENTS}>Browse tournaments</a>
            <a className="secondary-action" href="#sports">Browse sports</a>
          </div>
          <dl className="hero-highlight-grid" aria-label="Platform highlights">
            <div>
              <dt>Discover</dt>
              <dd>Search published tournaments by sport, city, and schedule.</dd>
            </div>
            <div>
              <dt>Register</dt>
              <dd>Submit player registrations when entries are open.</dd>
            </div>
            <div>
              <dt>Track</dt>
              <dd>Follow fixtures and published results from the tournament page.</dd>
            </div>
            <div>
              <dt>Read</dt>
              <dd>See venue, categories, and current registration state at a glance.</dd>
            </div>
          </dl>
        </div>
        <aside className="score-panel discovery-panel" aria-label="Discovery highlights">
          <div className="score-panel-header">
            <span>Public discovery</span>
            <span className="status-pill status-pill-ready">Live</span>
          </div>
          <dl className="stack-grid">
            <div>
              <dt>Sports</dt>
              <dd>{sports.data?.length ?? 0}</dd>
            </div>
            <div>
              <dt>Cities</dt>
              <dd>{cities.data?.length ?? 0}</dd>
            </div>
            <div>
              <dt>Upcoming</dt>
              <dd>{tournaments.data?.pagination.total ?? 0}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>Public</dd>
            </div>
          </dl>
          <div className="score-panel-footer">
            <span>Ready for players and organizers</span>
            <span>{tournaments.data?.pagination.total ? "Published events" : "No events loaded yet"}</span>
          </div>
        </aside>
      </section>

      <section className="content-band" aria-labelledby="featured-heading">
        <div className="section-heading section-heading-row">
          <div>
            <h2 id="featured-heading">Upcoming tournaments</h2>
            <p>Published events from the current discovery catalog.</p>
          </div>
          <a className="secondary-action" href={ROUTES.TOURNAMENTS}>View all</a>
        </div>
        {tournaments.isLoading ? <p className="state-text compact-state">Loading featured tournaments.</p> : null}
        {tournaments.isError ? <p className="state-text compact-state">Unable to load tournaments right now.</p> : null}
        {!tournaments.isLoading && tournaments.data?.items.length === 0 ? (
          <p className="state-text compact-state">No upcoming public tournaments are available yet.</p>
        ) : null}
        <div className="tournament-grid">
          {(tournaments.data?.items ?? []).map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </section>

      <section id="sports" className="content-band muted-band" aria-labelledby="sports-heading">
        <div className="section-heading">
          <h2 id="sports-heading">Browse by sport</h2>
          <p>Jump into active sport categories and see available public tournaments.</p>
        </div>
        <div className="feature-grid browse-grid">
          {(sports.data ?? []).map((sport) => (
            <a className="feature-tile browse-tile" href={`/sports/${sport.slug}`} key={sport.id}>
              <span>Sport</span>
              <h3>{sport.name}</h3>
              <p>View tournaments and categories for {sport.name.toLowerCase()}.</p>
            </a>
          ))}
        </div>
      </section>

      <section className="content-band" aria-labelledby="cities-heading">
        <div className="section-heading">
          <h2 id="cities-heading">Browse by city</h2>
          <p>Find tournaments near active community sports locations.</p>
        </div>
        <div className="feature-grid browse-grid">
          {(cities.data ?? []).map((city) => (
            <a className="feature-tile browse-tile" href={`/locations/${city.slug}`} key={city.id}>
              <span>{city.countryCode}</span>
              <h3>{city.name}</h3>
              <p>See public tournaments listed for {city.name}.</p>
            </a>
          ))}
        </div>
      </section>

      <section id="organizers" className="content-band organizer-band">
        <div className="section-heading">
          <span className="eyebrow">For organizers</span>
          <h2>Built for tournament operators.</h2>
          <p>
            The organizer workspace keeps drafts, registrations, fixtures, and results organized without
            forcing the public experience to look like an admin tool.
          </p>
        </div>
        <div className="feature-grid">
          {organizerTools.map((tool) => (
            <article className="feature-tile" key={tool}>
              <span>Organizer workflow</span>
              <h3>{tool}</h3>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
