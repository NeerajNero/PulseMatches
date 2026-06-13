import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { OrganizerTeamManagementView } from "@/components/custom/organizer/organizer-team-management-view";

export default function OrganizerTournamentTeamsPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer roster"
      title="Teams"
      subtitle="Create team entries and manage team-level roster setup."
    >
      <OrganizerTeamManagementView id={params.id} />
    </OrganizerShell>
  );
}
