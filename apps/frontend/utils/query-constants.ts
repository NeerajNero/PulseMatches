export const AUTH_QUERY_KEYS = {
  ME: ["auth", "me"] as const,
  ORGANIZER_PROFILE: ["organizer", "profile"] as const
};

export const ORGANIZER_TOURNAMENT_QUERY_KEYS = {
  DASHBOARD: ["organizer", "dashboard"] as const,
  TOURNAMENTS: (filters: unknown) => ["organizer", "tournaments", filters] as const,
  TOURNAMENT: (id: string) => ["organizer", "tournament", id] as const,
  CATEGORIES: (id: string) => ["organizer", "tournament", id, "categories"] as const,
  ROSTER_SUMMARY: (id: string) => ["organizer", "tournament", id, "roster-summary"] as const,
  REPORT_SUMMARY: (id: string, filters: unknown) => ["organizer", "tournament", id, "report-summary", filters] as const,
  REGISTRATIONS: (id: string, filters: unknown) => ["organizer", "tournament", id, "registrations", filters] as const,
  PAYMENTS: (id: string, filters: unknown) => ["organizer", "tournament", id, "payments", filters] as const,
  PAYMENT_DETAIL: (id: string, registrationId: string) => ["organizer", "tournament", id, "payments", registrationId] as const,
  PARTICIPANTS: (id: string, filters: unknown) => ["organizer", "tournament", id, "participants", filters] as const,
  TEAMS: (id: string, filters: unknown) => ["organizer", "tournament", id, "teams", filters] as const,
  TEAM: (id: string, teamId: string) => ["organizer", "tournament", id, "team", teamId] as const,
  FIXTURES: (id: string) => ["organizer", "tournament", id, "fixtures"] as const,
  FIXTURE: (id: string, fixtureSetId: string) => ["organizer", "tournament", id, "fixture", fixtureSetId] as const,
  FIXTURE_RESULTS: (id: string, fixtureSetId: string) => ["organizer", "tournament", id, "fixture", fixtureSetId, "results"] as const
};

export const DISCOVERY_QUERY_KEYS = {
  SPORTS: ["discovery", "sports"] as const,
  CITIES: ["discovery", "cities"] as const,
  TOURNAMENTS: (filters: unknown) => ["discovery", "tournaments", filters] as const,
  TOURNAMENT_DETAIL: (slugOrId: string) => ["discovery", "tournament", slugOrId] as const,
  TOURNAMENT_FIXTURES: (slugOrId: string) => ["discovery", "tournament", slugOrId, "fixtures"] as const
};

export const REGISTRATION_QUERY_KEYS = {
  MY_REGISTRATIONS: ["registrations", "me"] as const,
  REGISTRATION: (id: string) => ["registrations", id] as const,
  PAYMENT: (id: string) => ["registrations", id, "payment"] as const
};

export const ADMIN_QUERY_KEYS = {
  DASHBOARD: ["admin", "dashboard"] as const,
  REPORT_SUMMARY: (filters: unknown) => ["admin", "reports", "summary", filters] as const,
  USERS: (filters: unknown) => ["admin", "users", filters] as const,
  ORGANIZERS: (filters: unknown) => ["admin", "organizers", filters] as const,
  ORGANIZER_DETAIL: (organizerId: string) => ["admin", "organizers", organizerId] as const,
  TOURNAMENTS: (filters: unknown) => ["admin", "tournaments", filters] as const,
  REGISTRATIONS: (filters: unknown) => ["admin", "registrations", filters] as const,
  PAYMENTS: (filters: unknown) => ["admin", "payments", filters] as const,
  PAYMENT_DETAIL: (paymentRecordId: string) => ["admin", "payments", paymentRecordId] as const,
  NOTIFICATIONS: (filters: unknown) => ["admin", "notifications", filters] as const,
  RECONCILIATION: (filters: unknown) => ["admin", "reconciliation", filters] as const,
  OPERATIONS: ["admin", "operations", "status"] as const,
  AUDIT: (filters: unknown) => ["admin", "audit", filters] as const
};
