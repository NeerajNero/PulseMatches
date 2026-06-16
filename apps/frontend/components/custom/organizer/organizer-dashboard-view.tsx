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

  if (dashboard.isLoading) {
    return <p className="state-text compact-state">Loading organizer dashboard...</p>;
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Unable to load dashboard</h2>
        <p>Check that the backend is running and your organizer profile exists.</p>
      </section>
    );
  }

  const attentionItems = [];
  if (dashboard.data.pendingRegistrations > 0) {
    attentionItems.push({
      label: "Pending registrations",
      count: dashboard.data.pendingRegistrations,
      action: "Review entries",
      href: ROUTES.ORGANIZER_TOURNAMENTS // General link as we don't know which one
    });
  }

  // Aggregate from report queries
  let unscoredMatches = 0;
  let pendingPayments = 0;
  
  reportQueries.forEach(query => {
    if (query.data) {
      unscoredMatches += (query.data.fixtureCount * 2) - query.data.completedMatchCount; // Simplified heuristic
      const pendingPay = query.data.paymentsByStatus.find(p => p.status === 'pending' || p.status === 'pending_offline');
      if (pendingPay) pendingPayments += pendingPay.count;
    }
  });

  if (pendingPayments > 0) {
    attentionItems.push({
      label: "Payments to verify",
      count: pendingPayments,
      action: "View payments",
      href: ROUTES.ORGANIZER_TOURNAMENTS
    });
  }

  return (
    <>
      <section className="registration-actions" style={{ marginBottom: '32px', gap: '12px' }}>
        <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create Tournament</a>
        <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Manage Tournaments</a>
        <a className="primary-action" href={ROUTES.SCORING} style={{ background: 'var(--gold)', color: 'black' }}>Scoring App</a>
      </section>

      <section className="dashboard-grid organizer-stat-grid" style={{ marginBottom: '40px' }}>
        <article className="feature-tile">
          <span>Tournaments</span>
          <h3>{dashboard.data.totalTournaments}</h3>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>{dashboard.data.publishedTournaments} Published · {dashboard.data.draftTournaments} Drafts</p>
        </article>
        <article className="feature-tile">
          <span>Total entries</span>
          <h3>{dashboard.data.totalRegistrations}</h3>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>{dashboard.data.pendingRegistrations} Pending review</p>
        </article>
        <article className="feature-tile">
          <span>Upcoming</span>
          <h3>{dashboard.data.upcomingTournaments}</h3>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>Starting soon</p>
        </article>
        <article className="feature-tile">
          <span>Action items</span>
          <h3>{attentionItems.length}</h3>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>Need your attention</p>
        </article>
      </section>

      {attentionItems.length > 0 && (
        <section className="organizer-panel" style={{ borderLeft: '4px solid var(--gold)', marginBottom: '40px' }}>
          <div className="section-heading organizer-section-heading">
            <div>
              <h2 style={{ color: 'var(--gold)' }}>Attention required</h2>
              <p>Items across your tournaments that need immediate action.</p>
            </div>
          </div>
          <div className="organizer-table">
            {attentionItems.map((item, idx) => (
              <article className="organizer-table-row" key={idx}>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.count} items awaiting your review.</p>
                </div>
                <div className="organizer-row-actions">
                  <a className="primary-action" href={item.href}>{item.action}</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2>Recent tournaments</h2>
            <p>Direct access to manage categories, registrations, payments, and fixtures.</p>
          </div>
          <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>View all</a>
        </div>
        
        {dashboard.data.recentTournaments.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No tournaments yet</h2>
            <p>Create your first tournament to start managing entries and fixtures.</p>
            <a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>
          </section>
        ) : (
          <div className="organizer-table">
            {dashboard.data.recentTournaments.map((tournament, idx) => {
              const stats = reportQueries[idx]?.data;
              return (
                <article className="organizer-table-row" key={tournament.id} style={{ padding: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span className={`status-pill ${tournament.status === "published" ? "status-pill-ready" : "status-pill-planned"}`}>
                        {formatLabel(tournament.status)}
                      </span>
                      <span className="status-pill status-pill-info">{tournament.sport.name}</span>
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{tournament.title}</h3>
                    <p style={{ marginBottom: '12px' }}>{tournament.venue?.name ?? tournament.city.name} · {formatDateRange(tournament.startsAt, tournament.endsAt)}</p>
                    
                    {stats && (
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--muted)' }}>
                        <span><strong>{stats.participantCount}</strong> participants</span>
                        <span><strong>{stats.completedMatchCount}/{stats.fixtureCount * 2}</strong> matches scored</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="organizer-row-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <a className="secondary-action" href={organizerTournamentEditRoute(tournament.id)}>Settings</a>
                    <a className="secondary-action" href={organizerTournamentRegistrationsRoute(tournament.id)}>Registrations</a>
                    <a className="secondary-action" href={organizerTournamentPaymentsRoute(tournament.id)}>Payments</a>
                    <a className="secondary-action" href={organizerTournamentFixturesRoute(tournament.id)}>Fixtures & Scoring</a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
