import type { Metadata } from "next";
import { PageHeader } from "@/components/custom/public/page-header";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";

export const metadata: Metadata = {
  title: "About | MatchFlow Arena",
  description: "Learn about MatchFlow Arena, an original sports tournament discovery platform."
};

export default function AboutPage() {
  return (
    <main className="page-shell">
      <PublicHeader />
      <PageHeader
        eyebrow="About"
        title="Community sports need clear tournament tools."
        description="MatchFlow Arena helps players discover public tournaments and gives organizers a phased path toward structured registration, fixtures, schedules, and results."
      />
      <section className="content-band">
        <div className="feature-grid">
          <article className="feature-tile">
            <span>Players</span>
            <h2>Find relevant events</h2>
            <p>Browse tournaments by city, sport, dates, and available categories.</p>
          </article>
          <article className="feature-tile">
            <span>Organizers</span>
            <h2>Prepare better match days</h2>
            <p>Organizer workflows are being added in planned phases without changing the public discovery base.</p>
          </article>
          <article className="feature-tile">
            <span>Platform</span>
            <h2>Keep the structure visible</h2>
            <p>Published tournaments, active cities, and active sports are modeled through the existing API.</p>
          </article>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

