"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { formatDateRange, formatLabel } from "@/components/custom/tournaments/tournament-format";
import { useOrganizerDashboard } from "@/hooks/use-organizer-tournaments";
import { apiClient } from "@/lib/apis/api";
import { ORGANIZER_TOURNAMENT_QUERY_KEYS } from "@/utils/query-constants";
import {
  organizerTournamentCategoriesRoute,
  organizerTournamentEditRoute,
  organizerTournamentFixturesRoute,
  organizerTournamentPaymentsRoute,
  organizerTournamentRegistrationsRoute,
  ROUTES
} from "@/utils/route";

// Icons for Quick Actions & Empty States
function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconScoring() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function OrganizerDashboardView() {
  const dashboard = useOrganizerDashboard();
  
  const tournamentIds = useMemo(() => 
    dashboard.data?.recentTournaments.map(t => t.id) ?? [], 
    [dashboard.data?.recentTournaments]
  );

  const reportQueries = useQueries({
    queries: tournamentIds.map(id => ({
      queryKey: ORGANIZER_TOURNAMENT_QUERY_KEYS.REPORT_SUMMARY(id, {}),
      queryFn: async () => {
        const response = await apiClient.organizerRosters.organizerRostersControllerGetReportSummary({ id });
        return response.data;
      },
      enabled: Boolean(id)
    }))
  });

  // 1. Premium Skeleton Loading State
  if (dashboard.isLoading) {
    return (
      <div className="dashboard-shell" style={{ padding: "0 0 40px 0" }}>
        <div className="skeleton-pulse" style={{ height: "36px", width: "320px", marginBottom: "32px" }}></div>
        
        {/* Metric Cards Skeleton */}
        <div className="dashboard-grid organizer-stat-grid" style={{ marginBottom: "40px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="feature-tile skeleton-pulse" style={{ height: "132px", border: "none" }}></div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="skeleton-pulse" style={{ height: "80px", marginBottom: "40px", borderRadius: "14px" }}></div>

        {/* List Header Skeleton */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <div className="skeleton-pulse" style={{ height: "28px", width: "220px" }}></div>
          <div className="skeleton-pulse" style={{ height: "28px", width: "100px" }}></div>
        </div>

        {/* Cards Skeleton */}
        <div className="organizer-table" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="skeleton-pulse" style={{ height: "180px", borderRadius: "16px" }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <section className="premium-empty-state" style={{ marginTop: "40px" }}>
        <div className="empty-state-icon" style={{ color: "#ef4444" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Unable to load dashboard</h2>
        <p>Check that the database is populated and your organizer account is active.</p>
      </section>
    );
  }

  // Aggregate stats from report queries
  let unscoredMatches = 0;
  let totalMatches = 0;
  let pendingPayments = 0;
  
  reportQueries.forEach(query => {
    if (query.data) {
      const matchCount = query.data.fixtureCount * 2;
      totalMatches += matchCount;
      unscoredMatches += matchCount - query.data.completedMatchCount;
      const pendingPay = query.data.paymentsByStatus.find(p => p.status === 'pending' || p.status === 'pending_offline');
      if (pendingPay) pendingPayments += pendingPay.count;
    }
  });

  const activeTournamentsCount = dashboard.data.publishedTournaments;
  const scoredMatchesCount = totalMatches - unscoredMatches;

  const attentionItems = [];
  if (dashboard.data.pendingRegistrations > 0) {
    attentionItems.push({
      label: "Pending registrations",
      count: dashboard.data.pendingRegistrations,
      action: "Review entries",
      href: ROUTES.ORGANIZER_TOURNAMENTS
    });
  }

  if (pendingPayments > 0) {
    attentionItems.push({
      label: "Payments to verify",
      count: pendingPayments,
      action: "Verify payments",
      href: ROUTES.ORGANIZER_TOURNAMENTS
    });
  }

  return (
    <div className="dashboard-shell" style={{ padding: "0 0 40px 0" }}>
      {/* 2. Operational Metric Cards Grid */}
      <section className="dashboard-grid organizer-stat-grid" style={{ marginBottom: "32px" }}>
        <article className="feature-tile" style={{ borderLeft: "4px solid #0f766e" }}>
          <span>Active Tournaments</span>
          <h3 style={{ fontSize: "28px", fontWeight: 800 }}>{activeTournamentsCount}</h3>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--muted)" }}>
            {dashboard.data.draftTournaments} Drafts · {dashboard.data.totalTournaments} Total
          </p>
        </article>
        <article className="feature-tile" style={{ borderLeft: "4px solid #e11d48" }}>
          <span>Matches Today</span>
          <h3 style={{ fontSize: "28px", fontWeight: 800 }}>
            {scoredMatchesCount} <span style={{ fontSize: "15px", color: "var(--muted)", fontWeight: 400 }}>/ {totalMatches} Scored</span>
          </h3>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--muted)" }}>
            {unscoredMatches} awaiting scoring
          </p>
        </article>
        <article className="feature-tile" style={{ borderLeft: "4px solid #d97706" }}>
          <span>Pending Registrations</span>
          <h3 style={{ fontSize: "28px", fontWeight: 800 }}>{dashboard.data.pendingRegistrations}</h3>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--muted)" }}>
            {dashboard.data.totalRegistrations} Total entrants registered
          </p>
        </article>
        <article className="feature-tile" style={{ borderLeft: "4px solid #3b82f6" }}>
          <span>Pending Payments</span>
          <h3 style={{ fontSize: "28px", fontWeight: 800 }}>{pendingPayments}</h3>
          <p style={{ fontSize: "12px", marginTop: "4px", color: "var(--muted)" }}>
            Requires offline verification
          </p>
        </article>
      </section>

      {/* 3. Quick Actions Row */}
      <section style={{ marginBottom: "40px" }} aria-label="Organizer Quick Actions">
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          boxShadow: "var(--shadow-soft)"
        }}>
          <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            minHeight: "48px",
            fontSize: "14px",
            fontWeight: "700"
          }}>
            <IconPlus /> Create Tournament
          </a>
          <a className="primary-action" href={ROUTES.SCORING} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            minHeight: "48px",
            fontSize: "14px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            border: "none",
            boxShadow: "0 4px 14px rgba(217, 119, 6, 0.3)"
          }}>
            <IconScoring /> Open Scoring App
          </a>
          <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            minHeight: "48px",
            fontSize: "14px",
            fontWeight: "700"
          }}>
            <IconFolder /> Manage Tournaments
          </a>
        </div>
      </section>

      {/* Attention Required Warnings Panel */}
      {attentionItems.length > 0 && (
        <section className="organizer-panel" style={{ borderLeft: "4px solid #d97706", marginBottom: "40px" }}>
          <div className="section-heading organizer-section-heading">
            <div>
              <h2 style={{ color: "#d97706", fontSize: "20px", fontWeight: "800" }}>Attention Required</h2>
              <p>Items across your tournaments that need immediate action.</p>
            </div>
          </div>
          <div className="organizer-table">
            {attentionItems.map((item, idx) => (
              <article className="organizer-table-row" key={idx} style={{ background: "rgba(217, 119, 6, 0.03)" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 4px 0" }}>{item.label}</h3>
                  <p>{item.count} items awaiting review.</p>
                </div>
                <div className="organizer-row-actions">
                  <a className="primary-action" href={item.href} style={{ padding: "8px 16px", fontSize: "13px" }}>{item.action}</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 4. Overhauled Recent Tournaments Cards */}
      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Recent Tournaments</h2>
            <p>Direct access to manage categories, registrations, payments, and fixtures.</p>
          </div>
          <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS} style={{ padding: "8px 16px", fontSize: "13px" }}>View all</a>
        </div>
        
        {dashboard.data.recentTournaments.length === 0 ? (
          /* Branded Empty State */
          <section className="premium-empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
            </div>
            <h2>Your courts are empty</h2>
            <p>Create your first tournament to start managing entries and fixtures.</p>
            <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW} style={{ marginTop: "12px" }}>
              Host your first Tournament
            </a>
          </section>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
            {dashboard.data.recentTournaments.map((tournament, idx) => {
              const stats = reportQueries[idx]?.data;
              const isPublished = tournament.status === "published";
              
              // Compute completion percentage
              const totalMatchesCount = stats ? stats.fixtureCount * 2 : 0;
              const completedCount = stats ? stats.completedMatchCount : 0;
              const pct = totalMatchesCount > 0 ? Math.round((completedCount / totalMatchesCount) * 100) : 0;

              return (
                <article key={tournament.id} className="tournament-card-v2" style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  boxShadow: "var(--shadow-soft)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}>
                  {/* Card Header Info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span className={`status-pill ${isPublished ? "status-pill-ready" : "status-pill-planned"}`}>
                          {formatLabel(tournament.status)}
                        </span>
                        <span className="status-pill status-pill-info" style={{ textTransform: "uppercase", fontSize: "10px", fontWeight: "700" }}>
                          {tournament.sport.name}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "20px", fontWeight: "800", margin: 0, color: "var(--foreground)" }}>{tournament.title}</h3>
                      <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>
                        {tournament.venue?.name ?? tournament.city.name} · {formatDateRange(tournament.startsAt, tournament.endsAt)}
                      </p>
                    </div>

                    {/* Stats Summary Bubble */}
                    {stats && (
                      <div style={{
                        background: "var(--background)",
                        border: "1px solid var(--line)",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        display: "flex",
                        gap: "16px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <span style={{ color: "var(--accent-dark)", fontWeight: "800", fontSize: "15px" }}>{stats.participantCount}</span>
                          <span style={{ color: "var(--muted)", fontSize: "10px", textTransform: "uppercase" }}>Players</span>
                        </div>
                        <div style={{ width: "1px", background: "var(--line)" }}></div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <span style={{ color: "var(--foreground)", fontWeight: "800", fontSize: "15px" }}>{completedCount} / {totalMatchesCount}</span>
                          <span style={{ color: "var(--muted)", fontSize: "10px", textTransform: "uppercase" }}>Scored</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Scoring Progress Bar */}
                  {stats && totalMatchesCount > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", color: "var(--muted)", textTransform: "uppercase" }}>
                        <span>Scoring Progress</span>
                        <span>{pct}% Done</span>
                      </div>
                      <div style={{ height: "6px", background: "var(--background)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(to right, #0d9488, #10b981)", borderRadius: "3px" }}></div>
                      </div>
                    </div>
                  )}

                  {/* Responsive Action Grid */}
                  <div style={{
                    borderTop: "1px solid var(--line)",
                    paddingTop: "16px",
                    marginTop: "4px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "8px"
                  }}>
                    <a className="secondary-action" href={organizerTournamentEditRoute(tournament.id)} style={{ textAlign: "center", padding: "8px", fontSize: "12px", fontWeight: "700" }}>Settings</a>
                    <a className="secondary-action" href={organizerTournamentRegistrationsRoute(tournament.id)} style={{ textAlign: "center", padding: "8px", fontSize: "12px", fontWeight: "700" }}>Registrations</a>
                    <a className="secondary-action" href={organizerTournamentPaymentsRoute(tournament.id)} style={{ textAlign: "center", padding: "8px", fontSize: "12px", fontWeight: "700" }}>Payments</a>
                    <a className="secondary-action" href={organizerTournamentFixturesRoute(tournament.id)} style={{ textAlign: "center", padding: "8px", fontSize: "12px", fontWeight: "700", border: "1px solid var(--accent)" }}>Fixtures & Scoring</a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
