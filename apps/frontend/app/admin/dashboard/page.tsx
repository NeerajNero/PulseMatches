import { AdminDashboardView } from "@/components/custom/admin/admin-dashboard-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Admin dashboard" subtitle="Read-only support overview for platform operations.">
      <AdminDashboardView />
    </AdminShell>
  );
}
