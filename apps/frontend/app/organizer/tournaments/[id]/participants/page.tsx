import { OrganizerParticipantManagementView } from "@/components/custom/organizer/organizer-participant-management-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";

export default function OrganizerTournamentParticipantsPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer roster"
      title="Participants"
      subtitle="Manage approved and manual participant entries."
    >
      <OrganizerParticipantManagementView id={params.id} />
    </OrganizerShell>
  );
}
