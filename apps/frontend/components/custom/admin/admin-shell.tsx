"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { ROUTES } from "@/utils/route";
import { usePathname } from "next/navigation";

// ===== Inline SVG Icons for Navigation (zero dependency, high performance) =====

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function OrganizersIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function TournamentsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a5 5 0 0 0-5 5v3c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V7a5 5 0 0 0-5-5z" />
    </svg>
  );
}

function RegistrationsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ReconciliationIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V12" />
      <path d="M12 5h8M15 2v6" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function OperationsIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface AdminShellProps {
  children: ReactNode;
  subtitle?: string;
  title: string;
}

export function AdminShell({ children, subtitle, title }: Readonly<AdminShellProps>) {
  const currentUser = useCurrentUser();
  const logout = useLogout();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Automatically close mobile menu when pathname transitions
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isRouteActive = (routePath: string) => {
    if (routePath === ROUTES.ADMIN_DASHBOARD) {
      return pathname === ROUTES.ADMIN_DASHBOARD;
    }
    return pathname === routePath || pathname.startsWith(routePath + "/");
  };

  const navGroups = useMemo(() => [
    {
      title: "Main",
      items: [
        { name: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: DashboardIcon },
      ]
    },
    {
      title: "Directory",
      items: [
        { name: "Users", href: ROUTES.ADMIN_USERS, icon: UsersIcon },
        { name: "Organizers", href: ROUTES.ADMIN_ORGANIZERS, icon: OrganizersIcon },
      ]
    },
    {
      title: "Events & Finance",
      items: [
        { name: "Tournaments", href: ROUTES.ADMIN_TOURNAMENTS, icon: TournamentsIcon },
        { name: "Registrations", href: ROUTES.ADMIN_REGISTRATIONS, icon: RegistrationsIcon },
        { name: "Payments", href: ROUTES.ADMIN_PAYMENTS, icon: PaymentsIcon },
      ]
    },
    {
      title: "System & Operations",
      items: [
        { name: "Notifications", href: ROUTES.ADMIN_NOTIFICATIONS, icon: NotificationsIcon },
        { name: "Reconciliation", href: ROUTES.ADMIN_RECONCILIATION, icon: ReconciliationIcon },
        { name: "Operations", href: ROUTES.ADMIN_OPERATIONS, icon: OperationsIcon },
        { name: "Audit", href: ROUTES.ADMIN_AUDIT, icon: AuditIcon },
      ]
    }
  ], []);

  if (currentUser.isLoading || !currentUser.data || !roles.includes("ADMIN")) {
    return <main className="dashboard-shell admin-shell"><p>Loading admin workspace.</p></main>;
  }

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => window.location.assign(ROUTES.LOGIN) });
  };

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Responsive Sidebar Drawer */}
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header flex justify-between items-center w-full">
          <div className="brand">
            <span className="brand-mark">M</span>
            <span>MatchFlow Admin</span>
          </div>
          <button
            type="button"
            className="md:hidden p-1 hover:bg-slate-100 rounded-md"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="admin-sidebar-content" aria-label="Admin Navigation">
          {navGroups.map((group) => (
            <div key={group.title} className="admin-sidebar-group">
              <span className="admin-sidebar-group-title">{group.title}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(item.href);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`admin-sidebar-link ${active ? "active" : ""}`}
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-sidebar-link text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogoutIcon />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="admin-content-area">
        {/* Mobile Header Bar */}
        <header className="admin-mobile-topbar">
          <div className="brand">
            <span className="brand-mark">M</span>
            <span>MatchFlow</span>
          </div>
          <button
            type="button"
            className="p-1 hover:bg-slate-100 rounded-md"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </button>
        </header>

        {/* Content wrapper with centered max-width alignment */}
        <main className="admin-content-wrapper">
          <section className="dashboard-header">
            <div>
              <span className="eyebrow">Platform support</span>
              <h1>{title}</h1>
              <p>{subtitle ?? "Read-only operational visibility for support investigations."}</p>
            </div>
          </section>

          {children}
        </main>
      </div>
    </div>
  );
}

