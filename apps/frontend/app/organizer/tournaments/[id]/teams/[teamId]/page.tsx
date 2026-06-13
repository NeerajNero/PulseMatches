import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { OrganizerTeamDetailView } from "@/components/custom/organizer/organizer-team-detail-view";

export default function OrganizerTournamentTeamDetailPage({
  params
}: Readonly<{ params: { id: string; teamId: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer roster"
      title="Team members"
      subtitle="Add participants or manual members to a team."
    >
      <OrganizerTeamDetailView id={params.id} teamId={params.teamId} />
    </OrganizerShell>
  );
}
