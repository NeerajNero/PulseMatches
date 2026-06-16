"use client";

import { FormEvent, useState } from "react";
import { formatAdminDate, formatAdminLabel } from "@/components/custom/admin/admin-format";
import { useAdminDashboard, useAdminReportSummary } from "@/hooks/use-admin";
import { ROUTES } from "@/utils/route";

// Operations SVGs
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

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

  // 1. Premium Skeleton Loader
  if (dashboard.isLoading) {
    return (
      <div className="dashboard-shell" style={{ paddingBottom: "40px" }}>
        <div className="skeleton-pulse" style={{ height: "36px", width: "280px", marginBottom: "24px" }}></div>
        
        {/* Metric Cards Skeletons */}
        <div className="dashboard-grid organizer-stat-grid admin-stat-grid" style={{ marginBottom: "40px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="feature-tile skeleton-pulse" style={{ height: "100px", border: "none" }}></div>
          ))}
        </div>

        {/* Panel Skeletons */}
        <div className="skeleton-pulse" style={{ height: "180px", borderRadius: "14px", marginBottom: "40px" }}></div>
        <div className="skeleton-pulse" style={{ height: "240px", borderRadius: "14px" }}></div>
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
        <h2>Unable to load admin dashboard</h2>
        <p>Check your system role permissions and ensure the server database is reachable.</p>
      </section>
    );
  }

  const {
    totalUsers,
    totalOrganizers,
    totalTournaments,
    publishedTournaments,
    totalRegistrations,
    pendingRegistrations,
    paidPayments,
    pendingPayments,
    failedPayments,
    refundCount,
    pendingNotifications,
    failedNotifications,
    recentReconciliationStatus,
    recentReconciliationProvider,
    recentReconciliationStartedAt
  } = dashboard.data;

  // Compute Operations Alerts & Warning statuses (Red/Yellow/Green)
  const notificationCritical = failedNotifications > 0;
  const paymentCritical = failedPayments > 0;
  const reconciliationOk = recentReconciliationStatus === "success" || recentReconciliationStatus === "completed";

  const cards = [
    { label: "Users", value: totalUsers, href: ROUTES.ADMIN_USERS },
    { label: "Organizers", value: totalOrganizers, href: ROUTES.ADMIN_ORGANIZERS },
    { label: "Tournaments", value: totalTournaments, href: ROUTES.ADMIN_TOURNAMENTS },
    { label: "Published", value: publishedTournaments, href: ROUTES.ADMIN_TOURNAMENTS },
    { label: "Registrations", value: totalRegistrations, href: ROUTES.ADMIN_REGISTRATIONS },
    { label: "Pending Regs", value: pendingRegistrations, href: ROUTES.ADMIN_REGISTRATIONS },
    { label: "Paid Payments", value: paidPayments, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Pending Payments", value: pendingPayments, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Failed Payments", value: failedPayments, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Refunds Issued", value: refundCount, href: ROUTES.ADMIN_PAYMENTS }
  ];

  return (
    <div className="dashboard-shell" style={{ paddingBottom: "40px" }}>
      {/* 2. Operations & Alert Warning Row (Red/Yellow/Green Indicators) */}
      <section style={{ marginBottom: "32px" }} aria-label="System Operations Alerts">
        <h2 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", fontWeight: "800", marginBottom: "12px" }}>
          System Health & Queue Status
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          
          {/* Notification Queue Alert */}
          <div style={{
            background: notificationCritical ? "rgba(239, 68, 68, 0.03)" : "rgba(22, 163, 74, 0.03)",
            border: "1.5px solid var(--line)",
            borderLeft: notificationCritical ? "4px solid #ef4444" : "4px solid #16a34a",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}>
            <div style={{
              background: notificationCritical ? "rgba(239, 68, 68, 0.1)" : "rgba(22, 163, 74, 0.1)",
              color: notificationCritical ? "#ef4444" : "#16a34a",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {notificationCritical ? <IconAlert /> : <IconCheck />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: "800", margin: 0, color: "var(--foreground)" }}>Notification Dispatcher</h3>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "2px 0 0 0" }}>
                {failedNotifications} failed · {pendingNotifications} pending in queue
              </p>
            </div>
            <a href={ROUTES.ADMIN_NOTIFICATIONS} className="secondary-action" style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "700" }}>
              Queue
            </a>
          </div>

          {/* Payment Status Alert */}
          <div style={{
            background: paymentCritical ? "rgba(239, 68, 68, 0.03)" : "rgba(22, 163, 74, 0.03)",
            border: "1.5px solid var(--line)",
            borderLeft: paymentCritical ? "4px solid #ef4444" : "4px solid #16a34a",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}>
            <div style={{
              background: paymentCritical ? "rgba(239, 68, 68, 0.1)" : "rgba(22, 163, 74, 0.1)",
              color: paymentCritical ? "#ef4444" : "#16a34a",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {paymentCritical ? <IconAlert /> : <IconCheck />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: "800", margin: 0, color: "var(--foreground)" }}>Payment Processing</h3>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "2px 0 0 0" }}>
                {failedPayments} warning records · {pendingPayments} checks pending
              </p>
            </div>
            <a href={ROUTES.ADMIN_PAYMENTS} className="secondary-action" style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "700" }}>
              Records
            </a>
          </div>

          {/* Reconciliation Status Alert */}
          <div style={{
            background: reconciliationOk ? "rgba(22, 163, 74, 0.03)" : "rgba(217, 119, 6, 0.03)",
            border: "1.5px solid var(--line)",
            borderLeft: reconciliationOk ? "4px solid #16a34a" : "4px solid #d97706",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}>
            <div style={{
              background: reconciliationOk ? "rgba(22, 163, 74, 0.1)" : "rgba(217, 119, 6, 0.1)",
              color: reconciliationOk ? "#16a34a" : "#d97706",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {reconciliationOk ? <IconCheck /> : <IconAlert />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "14px", fontWeight: "800", margin: 0, color: "var(--foreground)" }}>Reconciliation engine</h3>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: "2px 0 0 0" }}>
                Last status: {formatAdminLabel(recentReconciliationStatus)} ({recentReconciliationProvider})
              </p>
            </div>
            <a href={ROUTES.ADMIN_RECONCILIATION} className="secondary-action" style={{ fontSize: "11px", padding: "6px 12px", fontWeight: "700" }}>
              Engine
            </a>
          </div>

        </div>
      </section>

      {/* Core Platform Metrics Grid */}
      <section className="dashboard-grid organizer-stat-grid admin-stat-grid" style={{ marginBottom: "40px" }}>
        {cards.map((card) => (
          <a className="feature-tile admin-stat-card" href={card.href} key={card.label} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textDecoration: "none"
          }}>
            <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.05em", color: "var(--muted)", textTransform: "uppercase" }}>{card.label}</span>
            <h3 style={{ fontSize: "24px", fontWeight: "900", margin: "10px 0 0 0", color: "var(--foreground)" }}>{card.value}</h3>
          </a>
        ))}
      </section>

      {/* Operations Reconciliation Details */}
      <section className="organizer-panel" style={{ marginBottom: "40px" }}>
        <div className="section-heading organizer-section-heading">
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Operations status log</h2>
            <p>Read-only platform support. State modifications remain in the dedicated player or organizer workspaces.</p>
          </div>
        </div>
        <div className="organizer-table">
          <article className="organizer-table-row" style={{ padding: "20px" }}>
            <div>
              <span className={`status-pill ${reconciliationOk ? "status-pill-ready" : "status-pill-planned"}`} style={{ fontSize: "10px", fontWeight: "700" }}>
                {formatAdminLabel(recentReconciliationStatus)}
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "8px 0 4px 0" }}>
                Platform Reconciliation System
              </h3>
              <p style={{ fontSize: "13px" }}>
                Provider: <strong>{formatAdminLabel(recentReconciliationProvider)}</strong> · Started: {formatAdminDate(recentReconciliationStartedAt)}
              </p>
            </div>
            <div className="organizer-row-actions" style={{ display: "flex", gap: "8px" }}>
              <a className="secondary-action" href={ROUTES.ADMIN_RECONCILIATION}>Reconciliation history</a>
              <a className="secondary-action" href={ROUTES.ADMIN_AUDIT}>Security audit log</a>
            </div>
          </article>
        </div>
      </section>

      {/* Date Filtered Performance Reports */}
      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "800" }}>Platform Report Summary</h2>
            <p>Filtered performance aggregates for registrations, payments, notifications, and reconciliation.</p>
          </div>
        </div>
        
        <form className="filter-bar organizer-filter-bar admin-filter-bar" onSubmit={onReportFilter} style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          gap: "16px",
          alignItems: "flex-end"
        }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", fontWeight: "700" }}>
            <span>From Date</span>
            <input name="from" type="date" defaultValue={reportFilters.from} style={{
              background: "var(--background)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "8px 12px"
            }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", fontWeight: "700" }}>
            <span>To Date</span>
            <input name="to" type="date" defaultValue={reportFilters.to} style={{
              background: "var(--background)",
              border: "1px solid var(--line)",
              borderRadius: "8px",
              padding: "8px 12px"
            }} />
          </label>
          <button className="primary-action filter-action" type="submit" style={{ padding: "8px 20px", height: "38px" }}>
            Apply filters
          </button>
        </form>

        {report.isLoading ? <p className="skeleton-pulse" style={{ height: "60px", borderRadius: "10px" }}></p> : null}
        {report.isError ? <p style={{ color: "#ef4444", fontSize: "13px" }}>Unable to load platform report summary.</p> : null}
        
        {report.data ? (
          <section className="dashboard-grid organizer-stat-grid admin-stat-grid" aria-label="Platform report aggregates">
            <article className="feature-tile admin-stat-card" style={{ borderLeft: "4px solid #16a34a" }}>
              <span>Total volume paid</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800" }}>INR {report.data.totalPaidAmount}</h3>
            </article>
            <article className="feature-tile admin-stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
              <span>Total volume refunded</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800" }}>INR {report.data.totalRefundedAmount}</h3>
            </article>
            <article className="feature-tile admin-stat-card" style={{ borderLeft: "4px solid var(--accent)" }}>
              <span>Confirmed entries</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800" }}>{getCount(report.data.registrationsByStatus, "confirmed")}</h3>
            </article>
            <article className="feature-tile admin-stat-card" style={{ borderLeft: "4px solid #d97706" }}>
              <span>Failed notifications</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800" }}>{getCount(report.data.notificationsByStatus, "failed")}</h3>
            </article>
          </section>
        ) : null}
      </section>
    </div>
  );
}

function getCount(items: Array<{ key: string; count: number }>, key: string) {
  return items.find((item) => item.key === key)?.count ?? 0;
}
