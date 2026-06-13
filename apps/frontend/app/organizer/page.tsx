import { OrganizerDashboardView } from "@/components/custom/organizer/organizer-dashboard-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { ROUTES } from "@/utils/route";

export default function OrganizerPage() {
  return (
    <OrganizerShell
      title="Organizer dashboard"
      subtitle="Create draft tournaments, manage event categories, and publish when ready."
      actions={<a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>}
    >
      <OrganizerDashboardView />
    </OrganizerShell>
  );
}
