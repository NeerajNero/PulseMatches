import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminRegistrationsPage() {
  return (
    <AdminShell title="Registrations" subtitle="Inspect player registration state and payment status.">
      <AdminCollectionView kind="registrations" />
    </AdminShell>
  );
}
