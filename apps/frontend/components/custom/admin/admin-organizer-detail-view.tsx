"use client";

import { formatAdminDate, formatAdminLabel, getAdminStatusTone } from "@/components/custom/admin/admin-format";
import { useAdminOrganizerDetail, useRejectOrganizer, useResetOrganizerVerification, useVerifyOrganizer } from "@/hooks/use-admin";

export function AdminOrganizerDetailView({ organizerId }: Readonly<{ organizerId: string }>) {
  const organizer = useAdminOrganizerDetail(organizerId);
  const verifyOrganizer = useVerifyOrganizer();
  const rejectOrganizer = useRejectOrganizer();
  const resetOrganizer = useResetOrganizerVerification();
  const isBusy = verifyOrganizer.isPending || rejectOrganizer.isPending || resetOrganizer.isPending;
  const data = organizer.data;

  function onVerify() {
    if (!data || !window.confirm(`Verify ${data.organizationName}? Verified organizers can publish tournaments.`)) {
      return;
    }
    verifyOrganizer.mutate(data.id);
  }

  function onReject() {
    if (!data) {
      return;
    }
    const reason = window.prompt(`Reject verification for ${data.organizationName}? Add an optional audit reason.`);
    if (reason === null) {
      return;
    }
    rejectOrganizer.mutate({ organizerId: data.id, body: { reason } });
  }

  function onReset() {
    if (!data || !window.confirm(`Reset ${data.organizationName} to pending verification?`)) {
      return;
    }
    resetOrganizer.mutate(data.id);
  }

  if (organizer.isLoading) {
    return <p className="state-text compact-state">Loading organizer detail.</p>;
  }

  if (organizer.isError || !data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Unable to load organizer</h2>
        <p>Check the organizer id and your admin role.</p>
      </section>
    );
  }

  return (
    <section className="organizer-panel admin-panel">
      <div className="admin-detail-grid">
        <article className="admin-diagnostic-block">
          <span className={`status-pill ${getAdminStatusTone(data.verificationStatus)}`}>
            {formatAdminLabel(data.verificationStatus)}
          </span>
          <h2>{data.organizationName}</h2>
          <p>{data.user.displayName} · {data.user.email}</p>
          <p>Slug {data.slug} · Status {formatAdminLabel(data.status)}</p>
          <p>{data.tournamentCount} tournaments · Created {formatAdminDate(data.createdAt)}</p>
          <div className="organizer-row-actions admin-row-actions">
            {data.verificationStatus !== "verified" ? (
              <button className="primary-action" type="button" disabled={isBusy} onClick={onVerify}>Verify organizer</button>
            ) : null}
            {data.verificationStatus === "pending" ? (
              <button className="secondary-action" type="button" disabled={isBusy} onClick={onReject}>Reject verification</button>
            ) : null}
            {data.verificationStatus !== "pending" ? (
              <button className="secondary-action" type="button" disabled={isBusy} onClick={onReset}>Reset to pending</button>
            ) : null}
          </div>
        </article>

        <article className="admin-diagnostic-block">
          <h2>Recent tournaments</h2>
          {data.tournaments.length === 0 ? <p>No tournaments created yet.</p> : null}
          {data.tournaments.map((tournament) => (
            <div className="admin-diagnostic-row" key={tournament.id}>
              <div>
                <strong>{tournament.title}</strong>
                <p>{tournament.slug} · {formatAdminLabel(tournament.status)}</p>
              </div>
              <p>{tournament.registrationCount} registrations</p>
            </div>
          ))}
        </article>
      </div>

      <article className="admin-diagnostic-block">
        <h2>Verification audit</h2>
        {data.auditEvents.length === 0 ? <p>No verification audit events recorded yet.</p> : null}
        {data.auditEvents.map((event) => (
          <div className="admin-diagnostic-row" key={event.id}>
            <div>
              <strong>{event.action}</strong>
              <p>{event.actor ? `${event.actor.displayName} · ${event.actor.email}` : "System event"}</p>
              <p>{Object.entries(event.metadataSummary).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "No public metadata summary"}</p>
            </div>
            <p>{formatAdminDate(event.createdAt)}</p>
          </div>
        ))}
      </article>
    </section>
  );
}
