import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { OrganizerTournamentEditorView } from "@/components/custom/organizer/organizer-tournament-editor-view";
import { organizerTournamentCategoriesRoute, ROUTES } from "@/utils/route";

export default function EditOrganizerTournamentPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      title="Edit tournament"
      subtitle="Update tournament setup and publish only when all required details are ready."
      actions={(
        <div className="organizer-header-actions">
          <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Back to tournaments</a>
          <a className="primary-action" href={organizerTournamentCategoriesRoute(params.id)}>Categories</a>
        </div>
      )}
    >
      <OrganizerTournamentEditorView id={params.id} />
    </OrganizerShell>
  );
}
