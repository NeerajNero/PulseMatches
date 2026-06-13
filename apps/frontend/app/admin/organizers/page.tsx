import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminOrganizersPage() {
  return (
    <AdminShell title="Organizers" subtitle="Inspect organizer profiles, status, and tournament counts.">
      <AdminCollectionView kind="organizers" />
    </AdminShell>
  );
}
