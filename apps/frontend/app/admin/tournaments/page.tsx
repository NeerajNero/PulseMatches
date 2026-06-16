export const dynamic = 'force-dynamic';
import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminTournamentsPage() {
  return (
    <AdminShell title="Tournaments" subtitle="Inspect tournament visibility and organizer ownership.">
      <AdminCollectionView kind="tournaments" />
    </AdminShell>
  );
}
