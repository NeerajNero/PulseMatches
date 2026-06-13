import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { OrganizerTournamentCreateView } from "@/components/custom/organizer/organizer-tournament-create-view";
import { ROUTES } from "@/utils/route";

export default function NewOrganizerTournamentPage() {
  return (
    <OrganizerShell
      title="Create tournament"
      subtitle="Save tournament setup as a draft. Publishing stays explicit."
      actions={<a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Back to tournaments</a>}
    >
      <OrganizerTournamentCreateView />
    </OrganizerShell>
  );
}
