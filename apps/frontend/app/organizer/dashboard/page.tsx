import { OrganizerDashboardView } from "@/components/custom/organizer/organizer-dashboard-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { ROUTES } from "@/utils/route";

export default function OrganizerDashboardPage() {
  return (
    <OrganizerShell
      title="Organizer dashboard"
      subtitle="Review tournament setup activity and registration counts."
      actions={<a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>}
    >
      <OrganizerDashboardView />
    </OrganizerShell>
  );
}
