export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ACCOUNT: "/account",
  ACCOUNT_REGISTRATIONS: "/account/registrations",
  ME: "/me",
  ORGANIZER: "/organizer",
  ORGANIZER_DASHBOARD: "/organizer/dashboard",
  ORGANIZER_TOURNAMENTS: "/organizer/tournaments",
  ORGANIZER_TOURNAMENT_NEW: "/organizer/tournaments/new",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  TOURNAMENTS: "/tournaments",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_ORGANIZERS: "/admin/organizers",
  ADMIN_TOURNAMENTS: "/admin/tournaments",
  ADMIN_REGISTRATIONS: "/admin/registrations",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_RECONCILIATION: "/admin/reconciliation",
  ADMIN_AUDIT: "/admin/audit"
} as const;

export function tournamentDetailRoute(slug: string) {
  return `/tournaments/${slug}`;
}

export function organizerTournamentEditRoute(id: string) {
  return `/organizer/tournaments/${id}/edit`;
}

export function organizerTournamentCategoriesRoute(id: string) {
  return `/organizer/tournaments/${id}/categories`;
}

export function organizerTournamentRegistrationsRoute(id: string) {
  return `/organizer/tournaments/${id}/registrations`;
}

export function organizerTournamentPaymentsRoute(id: string) {
  return `/organizer/tournaments/${id}/payments`;
}

export function organizerTournamentParticipantsRoute(id: string) {
  return `/organizer/tournaments/${id}/participants`;
}

export function organizerTournamentTeamsRoute(id: string) {
  return `/organizer/tournaments/${id}/teams`;
}

export function organizerTournamentTeamRoute(id: string, teamId: string) {
  return `/organizer/tournaments/${id}/teams/${teamId}`;
}

export function organizerTournamentFixturesRoute(id: string) {
  return `/organizer/tournaments/${id}/fixtures`;
}

export function organizerTournamentFixtureRoute(id: string, fixtureSetId: string) {
  return `/organizer/tournaments/${id}/fixtures/${fixtureSetId}`;
}

export function organizerTournamentFixtureScoringRoute(id: string, fixtureSetId: string) {
  return `/organizer/tournaments/${id}/fixtures/${fixtureSetId}/scoring`;
}

export function adminPaymentDetailRoute(paymentRecordId: string) {
  return `/admin/payments/${paymentRecordId}`;
}

export function adminOrganizerDetailRoute(organizerId: string) {
  return `/admin/organizers/${organizerId}`;
}
