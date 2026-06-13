"use client";

import { formatAdminDate, formatAdminLabel } from "@/components/custom/admin/admin-format";
import { useAdminDashboard } from "@/hooks/use-admin";
import { ROUTES } from "@/utils/route";

export function AdminDashboardView() {
  const dashboard = useAdminDashboard();

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
    </>
  );
}
