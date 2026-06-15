"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/route";

interface AdminShellProps {
  children: ReactNode;
  subtitle?: string;
  title: string;
}

export function AdminShell({ children, subtitle, title }: Readonly<AdminShellProps>) {
  const currentUser = useCurrentUser();
  const logout = useLogout();
  const roles = useMemo(() => currentUser.data?.roles ?? [], [currentUser.data?.roles]);

  useEffect(() => {
    if (!currentUser.isLoading && !currentUser.data) {
      window.location.assign(ROUTES.LOGIN);
      return;
    }
    if (currentUser.data && !roles.includes("ADMIN")) {
      window.location.assign(ROUTES.ME);
    }
  }, [currentUser.data, currentUser.isLoading, roles]);

  if (currentUser.isLoading || !currentUser.data || !roles.includes("ADMIN")) {
    return <main className="dashboard-shell admin-shell"><p>Loading admin workspace.</p></main>;
  }

  return (
    <main className="dashboard-shell admin-shell">
      <nav className="organizer-nav admin-nav" aria-label="Admin navigation">
        <a href={ROUTES.ADMIN_DASHBOARD}>Dashboard</a>
        <a href={ROUTES.ADMIN_USERS}>Users</a>
        <a href={ROUTES.ADMIN_ORGANIZERS}>Organizers</a>
        <a href={ROUTES.ADMIN_TOURNAMENTS}>Tournaments</a>
        <a href={ROUTES.ADMIN_REGISTRATIONS}>Registrations</a>
        <a href={ROUTES.ADMIN_PAYMENTS}>Payments</a>
        <a href={ROUTES.ADMIN_NOTIFICATIONS}>Notifications</a>
        <a href={ROUTES.ADMIN_RECONCILIATION}>Reconciliation</a>
        <a href={ROUTES.ADMIN_OPERATIONS}>Operations</a>
        <a href={ROUTES.ADMIN_AUDIT}>Audit</a>
        <button
          type="button"
          onClick={() => logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) })}
        >
          Log out
        </button>
      </nav>

      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Platform support</span>
          <h1>{title}</h1>
          <p>{subtitle ?? "Read-only operational visibility for support investigations."}</p>
        </div>
      </section>

      {children}
    </main>
  );
}
