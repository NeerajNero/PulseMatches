import type { Metadata } from "next";
import { PageHeader } from "@/components/custom/public/page-header";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";

export const metadata: Metadata = {
  title: "Terms | MatchFlow Arena",
  description: "Terms information for MatchFlow Arena."
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <PublicHeader />
      <PageHeader
        eyebrow="Terms"
        title="Terms and conditions placeholder"
        description="This original placeholder marks the terms surface required before production use. It is not legal advice."
      />
      <section className="content-band">
        <div className="static-panel">
          <h2>Current public functionality</h2>
          <p>
            MatchFlow Arena currently supports public tournament discovery, account creation,
            player registration, organizer tournament setup, rosters, fixtures, and manual scoring.
          </p>
          <h2>Future functionality</h2>
          <p>
            Public result publishing, notifications, sport-specific scoring, and real payments
            require approved implementation phases and updated terms.
          </p>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
