"use client";

import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/auth-token-store";
import { ROUTES } from "@/utils/route";

// SVG icon components — inline for zero dependency
function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconTournaments() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M4 14c0-2 1.5-3.5 3.5-3.5" />
      <path d="M20 14c0-2-1.5-3.5-3.5-3.5" />
      <path d="M1.5 20c0-2 1-3.5 2.5-3.5" />
      <path d="M22.5 20c0-2-1-3.5-2.5-3.5" />
    </svg>
  );
}

function IconScoring() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconAccount() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  id: string;
}

export function MobileBottomNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setIsAuthenticated(Boolean(getAccessToken()));
    setCurrentPath(window.location.pathname);
  }, []);

  const navItems: NavItem[] = [
    {
      id: "mobile-nav-home",
      href: ROUTES.HOME,
      label: "Home",
      icon: <IconHome />
    },
    {
      id: "mobile-nav-tournaments",
      href: ROUTES.TOURNAMENTS,
      label: "Tournaments",
      icon: <IconTournaments />
    },
    ...(isAuthenticated
      ? [
          {
            id: "mobile-nav-scoring",
            href: ROUTES.SCORING,
            label: "Scoring",
            icon: <IconScoring />
          },
          {
            id: "mobile-nav-account",
            href: ROUTES.ACCOUNT_DASHBOARD,
            label: "Account",
            icon: <IconAccount />
          }
        ]
      : [
          {
            id: "mobile-nav-login",
            href: ROUTES.LOGIN,
            label: "Log in",
            icon: <IconLogin />
          }
        ])
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation" role="navigation">
      {navItems.map((item) => {
        const isActive =
          item.href === ROUTES.HOME
            ? currentPath === "/"
            : currentPath.startsWith(item.href);

        return (
          <a
            key={item.id}
            id={item.id}
            href={item.href}
            className={`mobile-bottom-nav-item${isActive ? " mobile-bottom-nav-item-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="mobile-bottom-nav-icon">{item.icon}</span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
