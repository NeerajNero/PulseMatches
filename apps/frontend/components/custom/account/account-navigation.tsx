"use client";

import { useLogout } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/route";

export function AccountNavigation() {
  const logout = useLogout();

  return (
    <nav className="organizer-nav" aria-label="Account navigation">
      <a href={ROUTES.ACCOUNT_DASHBOARD}>Dashboard</a>
      <a href={ROUTES.ACCOUNT_REGISTRATIONS}>Registrations</a>
      <a href={ROUTES.TOURNAMENTS}>Browse tournaments</a>
      <a href={`${ROUTES.ACCOUNT_DASHBOARD}#results`}>Results</a>
      <button
        type="button"
        style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontWeight: 700 }}
        onClick={() => logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) })}
      >
        Log out
      </button>
    </nav>
  );
}
