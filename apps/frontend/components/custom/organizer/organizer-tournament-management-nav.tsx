import {
  organizerTournamentCategoriesRoute,
  organizerTournamentEditRoute,
  organizerTournamentFixturesRoute,
  organizerTournamentPaymentsRoute,
  organizerTournamentParticipantsRoute,
  organizerTournamentRegistrationsRoute,
  organizerTournamentTeamsRoute
} from "@/utils/route";

export function OrganizerTournamentManagementNav({ id }: Readonly<{ id: string }>) {
  return (
    <nav className="organizer-management-nav" aria-label="Tournament management">
      <a href={organizerTournamentEditRoute(id)}>Setup</a>
      <a href={organizerTournamentCategoriesRoute(id)}>Categories</a>
      <a href={organizerTournamentRegistrationsRoute(id)}>Registrations</a>
      <a href={organizerTournamentPaymentsRoute(id)}>Payments</a>
      <a href={organizerTournamentParticipantsRoute(id)}>Participants</a>
      <a href={organizerTournamentTeamsRoute(id)}>Teams</a>
      <a href={organizerTournamentFixturesRoute(id)}>Fixtures</a>
    </nav>
  );
}
