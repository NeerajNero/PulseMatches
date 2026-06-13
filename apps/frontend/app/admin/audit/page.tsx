import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminAuditPage() {
  return (
    <AdminShell title="Audit" subtitle="Inspect sanitized audit events for support investigations.">
      <AdminCollectionView kind="audit" />
    </AdminShell>
  );
}
