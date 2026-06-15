"use client";

import { FormEvent, useState } from "react";
import { formatAdminDate, formatAdminLabel } from "@/components/custom/admin/admin-format";
import { useAdminDashboard, useAdminReportSummary } from "@/hooks/use-admin";
import { ROUTES } from "@/utils/route";

export function AdminDashboardView() {
  const [reportFilters, setReportFilters] = useState({ from: "", to: "" });
  const dashboard = useAdminDashboard();
  const report = useAdminReportSummary(reportFilters);

  function onReportFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setReportFilters({
      from: String(form.get("from") ?? ""),
      to: String(form.get("to") ?? "")
    });
  }

  if (dashboard.isLoading) {
    return <p className="state-text compact-state">Loading support dashboard.</p>;
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Unable to load admin dashboard</h2>
        <p>Check your admin role and backend connection.</p>
      </section>
    );
  }

  const cards = [
    { label: "Users", value: dashboard.data.totalUsers, href: ROUTES.ADMIN_USERS },
    { label: "Organizers", value: dashboard.data.totalOrganizers, href: ROUTES.ADMIN_ORGANIZERS },
    { label: "Tournaments", value: dashboard.data.totalTournaments, href: ROUTES.ADMIN_TOURNAMENTS },
    { label: "Published", value: dashboard.data.publishedTournaments, href: ROUTES.ADMIN_TOURNAMENTS },
    { label: "Registrations", value: dashboard.data.totalRegistrations, href: ROUTES.ADMIN_REGISTRATIONS },
    { label: "Pending registrations", value: dashboard.data.pendingRegistrations, href: ROUTES.ADMIN_REGISTRATIONS },
    { label: "Paid payments", value: dashboard.data.paidPayments, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Pending payments", value: dashboard.data.pendingPayments, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Failed payments", value: dashboard.data.failedPayments, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Refunds", value: dashboard.data.refundCount, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Pending notifications", value: dashboard.data.pendingNotifications, href: ROUTES.ADMIN_NOTIFICATIONS },
    { label: "Failed notifications", value: dashboard.data.failedNotifications, href: ROUTES.ADMIN_NOTIFICATIONS }
  ];

  return (
    <>
      <section className="dashboard-grid organizer-stat-grid admin-stat-grid">
        {cards.map((card) => (
          <a className="feature-tile admin-stat-card" href={card.href} key={card.label}>
            <span>{card.label}</span>
            <h3>{card.value}</h3>
          </a>
        ))}
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Operational status</h2>
          <p>Read-only rollups for platform support. Mutations remain in the existing player and organizer workflows.</p>
        </div>
        <div className="organizer-table">
          <article className="organizer-table-row">
            <div>
              <span className="status-pill status-pill-planned">Reconciliation</span>
              <h3>{formatAdminLabel(dashboard.data.recentReconciliationStatus)}</h3>
              <p>
                Provider {formatAdminLabel(dashboard.data.recentReconciliationProvider)}
                {" · "}
                Started {formatAdminDate(dashboard.data.recentReconciliationStartedAt)}
              </p>
            </div>
            <div className="organizer-row-actions">
              <a className="secondary-action" href={ROUTES.ADMIN_RECONCILIATION}>View runs</a>
              <a className="secondary-action" href={ROUTES.ADMIN_AUDIT}>View audit</a>
            </div>
          </article>
        </div>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2>Platform report summary</h2>
            <p>Date-filtered read-only aggregates for registrations, payments, notifications, and reconciliation.</p>
          </div>
        </div>
        <form className="filter-bar organizer-filter-bar admin-filter-bar" onSubmit={onReportFilter}>
          <label>
            <span>From</span>
            <input name="from" type="date" defaultValue={reportFilters.from} />
          </label>
          <label>
            <span>To</span>
            <input name="to" type="date" defaultValue={reportFilters.to} />
          </label>
          <button className="primary-action filter-action" type="submit">Apply range</button>
        </form>
        {report.isLoading ? <p className="state-text compact-state">Loading report summary.</p> : null}
        {report.isError ? <p className="form-error">Unable to load platform report summary.</p> : null}
        {report.data ? (
          <section className="dashboard-grid organizer-stat-grid admin-stat-grid" aria-label="Platform report aggregates">
            <article className="feature-tile admin-stat-card">
              <span>Paid amount</span>
              <h3>INR {report.data.totalPaidAmount}</h3>
            </article>
            <article className="feature-tile admin-stat-card">
              <span>Refunded amount</span>
              <h3>INR {report.data.totalRefundedAmount}</h3>
            </article>
            <article className="feature-tile admin-stat-card">
              <span>Confirmed registrations</span>
              <h3>{getCount(report.data.registrationsByStatus, "confirmed")}</h3>
            </article>
            <article className="feature-tile admin-stat-card">
              <span>Failed notifications</span>
              <h3>{getCount(report.data.notificationsByStatus, "failed")}</h3>
            </article>
          </section>
        ) : null}
      </section>
    </>
  );
}

function getCount(items: Array<{ key: string; count: number }>, key: string) {
  return items.find((item) => item.key === key)?.count ?? 0;
}
