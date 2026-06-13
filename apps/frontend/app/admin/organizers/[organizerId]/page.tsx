import { AdminOrganizerDetailView } from "@/components/custom/admin/admin-organizer-detail-view";
import { AdminShell } from "@/components/custom/admin/admin-shell";

export default function AdminOrganizerDetailPage({ params }: Readonly<{ params: { organizerId: string } }>) {
  return (
    <AdminShell title="Organizer verification" subtitle="Review organizer verification state, recent tournaments, and audited support decisions.">
      <AdminOrganizerDetailView organizerId={params.organizerId} />
    </AdminShell>
  );
}
