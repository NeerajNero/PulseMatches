"use client";

import { useEffect } from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/route";

export default function MePage() {
  const currentUser = useCurrentUser();
  const logout = useLogout();

  useEffect(() => {
    if (!currentUser.isLoading && !currentUser.data) {
      window.location.assign(ROUTES.LOGIN);
    }
  }, [currentUser.data, currentUser.isLoading]);

  if (currentUser.isLoading || !currentUser.data) {
    return <main className="dashboard-shell"><p>Loading profile</p></main>;
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Signed in</span>
          <h1>{currentUser.data.displayName}</h1>
          <p>{currentUser.data.email}</p>
        </div>
        <button
          className="secondary-action"
          type="button"
          onClick={() => logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) })}
        >
          Log out
        </button>
      </section>
      <section className="dashboard-grid">
        <article className="feature-tile">
          <span>Roles</span>
          <h3>{currentUser.data.roles.join(", ")}</h3>
        </article>
        <article className="feature-tile">
          <span>Status</span>
          <h3>{currentUser.data.status}</h3>
        </article>
      </section>
    </main>
  );
}

