import { OrganizerFixtureDetailView } from "@/components/custom/organizer/organizer-fixture-detail-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";

export default function OrganizerTournamentFixtureDetailPage({
  params
}: Readonly<{ params: { fixtureSetId: string; id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer fixtures"
      title="Fixture detail"
      subtitle="Review generated rounds and update match schedule details."
    >
      <OrganizerFixtureDetailView fixtureSetId={params.fixtureSetId} id={params.id} />
    </OrganizerShell>
  );
}
