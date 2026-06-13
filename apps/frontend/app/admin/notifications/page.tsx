import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminNotificationsPage() {
  return (
    <AdminShell title="Notifications" subtitle="Inspect outbox status and request audited retry or skip transitions.">
      <AdminCollectionView kind="notifications" />
    </AdminShell>
  );
}
