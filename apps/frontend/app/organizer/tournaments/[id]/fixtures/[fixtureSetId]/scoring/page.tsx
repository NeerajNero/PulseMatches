import { OrganizerFixtureScoringView } from "@/components/custom/organizer/organizer-fixture-scoring-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";

export default function OrganizerTournamentFixtureScoringPage({
  params
}: Readonly<{ params: { fixtureSetId: string; id: string } }>) {
  return (
    <OrganizerShell
      eyebrow="Organizer scoring"
      title="Match scoring"
      subtitle="Enter generic scores, complete matches, and review standings."
    >
      <OrganizerFixtureScoringView fixtureSetId={params.fixtureSetId} id={params.id} />
    </OrganizerShell>
  );
}
