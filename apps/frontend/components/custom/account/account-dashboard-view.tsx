"use client";

import { useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import type { PublicFixtureMatchDto, PublicFixtureSetDto, RegistrationDto } from "@matchflow/client-sdk";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apis/api";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyRegistrations } from "@/hooks/use-registrations";
import { DISCOVERY_QUERY_KEYS } from "@/utils/query-constants";
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

  if (currentUser.isLoading || (!currentUser.data && !currentUser.isError)) {
    return <main className="dashboard-shell"><p className="state-text compact-state">Loading account dashboard.</p></main>;
  }

  if (currentUser.isError || !currentUser.data) {
    return (
      <main className="dashboard-shell">
        <section className="empty-state account-empty-state">
          <h1>Account unavailable</h1>
          <p>Sign in again to view your player dashboard.</p>
          <a className="primary-action" href={ROUTES.LOGIN}>Log in</a>
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

  const activeRegistrations = sortedRegistrations.filter((registration) => ACTIVE_REGISTRATION_STATUSES.has(registration.status));
  const pendingPayments = sortedRegistrations.filter((registration) => isPendingPayment(registration));
  const upcomingRegistrations = sortedRegistrations.filter((registration) => new Date(registration.tournament.startsAt).getTime() >= Date.now());
  const publishedFixtureSets = fixtureQueries.flatMap((query) => (query.data ?? []).filter((fixtureSet) => Boolean(fixtureSet.publishedAt)));
  const publishedMatchCount = publishedFixtureSets.reduce((total, fixtureSet) => total + fixtureSet.completedMatchCount, 0);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <span className="eyebrow">Player dashboard</span>
          <h1>Welcome back, {currentUser.data.displayName}</h1>
          <p>Track your registrations, payments, and published fixtures from one place.</p>
        </div>
        <div className="organizer-header-actions">
          <a className="primary-action" href={ROUTES.TOURNAMENTS}>Browse tournaments</a>
          <a className="secondary-action" href={ROUTES.ACCOUNT_REGISTRATIONS}>View registrations</a>
        </div>
      </section>

      <section className="dashboard-grid organizer-stat-grid">
        <article className="feature-tile">
          <span>Registered</span>
          <h3>{sortedRegistrations.length}</h3>
        </article>
        <article className="feature-tile">
          <span>Active</span>
          <h3>{activeRegistrations.length}</h3>
        </article>
        <article className="feature-tile">
          <span>Pending payments</span>
          <h3>{pendingPayments.length}</h3>
        </article>
        <article className="feature-tile">
          <span>Upcoming</span>
          <h3>{upcomingRegistrations.length}</h3>
        </article>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2>My registrations</h2>
            <p>Keep an eye on tournament status, payment status, and next steps.</p>
          </div>
        </div>

        {registrations.isLoading ? <p className="state-text compact-state">Loading registrations.</p> : null}
        {registrations.isError ? (
          <section className="empty-state account-empty-state">
            <h2>Unable to load registrations</h2>
            <p>Check that your account is signed in and the backend is reachable.</p>
          </section>
        ) : null}
        {!registrations.isLoading && sortedRegistrations.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No registrations yet</h2>
            <p>Browse tournaments and register for a match day when entries are open.</p>
            <div className="registration-actions">
              <a className="primary-action" href={ROUTES.TOURNAMENTS}>Browse tournaments</a>
              <a className="secondary-action" href={ROUTES.ACCOUNT_REGISTRATIONS}>Registration history</a>
            </div>
          </section>
        ) : null}

        <div className="registration-list">
          {sortedRegistrations.slice(0, 4).map((registration) => (
            <article className="registration-list-item" key={registration.id}>
              <div>
                <span className="eyebrow">{registration.tournament.sport.name}</span>
                <h2>{registration.tournament.title}</h2>
                <p>
                  {registration.category?.name ?? "Tournament registration"} · {registration.tournament.city.name} ·{" "}
                  {formatDateRange(registration.tournament.startsAt, registration.tournament.endsAt)}
                </p>
              </div>
              <dl className="registration-status-grid">
                <div><dt>Status</dt><dd>{formatLabel(registration.status)}</dd></div>
                <div><dt>Payment</dt><dd>{formatPaymentSummary(registration)}</dd></div>
                <div><dt>Registered</dt><dd>{formatDate(registration.createdAt)}</dd></div>
              </dl>
              <div>
                {registration.payment?.offlineInstructions ? (
                  <p className="state-text compact-state">
                    {registration.payment.offlineInstructions}
                  </p>
                ) : null}
                <div className="registration-actions">
                  <a className="secondary-action" href={tournamentDetailRoute(registration.tournament.slug)}>
                    View tournament
                  </a>
                  <a className="secondary-action" href={`${tournamentDetailRoute(registration.tournament.slug)}#fixtures-results`}>
                    Fixtures and results
                  </a>
                  {registration.payment?.checkoutUrl ? (
                    <a className="primary-action" href={registration.payment.checkoutUrl}>
                      Continue payment
                    </a>
                  ) : null}
                  {!registration.payment?.checkoutUrl && registration.payment?.onlinePaymentAvailable ? (
                    <a className="secondary-action" href={ROUTES.ACCOUNT_REGISTRATIONS}>
                      Continue payment
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2>Upcoming fixtures and results</h2>
            <p>Published fixture sets and completed results for your registered tournaments.</p>
          </div>
        </div>

        {featuredRegistrations.length === 0 ? (
          <section className="empty-state account-empty-state">
            <h2>No upcoming tournaments yet</h2>
            <p>Once you register, published fixtures and results will appear here.</p>
          </section>
        ) : null}

        <div className="organizer-table">
          {featuredRegistrations.map((registration, index) => {
            const query = fixtureQueries[index];
            const fixtureSets = (query?.data ?? []) as PublicFixtureSetDto[];
            const preview = getFixturePreview(fixtureSets);

            return (
              <article className="organizer-table-row" key={registration.id}>
                <div>
                  <span className={`status-pill ${registration.status === "confirmed" ? "status-pill-ready" : "status-pill-planned"}`}>
                    {formatLabel(registration.status)}
                  </span>
                  <h3>{registration.tournament.title}</h3>
                  <p>
                    {registration.tournament.sport.name} · {registration.tournament.city.name} ·{" "}
                    {formatDateRange(registration.tournament.startsAt, registration.tournament.endsAt)}
                  </p>
                  {query?.isLoading ? <p className="state-text compact-state">Loading public fixtures.</p> : null}
                  {query?.isError ? <p className="state-text compact-state">Unable to load fixtures for this tournament.</p> : null}
                  {!query?.isLoading && !query?.isError && !preview ? (
                    <p className="state-text compact-state">No published fixtures or results yet.</p>
                  ) : null}
                  {preview ? (
                    <>
                      <p>
                        {preview.fixtureSet.name ?? `${formatLabel(preview.fixtureSet.format)} fixtures`} ·{" "}
                        {preview.fixtureSet.completedMatchCount} of {preview.fixtureSet.matchCount} completed
                      </p>
                      {preview.nextMatch ? (
                        <p>
                          {formatNextMatchLabel(preview.nextMatch)} · {formatNextMatchSummary(preview.nextMatch)}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </div>
                <div className="organizer-row-actions">
                  <a className="secondary-action" href={tournamentDetailRoute(registration.tournament.slug)}>
                    Open tournament
                  </a>
                  <a className="secondary-action" href={`${tournamentDetailRoute(registration.tournament.slug)}#fixtures-results`}>
                    View results
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {publishedFixtureSets.length > 0 ? (
          <p className="state-text compact-state">
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
