import { AdminCollectionView } from "@/components/custom/admin/admin-collection-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminUsersPage() {
  return (
    <AdminShell title="Users" subtitle="Inspect users and roles without account mutation actions.">
      <AdminCollectionView kind="users" />
    </AdminShell>
  );
}
