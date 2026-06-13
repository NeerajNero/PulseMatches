import { OrganizerCategoryManagerView } from "@/components/custom/organizer/organizer-category-manager-view";
import { OrganizerShell } from "@/components/custom/organizer/organizer-shell";
import { organizerTournamentEditRoute, ROUTES } from "@/utils/route";

export default function OrganizerTournamentCategoriesPage({ params }: Readonly<{ params: { id: string } }>) {
  return (
    <OrganizerShell
      title="Tournament categories"
      subtitle="Manage event divisions used for player registration."
      actions={(
        <div className="organizer-header-actions">
          <a className="secondary-action" href={ROUTES.ORGANIZER_TOURNAMENTS}>Back to tournaments</a>
          <a className="secondary-action" href={organizerTournamentEditRoute(params.id)}>Tournament setup</a>
        </div>
      )}
    >
      <OrganizerCategoryManagerView id={params.id} />
    </OrganizerShell>
  );
}
