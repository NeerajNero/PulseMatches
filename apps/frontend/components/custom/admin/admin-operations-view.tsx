"use client";

import { formatAdminDate, formatAdminLabel, getAdminStatusTone } from "@/components/custom/admin/admin-format";
import { useAdminOperationsStatus } from "@/hooks/use-admin";
import { ROUTES } from "@/utils/route";

export function AdminOperationsView() {
  const operations = useAdminOperationsStatus();

  if (operations.isLoading) {
    return <p className="state-text compact-state">Loading operations status.</p>;
  }

  if (operations.isError || !operations.data) {
    return (
      <section className="empty-state account-empty-state">
        <h2>Unable to load operations status</h2>
        <p>Check backend availability and your admin role.</p>
      </section>
    );
  }

  const status = operations.data;
  const cards = [
    { label: "Pending notifications", value: status.pendingNotifications, href: ROUTES.ADMIN_NOTIFICATIONS },
    { label: "Failed notifications", value: status.failedNotifications, href: ROUTES.ADMIN_NOTIFICATIONS },
    { label: "Stale processing", value: status.staleProcessingNotifications, href: ROUTES.ADMIN_NOTIFICATIONS },
    { label: "Stale payment intents", value: status.stalePaymentIntents, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Failed payment intents", value: status.failedPaymentIntents, href: ROUTES.ADMIN_PAYMENTS },
    { label: "Failed payment events", value: status.failedPaymentEvents, href: ROUTES.ADMIN_PAYMENTS }
  ];

  return (
    <>
      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <div>
            <h2>Service status</h2>
            <p>Alert-ready checks for dependencies, payment state, notifications, and reconciliation.</p>
          </div>
          <span className={`status-pill ${getAdminStatusTone(status.status)}`}>{formatAdminLabel(status.status)}</span>
        </div>
        <div className="dashboard-grid organizer-stat-grid admin-stat-grid">
          <article className="feature-tile admin-stat-card">
            <span>Service</span>
            <h3>{status.serviceName}</h3>
            <p>Version {status.appVersion}</p>
          </article>
          <article className="feature-tile admin-stat-card">
            <span>Payment provider</span>
            <h3>{formatAdminLabel(status.paymentProvider)}</h3>
            <p>No secrets are exposed.</p>
          </article>
          <article className="feature-tile admin-stat-card">
            <span>Notification provider</span>
            <h3>{formatAdminLabel(status.notificationProvider)}</h3>
            <p>No SMTP credentials are exposed.</p>
          </article>
          <article className="feature-tile admin-stat-card">
            <span>Checked</span>
            <h3>{formatAdminDate(status.checkedAt)}</h3>
            <p>Export cap {status.exportMaxRows} rows</p>
          </article>
        </div>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Dependencies</h2>
        </div>
        <div className="organizer-table">
          {status.dependencies.map((dependency) => (
            <article className="organizer-table-row" key={dependency.name}>
              <div>
                <span className={`status-pill ${getAdminStatusTone(dependency.status)}`}>
                  {formatAdminLabel(dependency.status)}
                </span>
                <h3>{formatAdminLabel(dependency.name)}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

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
          <h2>Reconciliation</h2>
        </div>
        <article className="organizer-table-row">
          <div>
            <span className={`status-pill ${getAdminStatusTone(status.latestReconciliationRun.status)}`}>
              {formatAdminLabel(status.latestReconciliationRun.status)}
            </span>
            <h3>{formatAdminLabel(status.latestReconciliationRun.provider)}</h3>
            <p>
              Started {formatAdminDate(status.latestReconciliationRun.startedAt)}
              {" · "}
              Completed {formatAdminDate(status.latestReconciliationRun.completedAt)}
            </p>
          </div>
          <div className="organizer-row-actions">
            <a className="secondary-action" href={ROUTES.ADMIN_RECONCILIATION}>View runs</a>
          </div>
        </article>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Alert thresholds</h2>
          <p>These values are configured through environment variables and are used for status classification.</p>
        </div>
        <div className="dashboard-grid organizer-stat-grid admin-stat-grid">
          <article className="feature-tile admin-stat-card">
            <span>Stale notification</span>
            <h3>{status.thresholds.staleNotificationMinutes}m</h3>
          </article>
          <article className="feature-tile admin-stat-card">
            <span>Stale payment intent</span>
            <h3>{status.thresholds.stalePaymentIntentMinutes}m</h3>
          </article>
          <article className="feature-tile admin-stat-card">
            <span>Failed notifications</span>
            <h3>{status.thresholds.failedNotificationAlertThreshold}</h3>
          </article>
          <article className="feature-tile admin-stat-card">
            <span>Failed payments</span>
            <h3>{status.thresholds.failedPaymentAlertThreshold}</h3>
          </article>
        </div>
      </section>

      <section className="organizer-panel">
        <div className="section-heading organizer-section-heading">
          <h2>Troubleshooting hints</h2>
        </div>
        <ul className="admin-detail-list">
          <li>Database or Redis critical: inspect backend logs and Docker health before running smoke again.</li>
          <li>Notification backlog: review failed rows, then use the existing retry or skip controls where appropriate.</li>
          <li>Stale payment intents: check payment diagnostics before running provider reconciliation.</li>
          <li>Reconciliation failure: inspect the latest reconciliation run and provider mode before retrying the CLI command.</li>
        </ul>
      </section>
    </>
  );
}
