"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-token-store";
import { ROUTES } from "@/utils/route";

export function PublicHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(getAccessToken()));
  }, []);

  return (
    <header className="topbar listing-topbar" aria-label="Main navigation">
      <a className="brand" href={ROUTES.HOME}>
        <span className="brand-mark" aria-hidden="true">MF</span>
        <span>MatchFlow Arena</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href={ROUTES.TOURNAMENTS}>Tournaments</a>
        <a href="/sports/all" aria-label="Browse by sport">Sports</a>
        <a href={ROUTES.ABOUT}>About</a>
        {isAuthenticated ? (
          <a className="nav-dashboard-link" href={ROUTES.ACCOUNT_DASHBOARD}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </a>
        ) : (
          <>
            <a href={ROUTES.LOGIN}>Log in</a>
            <a className="nav-cta" href={ROUTES.SIGNUP}>Sign up</a>
          </>
        )}
      </nav>
    </header>
  );
}
