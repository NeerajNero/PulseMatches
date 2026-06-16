"use client";

import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { PublicFixtureMatchDto, PublicFixtureSetDto, RegistrationDto } from "@matchflow/client-sdk";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apis/api";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyRegistrations } from "@/hooks/use-registrations";
import { DISCOVERY_QUERY_KEYS } from "@/utils/query-constants";
import { AccountNavigation } from "@/components/custom/account/account-navigation";
import { getRoleLandingRoute } from "@/utils/auth-redirect";
import { ROUTES, tournamentDetailRoute } from "@/utils/route";
import { formatDate, formatDateRange, formatDateTime, formatLabel } from "@/components/custom/tournaments/tournament-format";

const ACTIVE_REGISTRATION_STATUSES = new Set(["pending", "confirmed"]);
const PENDING_PAYMENT_STATUSES = new Set(["pending", "pending_offline", "requires_action", "processing", "created"]);

export function AccountDashboardView() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const roles = useMemo(() => currentUser.data?.roles ?? [], [currentUser.data?.roles]);
  const roleLanding = useMemo(() => getRoleLandingRoute(roles), [roles]);

  useEffect(() => {
    if (currentUser.isLoading) {
      return;
    }
    if (!currentUser.data) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (roleLanding !== ROUTES.ACCOUNT_DASHBOARD) {
      router.replace(roleLanding);
    }
  }, [currentUser.data, currentUser.isLoading, roleLanding, router]);

  const registrations = useMyRegistrations(Boolean(currentUser.data));
  const sortedRegistrations = useMemo(() => {
    return [...(registrations.data ?? [])].sort(
      (first, second) => new Date(first.tournament.startsAt).getTime() - new Date(second.tournament.startsAt).getTime()
    );
  }, [registrations.data]);

  const featuredRegistrations = useMemo(() => {
    return sortedRegistrations.filter((registration) => registration.status !== "cancelled").slice(0, 3);
  }, [sortedRegistrations]);

  const fixtureQueries = useQueries({
    queries: featuredRegistrations.map((registration) => ({
      queryKey: DISCOVERY_QUERY_KEYS.TOURNAMENT_FIXTURES(registration.tournament.slug),
      queryFn: async () => {
        const response = await apiClient.discovery.discoveryControllerFindTournamentFixtures({
          slugOrId: registration.tournament.slug
        });
        return response.data ?? [];
      },
      enabled: Boolean(registration.tournament.slug),
      retry: false
    }))
  });
  const shouldRedirect = Boolean(currentUser.data) && roleLanding !== ROUTES.ACCOUNT_DASHBOARD;

  // 1. Premium Loading Skeleton
  if (currentUser.isLoading || registrations.isLoading || (!currentUser.data && !currentUser.isError)) {
    return (
      <main className="dashboard-shell" style={{ paddingBottom: "40px" }}>
        <div className="skeleton-pulse" style={{ height: "48px", width: "100%", marginBottom: "32px", borderRadius: "8px" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
          <div className="skeleton-pulse" style={{ height: "38px", width: "320px" }}></div>
          <div className="skeleton-pulse" style={{ height: "38px", width: "240px" }}></div>
        </div>
        
        {/* Stat Grid Skeleton */}
        <div className="dashboard-grid organizer-stat-grid" style={{ marginBottom: "32px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="feature-tile skeleton-pulse" style={{ height: "100px", border: "none" }}></div>
          ))}
        </div>

        {/* Panel Skeleton */}
        <div className="skeleton-pulse" style={{ height: "220px", borderRadius: "14px" }}></div>
      </main>
    );
  }

  if (currentUser.isError || !currentUser.data) {
    return (
      <main className="dashboard-shell">
        <section className="premium-empty-state" style={{ marginTop: "40px" }}>
          <div className="empty-state-icon" style={{ color: "#ef4444" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1>Account unavailable</h1>
          <p>Sign in again to view your player dashboard.</p>
          <a className="primary-action" href={ROUTES.LOGIN} style={{ marginTop: "12px" }}>Log in</a>
        </section>
      </main>
    );
  }

  if (shouldRedirect) {
    return (
      <main className="dashboard-shell">
        <p className="state-text compact-state">Redirecting to your dashboard.</p>
      </main>
    );
  }

  const pendingRegistrations = sortedRegistrations.filter((r) => r.status === "pending");
  const approvedRegistrations = sortedRegistrations.filter((r) => r.status === "confirmed");
  const paidRegistrations = sortedRegistrations.filter((r) => r.paymentStatus === "paid");
  
  const paymentAttention = sortedRegistrations.filter((r) => 
    ["pending", "pending_offline", "requires_action", "failed"].includes(r.paymentStatus) &&
    r.status !== "cancelled"
  );

  const upcomingRegistrations = sortedRegistrations.filter((registration) => 
    new Date(registration.tournament.startsAt).getTime() >= Date.now() &&
    registration.status !== "cancelled"
  );
  
  const publishedFixtureSets = fixtureQueries.flatMap((query) => (query.data ?? []).filter((fixtureSet) => Boolean(fixtureSet.publishedAt)));
  const publishedMatchCount = publishedFixtureSets.reduce((total, fixtureSet) => total + fixtureSet.completedMatchCount, 0);

  return (
    <main className="dashboard-shell" style={{ paddingBottom: "40px" }}>
      <AccountNavigation />
      <section className="dashboard-header" style={{ marginBottom: "32px" }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--accent)" }}>Player Dashboard</span>
          <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "4px 0 8px 0", color: "var(--foreground)" }}>
            Welcome back, {currentUser.data.displayName}
          </h1>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Track your registrations, payments, and published fixtures from one place.
          </p>
        </div>
        <div className="organizer-header-actions" style={{ display: "flex", gap: "10px" }}>
          <a className="primary-action" href={ROUTES.TOURNAMENTS} style={{ fontSize: "14px", fontWeight: "700" }}>
            Browse Tournaments
          </a>
          <a className="secondary-action" href={ROUTES.ACCOUNT_REGISTRATIONS} style={{ fontSize: "14px", fontWeight: "700" }}>
            My Registrations
          </a>
        </div>
      </section>

      {/* Stats Summary Panel */}
      <section className="dashboard-grid organizer-stat-grid" style={{ marginBottom: "32px" }}>
        <article className="feature-tile" style={{ borderLeft: "4px solid var(--accent)" }}>
          <span>Total Entries</span>
          <h3 style={{ fontSize: "24px", fontWeight: "800" }}>{sortedRegistrations.length}</h3>
        </article>
        <article className="feature-tile" style={{ borderLeft: "4px solid #d97706" }}>
          <span>Pending</span>
          <h3 style={{ fontSize: "24px", fontWeight: "800" }}>{pendingRegistrations.length}</h3>
        </article>
        <article className="feature-tile" style={{ borderLeft: "4px solid #166534" }}>
          <span>Approved</span>
          <h3 style={{ fontSize: "24px", fontWeight: "800" }}>{approvedRegistrations.length}</h3>
        </article>
        <article className="feature-tile" style={{ borderLeft: "4px solid #1d4ed8" }}>
          <span>Paid</span>
          <h3 style={{ fontSize: "24px", fontWeight: "800" }}>{paidRegistrations.length}</h3>
        </article>
      </section>

      {/* Payment Attention Alerts Panel */}
      {paymentAttention.length > 0 && (
        <section className="organizer-panel" id="payments" style={{ borderLeft: "4px solid #b91c1c", marginBottom: "40px" }}>
          <div className="section-heading organizer-section-heading">
            <div>
              <h2 style={{ color: "#b91c1c", fontSize: "20px", fontWeight: "800" }}>Payment Action Required</h2>
              <p>You have {paymentAttention.length} registration{paymentAttention.length === 1 ? '' : 's'} awaiting payment or verification.</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {paymentAttention.map((registration) => (
              <article key={registration.id} className="registration-list-item" style={{
                background: "rgba(185, 28, 28, 0.02)",
                border: "1px solid var(--line)",
                borderLeft: "4px solid #b91c1c",
                borderRadius: "14px",
                padding: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div>
                  <span className="status-pill status-pill-info" style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px", display: "inline-block" }}>
                    {registration.tournament.sport.name}
                  </span>
                  <h3 style={{ fontSize: "18px", fontWeight: "800", margin: 0 }}>{registration.tournament.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "2px" }}>
                    {registration.category?.name ?? "Tournament registration"}
                  </p>
                </div>
                <dl style={{ display: "flex", gap: "24px", fontSize: "13px", margin: 0 }}>
                  <div>
                    <dt style={{ color: "var(--muted)", fontSize: "10px", textTransform: "uppercase", fontWeight: "700", marginBottom: "2px" }}>Status</dt>
                    <dd style={{ color: "#b91c1c", fontWeight: "700" }}>{formatLabel(registration.paymentStatus)}</dd>
                  </div>
                  <div>
                    <dt style={{ color: "var(--muted)", fontSize: "10px", textTransform: "uppercase", fontWeight: "700", marginBottom: "2px" }}>Amount</dt>
                    <dd style={{ fontWeight: "700" }}>{formatPaymentSummary(registration)}</dd>
                  </div>
                </dl>
                <div>
                  {registration.payment?.checkoutUrl ? (
                    <a className="primary-action" href={registration.payment.checkoutUrl} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "700", background: "#b91c1c" }}>
                      Complete Payment
                    </a>
                  ) : (
                    <a className="primary-action" href={ROUTES.ACCOUNT_REGISTRATIONS} style={{ padding: "10px 20px", fontSize: "13px", fontWeight: "700" }}>
                      Manage Payment
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. Visual "My Registrations" Cards (Upcoming Tournaments) */}
      <section className="organizer-panel" style={{ marginBottom: "40px" }}>
        <div className="section-heading organizer-section-heading">
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Upcoming Tournaments</h2>
            <p>Your confirmed and pending entries for upcoming events.</p>
          </div>
        </div>

        {upcomingRegistrations.length === 0 ? (
          /* Branded Empty State */
          <section className="premium-empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <h2>You haven&apos;t registered for any tournaments yet</h2>
            <p>Browse active tournaments around your area to reserve your spot in a bracket.</p>
            <a className="primary-action" href={ROUTES.TOURNAMENTS} style={{ marginTop: "12px" }}>
              Browse Tournaments
            </a>
          </section>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {upcomingRegistrations.slice(0, 3).map((registration) => {
              const nowTime = new Date().getTime();
              const startTime = new Date(registration.tournament.startsAt).getTime();
              const endTime = new Date(registration.tournament.endsAt).getTime();
              
              let badgeText = "UPCOMING";
              let badgeClass = "status-pill-planned";
              
              if (nowTime > endTime) {
                badgeText = "COMPLETED";
                badgeClass = "status-pill-neutral";
              } else if (nowTime >= startTime && nowTime <= endTime) {
                badgeText = "LIVE";
                badgeClass = "status-live"; // Animated red flashing badge
              }

              return (
                <article key={registration.id} className="tournament-card-v2" style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-soft)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}>
                  {/* High Visibility Header Banner */}
                  <div style={{
                    background: "linear-gradient(135deg, #0c1e19 0%, #10231d 100%)",
                    padding: "16px 20px",
                    color: "#ffffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span className="status-pill status-pill-info" style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>
                      {registration.tournament.sport.name}
                    </span>
                    <span className={`status-pill ${badgeClass}`} style={{ fontSize: "10px", fontWeight: "800" }}>
                      {badgeText}
                    </span>
                  </div>

                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 6px 0", color: "var(--foreground)" }}>
                        {registration.tournament.title}
                      </h3>
                      <p style={{ color: "var(--muted)", fontSize: "13px", margin: "0 0 16px 0" }}>
                        {registration.tournament.city.name} · {formatDateRange(registration.tournament.startsAt, registration.tournament.endsAt)}
                      </p>

                      <div style={{
                        background: "var(--background)",
                        borderRadius: "12px",
                        padding: "12px",
                        fontSize: "12px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                        marginBottom: "16px"
                      }}>
                        <div>
                          <span style={{ color: "var(--muted)", fontSize: "9px", textTransform: "uppercase", fontWeight: "700", display: "block" }}>Category</span>
                          <span style={{ fontWeight: "700", color: "var(--foreground)" }}>{registration.category?.name ?? "Roster Entry"}</span>
                        </div>
                        <div>
                          <span style={{ color: "var(--muted)", fontSize: "9px", textTransform: "uppercase", fontWeight: "700", display: "block" }}>Payment</span>
                          <span style={{ fontWeight: "700", color: "var(--foreground)" }}>{formatPaymentSummary(registration)}</span>
                        </div>
                      </div>
                    </div>

                    <a className="secondary-action" href={tournamentDetailRoute(registration.tournament.slug)} style={{
                      textAlign: "center",
                      display: "block",
                      width: "100%",
                      fontWeight: "700",
                      fontSize: "13px",
                      padding: "10px"
                    }}>
                      View Tournament Details
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Results & Fixtures Section */}
      <section className="organizer-panel" id="results">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Recent Fixtures & Results</h2>
            <p>Published fixtures and completed results for your registered tournaments.</p>
          </div>
        </div>

        {featuredRegistrations.length === 0 ? (
          <section className="premium-empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2>No results available yet</h2>
            <p>Once your registered tournaments publish fixtures or score matches, reports will appear here.</p>
          </section>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {featuredRegistrations.map((registration, index) => {
              const query = fixtureQueries[index];
              const fixtureSets = (query?.data ?? []) as PublicFixtureSetDto[];
              const preview = getFixturePreview(fixtureSets);

              return (
                <article key={registration.id} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "var(--shadow-soft)",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "20px",
                  alignItems: "center"
                }}>
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                      <span className={`status-pill ${registration.status === "confirmed" ? "status-pill-ready" : "status-pill-planned"}`}>
                        {formatLabel(registration.status)}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>
                        {registration.tournament.sport.name} · {registration.tournament.city.name}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "4px 0" }}>{registration.tournament.title}</h3>
                    
                    {query?.isLoading ? <p className="skeleton-pulse" style={{ height: "20px", width: "150px", marginTop: "8px" }}></p> : null}
                    {query?.isError ? <p style={{ color: "#b91c1c", fontSize: "13px", margin: "6px 0 0" }}>Unable to load fixtures.</p> : null}
                    
                    {!query?.isLoading && !query?.isError && !preview ? (
                      <p style={{ color: "var(--muted)", fontSize: "13px", margin: "6px 0 0" }}>No published fixtures or results yet.</p>
                    ) : null}

                    {preview ? (
                      <div style={{
                        marginTop: "12px",
                        padding: "10px 14px",
                        background: "var(--background)",
                        borderRadius: "10px",
                        fontSize: "13px",
                        borderLeft: "3px solid var(--accent-dark)"
                      }}>
                        <p style={{ fontWeight: "700", margin: 0 }}>
                          {preview.fixtureSet.name ?? `${formatLabel(preview.fixtureSet.format)} Bracket`}
                        </p>
                        <p style={{ color: "var(--muted)", fontSize: "12px", margin: "2px 0 6px 0" }}>
                          {preview.fixtureSet.completedMatchCount} of {preview.fixtureSet.matchCount} matches completed
                        </p>
                        {preview.nextMatch ? (
                          <div style={{ borderTop: "1px solid var(--line)", paddingTop: "6px", fontSize: "12px" }}>
                            <strong>{formatNextMatchLabel(preview.nextMatch)}:</strong> {formatNextMatchSummary(preview.nextMatch)}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a className="secondary-action" href={tournamentDetailRoute(registration.tournament.slug)} style={{ fontSize: "13px" }}>
                      Open Tournament
                    </a>
                    <a className="secondary-action" href={`${tournamentDetailRoute(registration.tournament.slug)}#fixtures-results`} style={{ fontSize: "13px", border: "1px solid var(--accent)" }}>
                      View Bracket
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {publishedFixtureSets.length > 0 ? (
          <p className="state-text compact-state" style={{ marginTop: "16px", fontSize: "12px", color: "var(--muted)" }}>
            Published match results available across {publishedFixtureSets.length} fixture set
            {publishedFixtureSets.length === 1 ? "" : "s"} and {publishedMatchCount} completed match{publishedMatchCount === 1 ? "" : "es"}.
          </p>
        ) : null}
      </section>
    </main>
  );
}

function getFixturePreview(fixtureSets: PublicFixtureSetDto[]) {
  const orderedSets = [...fixtureSets].sort((first, second) => {
    const firstPriority = first.completedMatchCount > 0 ? 0 : 1;
    const secondPriority = second.completedMatchCount > 0 ? 0 : 1;
    if (firstPriority !== secondPriority) {
      return firstPriority - secondPriority;
    }
    return second.completedMatchCount - first.completedMatchCount;
  });
  const fixtureSet = orderedSets[0];
  if (!fixtureSet) {
    return null;
  }

  const matches = fixtureSet.rounds.flatMap((round) => round.matches);
  const nextMatch = matches.find((match) => match.status !== "completed") ?? matches[0] ?? null;

  return {
    fixtureSet,
    nextMatch
  };
}

function formatNextMatchLabel(match: PublicFixtureMatchDto) {
  return match.status === "completed" ? "Latest result" : "Next match";
}

function formatNextMatchSummary(match: PublicFixtureMatchDto) {
  if (match.status === "completed") {
    return `Completed ${match.completedAt ? formatDateTime(match.completedAt) : "recently"}`;
  }
  if (match.scheduledAt) {
    return formatDateTime(match.scheduledAt);
  }
  return `Match ${match.matchNumber}`;
}

function formatPaymentSummary(registration: RegistrationDto) {
  const payment = registration.payment;
  const amount = payment?.amount ?? registration.feeAmount;
  const status = payment?.status ?? registration.paymentStatus;
  if (amount <= 0 || status === "not_required") {
    return "Not required";
  }
  return `${payment?.currency ?? registration.feeCurrency} ${amount} · ${formatLabel(status)}`;
}

function isPendingPayment(registration: RegistrationDto) {
  const status = registration.payment?.status ?? registration.paymentStatus;
  return PENDING_PAYMENT_STATUSES.has(status);
}
