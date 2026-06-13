import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | MatchFlow Arena",
  description: "Manage your player account and tournament registrations."
};

export default function AccountPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Player account</h1>
          <p>Review your tournament registration activity.</p>
        </div>
        <a className="secondary-action" href="/me">Profile</a>
      </section>
      <section className="dashboard-grid">
        <a className="feature-tile browse-tile" href="/account/registrations">
          <span>Registrations</span>
          <h2>My tournament registrations</h2>
          <p>View submitted player registrations and cancel pending entries.</p>
        </a>
        <a className="feature-tile browse-tile" href="/tournaments">
          <span>Discovery</span>
          <h2>Browse tournaments</h2>
          <p>Find open public tournaments by sport, city, and date.</p>
        </a>
      </section>
    </main>
  );
}
