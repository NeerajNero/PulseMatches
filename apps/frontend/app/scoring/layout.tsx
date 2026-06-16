"use client";

import { useEffect, useMemo } from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/route";

export default function ScoringLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = useCurrentUser();
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
    return <main className="dashboard-shell"><p>Loading scoring workspace...</p></main>;
  }

  return (
    <div className="scoring-app-root">
      <nav className="organizer-nav" aria-label="Scoring navigation" style={{ background: 'var(--brand)', color: 'white' }}>
        <a href={ROUTES.SCORING} style={{ color: 'white' }}>Control Center</a>
        <a href={ROUTES.ORGANIZER_DASHBOARD} style={{ color: 'white', opacity: 0.8 }}>Exit to Dashboard</a>
        <button
          type="button"
          style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}
          onClick={() => logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) })}
        >
          Log out
        </button>
      </nav>
      {children}
    </div>
  );
}
