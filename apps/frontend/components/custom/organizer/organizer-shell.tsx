"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useOrganizerProfile } from "@/hooks/use-organizer-profile";
import { ROUTES } from "@/utils/route";

interface OrganizerShellProps {
  actions?: ReactNode;
  children: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
}

export function OrganizerShell({
  actions,
  children,
  eyebrow = "Organizer workspace",
  subtitle,
  title
}: Readonly<OrganizerShellProps>) {
  const currentUser = useCurrentUser();
  const organizerProfile = useOrganizerProfile();
  const logout = useLogout();
  const roles = useMemo(() => currentUser.data?.roles ?? [], [currentUser.data?.roles]);

  useEffect(() => {
    if (!currentUser.isLoading && !currentUser.data) {
      window.location.assign(ROUTES.LOGIN);
      return;
    }
    if (currentUser.data && !roles.includes("ORGANIZER")) {
      window.location.assign(ROUTES.ME);
    }
  }, [currentUser.data, currentUser.isLoading, roles]);

  if (currentUser.isLoading || !currentUser.data || !roles.includes("ORGANIZER")) {
    return <main className="dashboard-shell"><p>Loading organizer workspace</p></main>;
  }

  if (organizerProfile.isError) {
    return (
      <main className="dashboard-shell">
        <section className="empty-state account-empty-state">
          <h1>Organizer profile required</h1>
          <p>Your organizer account needs an organizer profile before tournament management is available.</p>
          <button
            className="secondary-action"
            type="button"
            onClick={() => logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) })}
          >
            Log out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-shell organizer-shell">
      <nav className="organizer-nav" aria-label="Organizer navigation">
        <a href={ROUTES.ORGANIZER_DASHBOARD}>Dashboard</a>
        <a href={ROUTES.ORGANIZER_TOURNAMENTS}>Tournaments</a>
        <a href={ROUTES.SCORING}>Scoring</a>
        <a href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>
        <button
          type="button"
          onClick={() => logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) })}
        >
          Log out
        </button>
      </nav>

      <section className="dashboard-header">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle ?? organizerProfile.data?.organizationName ?? currentUser.data.email}</p>
        </div>
        {actions}
      </section>

      {children}
    </main>
  );
}
