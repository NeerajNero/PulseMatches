import { AdminOperationsView } from "@/components/custom/admin/admin-operations-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminOperationsPage() {
  return (
    <AdminShell title="Operations" subtitle="Read-only health, readiness, and alert-ready status for platform operations.">
      <AdminOperationsView />
    </AdminShell>
  );
}
