import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminReconciliationPage() {
  return (
    <AdminShell title="Reconciliation" subtitle="Inspect one-shot payment reconciliation runs.">
      <AdminCollectionView kind="reconciliation" />
    </AdminShell>
  );
}
