import type { Metadata } from "next";
import { PageHeader } from "@/components/custom/public/page-header";
import { PublicFooter } from "@/components/custom/public/public-footer";
import { PublicHeader } from "@/components/custom/public/public-header";

export const metadata: Metadata = {
  title: "Contact | MatchFlow Arena",
  description: "Contact MatchFlow Arena for player and organizer questions."
};

export default function ContactPage() {
  return (
    <main className="page-shell">
      <PublicHeader />
      <PageHeader
        eyebrow="Contact"
        title="Reach the MatchFlow Arena team."
        description="Use this page as the public contact surface while dedicated support workflows are planned for later phases."
      />
      <section className="content-band">
        <div className="static-panel">
          <h2>General inquiries</h2>
          <p>Email: hello@matchflow.local</p>
          <p>
            This local placeholder should be replaced with the approved public support
            address before production launch.
          </p>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

