import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminPaymentsPage() {
  return (
    <AdminShell title="Payments" subtitle="Inspect payment summaries and open read-only diagnostics.">
      <AdminCollectionView kind="payments" />
    </AdminShell>
  );
}
