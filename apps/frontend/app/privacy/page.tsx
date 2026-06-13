import type { Metadata } from "next";
import { PageHeader } from "@/components/custom/public/page-header";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";

export const metadata: Metadata = {
  title: "Privacy | MatchFlow Arena",
  description: "Privacy information for MatchFlow Arena."
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <PublicHeader />
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy placeholder"
        description="This original placeholder documents the policy surface needed before launch. It is not legal advice."
      />
      <section className="content-band">
        <div className="static-panel">
          <h2>Information handled by the platform</h2>
          <p>
            The current application stores account identity, organizer profile details,
            public sports/cities/venues, tournament data, refresh tokens, and audit logs.
          </p>
          <h2>Future policy updates</h2>
          <p>
            Notifications, real payments, public result publishing, and sport-specific scoring
            are not implemented yet. The policy must be updated before those capabilities are released.
          </p>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
