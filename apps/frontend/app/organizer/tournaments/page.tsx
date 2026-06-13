import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { OrganizerTournamentListView } from "@/components/custom/organizer/organizer-tournament-list-view";
import { ROUTES } from "@/utils/route";

export default function OrganizerTournamentsPage() {
  return (
    <OrganizerShell
      title="Tournaments"
      subtitle="Manage drafts, publishing, and tournament setup."
      actions={<a className="primary-action" href={ROUTES.ORGANIZER_TOURNAMENT_NEW}>Create tournament</a>}
    >
      <OrganizerTournamentListView />
    </OrganizerShell>
  );
}
