import { OrganizerRegistrationManagementView } from "@/components/custom/organizer/organizer-registration-management-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";

export default function OrganizerTournamentRegistrationsPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer roster"
      title="Registration review"
      subtitle="Approve or reject player registrations for an owned tournament."
    >
      <OrganizerRegistrationManagementView id={params.id} />
    </OrganizerShell>
  );
}
