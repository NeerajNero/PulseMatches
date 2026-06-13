import { OrganizerFixtureManagementView } from "@/components/custom/organizer/organizer-fixture-management-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";

export default function OrganizerTournamentFixturesPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer fixtures"
      title="Fixtures"
      subtitle="Generate tournament fixtures from active rosters and schedule matches."
    >
      <OrganizerFixtureManagementView id={params.id} />
    </OrganizerShell>
  );
}
