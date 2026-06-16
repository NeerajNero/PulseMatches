"use client";

import { useEffect } from "react";
import { RegistrationList } from "@/components/custom/registrations/registration-list";
import { AccountNavigation } from "@/components/custom/account/account-navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyRegistrations } from "@/hooks/use-registrations";
import { ROUTES } from "@/utils/route";

export default function AccountRegistrationsPage() {
  const currentUser = useCurrentUser();
  const registrations = useMyRegistrations(Boolean(currentUser.data));

  useEffect(() => {
    if (!currentUser.isLoading && !currentUser.data) {
      window.location.assign(ROUTES.LOGIN);
    }
  }, [currentUser.data, currentUser.isLoading]);

  if (currentUser.isLoading || !currentUser.data) {
    return <main className="dashboard-shell"><p>Loading account</p></main>;
  }

  return (
    <main className="dashboard-shell">
      <AccountNavigation />
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Account</span>
          <h1>My registrations</h1>
          <p>{currentUser.data.email}</p>
        </div>
        <a className="secondary-action" href={ROUTES.TOURNAMENTS}>Browse tournaments</a>
      </section>

      {registrations.isLoading ? <p className="state-text compact-state">Loading registrations.</p> : null}
      {registrations.isError ? (
        <section className="empty-state account-empty-state">
          <h2>Unable to load registrations</h2>
          <p>Check that you are signed in and the backend is running.</p>
        </section>
      ) : null}
      {registrations.data ? <RegistrationList registrations={registrations.data} /> : null}
    </main>
  );
}
