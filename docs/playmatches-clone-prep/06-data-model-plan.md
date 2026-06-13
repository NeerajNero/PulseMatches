# Data Model Plan

This plan follows the current Prisma/PostgreSQL style:

- UUID primary keys.
- Prisma enums for lifecycle/status fields.
- `createdAt` and `updatedAt` mapped to snake_case columns.
- Unique slugs for public URLs.
- Restrictive deletes for business data.
- Audit logs for sensitive state changes.
- JSON only for flexible provider payloads, scoring metadata, or audit metadata.

Do not modify the database yet. This is a planning document only.

## Existing Models To Keep

| Entity | Current model |
| --- | --- |
| User | `User` |
| OrganizerProfile | `OrganizerProfile` |
| Sport | `Sport` |
| City/Location | `City` |
| Venue | `Venue` |
| Tournament | `Tournament` |
| TournamentEvent | `TournamentCategory` |
| AuditLog | `AuditLog` |

## Proposed Enums

Existing enums to reuse:

- `UserStatus`
- `RoleType`
- `OrganizerVerificationStatus`
- `OrganizerProfileStatus`
- `CatalogStatus`
- `TournamentStatus`
- `TournamentVisibility`
- `TournamentCategoryStatus`
- `TournamentFormatType`
- `ParticipantType`
- `GenderType`
- `TournamentMediaType`

New enums likely needed:

```text
PlayerProfileStatus: ACTIVE, INACTIVE
RegistrationStatus: PENDING, CONFIRMED, CANCELLED, WAITLISTED, REJECTED
PaymentStatus: NOT_REQUIRED, OFFLINE_PENDING, PENDING, PAID, FAILED, REFUNDED, CANCELLED
PaymentProvider: OFFLINE, MANUAL, RAZORPAY, STRIPE, OTHER
TeamStatus: ACTIVE, WITHDRAWN, DISQUALIFIED
FixtureStatus: DRAFT, GENERATED, LOCKED, ARCHIVED
FixtureFormatType: KNOCKOUT, ROUND_ROBIN, GROUPS, HEATS, CUSTOM
MatchStatus: SCHEDULED, LIVE, COMPLETED, CANCELLED, WALKOVER, POSTPONED
MatchParticipantRole: HOME, AWAY, SLOT, BYE
ScoreStatus: DRAFT, FINAL
NotificationType: REGISTRATION, SCHEDULE, RESULT, ANNOUNCEMENT, SYSTEM
NotificationStatus: PENDING, SENT, FAILED, READ, CANCELLED
```

`TournamentFormatType` already exists. Either extend it for `HEATS`/`GROUPS` or introduce `FixtureFormatType` if tournament category format and generated fixture format need to diverge.

## Entity Plans

### User

Current model: `User`.

Keep fields:

- `id`
- `email`
- `passwordHash`
- `displayName`
- `status`
- `createdAt`
- `updatedAt`

Relationships:

- roles
- organizerProfile
- refreshTokens
- auditLogs
- proposed playerProfile
- proposed registrations
- proposed team memberships

Indexes/constraints:

- Unique `email`.
- Existing role indexes through `UserRole`.

### PlayerProfile

New model.

Fields:

- `id`
- `userId`
- `slug`
- `displayName`
- `phone`
- `dateOfBirth`
- `gender`
- `cityId`
- `status`
- `metadata`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to `User`.
- optional city relation to `City`.
- can be referenced by `TeamMember`.

Indexes/constraints:

- Unique `userId`.
- Unique `slug`.
- Index `cityId`.
- Index `status`.

### OrganizerProfile

Current model: `OrganizerProfile`.

Possible additions:

- `description`
- `websiteUrl`
- `logoUrl`
- `address`
- `cityId`
- `verifiedAt`
- `rejectedAt`
- `rejectionReason`

Relationships:

- belongs to `User`.
- has many tournaments.

Indexes/constraints:

- Existing unique `userId`.
- Existing unique `slug`.
- Existing verification and status indexes.

### Sport

Current model: `Sport`.

Possible additions:

- `description`
- `iconUrl`
- `sortOrder`

Relationships:

- has many tournaments.
- future scoring config can reference sport.

Indexes/constraints:

- Existing unique `slug`.
- Existing `status` index.

### City / Location

Current model: `City`.

Possible additions:

- `region`
- `timezone`
- `latitude`
- `longitude`
- `sortOrder`

Relationships:

- has many venues.
- has many tournaments.
- optional player profiles.

Indexes/constraints:

- Existing unique `slug`.
- Existing `status` index.
- Consider unique `countryCode, slug` if global locations are expanded.

### Venue

Current model: `Venue`.

Possible additions:

- `contactName`
- `contactPhone`
- `mapsUrl`
- `timezone`

Relationships:

- belongs to city.
- has many tournaments.
- future playing surfaces.

Indexes/constraints:

- Existing unique `slug`.
- Existing `cityId` and `status` indexes.

### Tournament

Current model: `Tournament`.

Possible additions:

- `rules`
- `eligibilityNotes`
- `contactName`
- `contactEmail`
- `contactPhone`
- `timezone`
- `registrationMode`: ONLINE, OFFLINE, MIXED
- `requiresApproval`
- `unpublishedAt`
- `blockedReason`
- `verificationStatus` if tournament-level verification is needed.

Relationships:

- belongs to organizer profile, sport, city, venue.
- has categories/events, media, registrations, fixtures, matches.

Indexes/constraints:

- Existing unique `slug`.
- Existing `cityId`, `sportId`, `status`, `visibility`, `startsAt`, compound public listing index.
- Add index `organizerProfileId, status`.
- Add index `registrationClosesAt`.

### TournamentEvent

Current model: `TournamentCategory`.

Use this as the event/category bookable unit.

Possible additions:

- `description`
- `rules`
- `minTeamSize`
- `maxTeamSize`
- `minRating`
- `maxRating`
- `waitlistCapacity`
- `registrationRequiresApproval`
- `sortOrder`

Relationships:

- belongs to tournament.
- has registrations.
- has fixtures.

Indexes/constraints:

- Existing unique `tournamentId, code`.
- Existing `tournamentId` and `status` indexes.
- Add index `formatType`.

### Team

New model.

Fields:

- `id`
- `tournamentCategoryId`
- `registrationId`
- `name`
- `status`
- `seed`
- `academyOrClubName`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to tournament category.
- optional one-to-one or many-to-one with registration, depending on whether a registration can include multiple teams.
- has many team members.
- appears in match participants.

Indexes/constraints:

- Index `tournamentCategoryId, status`.
- Index `registrationId`.
- Optional unique `tournamentCategoryId, name` if needed.

### TeamMember

New model.

Fields:

- `id`
- `teamId`
- `userId`
- `displayName`
- `email`
- `phone`
- `role`: CAPTAIN, PLAYER, SUBSTITUTE
- `sortOrder`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to team.
- optional user relation for registered users.

Indexes/constraints:

- Index `teamId`.
- Index `userId`.
- Unique `teamId, userId` when `userId` is not null, if Prisma/DB constraints support desired behavior.

### Registration

New model.

Fields:

- `id`
- `userId`
- `tournamentId`
- `tournamentCategoryId`
- `teamId`
- `status`
- `paymentStatus`
- `feeAmount`
- `feeCurrency`
- `registeredAt`
- `cancelledAt`
- `confirmedAt`
- `source`: PLAYER_ONLINE, ORGANIZER_MANUAL, ADMIN
- `notes`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to user/player account.
- belongs to tournament and category.
- has one or more teams depending on participant type.
- has payment/booking rows.

Indexes/constraints:

- Index `userId, status`.
- Index `tournamentId, status`.
- Index `tournamentCategoryId, status`.
- Unique `tournamentCategoryId, userId` for singles if enforced generically, or enforce in service logic.
- Add transactional capacity checks in service logic.

### Ticket / Booking

New model if booking is distinct from registration.

Fields:

- `id`
- `registrationId`
- `bookingNumber`
- `status`
- `amount`
- `currency`
- `issuedAt`
- `cancelledAt`
- `metadata`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to registration.
- has payment records.

Indexes/constraints:

- Unique `bookingNumber`.
- Unique `registrationId` if one booking per registration.
- Index `status`.

### Payment

Add only if payment provider/offline payment flow is approved.

Fields:

- `id`
- `registrationId`
- `bookingId`
- `provider`
- `providerReference`
- `status`
- `amount`
- `currency`
- `providerPayload`
- `paidAt`
- `failedAt`
- `refundedAt`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to registration and optionally booking.

Indexes/constraints:

- Index `registrationId`.
- Index `status`.
- Unique `provider, providerReference` when provider reference exists.

### Fixture / Bracket

New model.

Fields:

- `id`
- `tournamentCategoryId`
- `formatType`
- `status`
- `name`
- `generationSeed`
- `generatedAt`
- `lockedAt`
- `metadata`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to tournament category.
- has matches.

Indexes/constraints:

- Index `tournamentCategoryId, status`.
- Index `formatType`.

### Match

New model.

Fields:

- `id`
- `fixtureId`
- `tournamentId`
- `tournamentCategoryId`
- `roundNumber`
- `roundLabel`
- `matchNumber`
- `status`
- `scheduledAt`
- `startedAt`
- `completedAt`
- `venueId`
- `surfaceName`
- `winnerTeamId`
- `resultSummary`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to fixture, tournament, category.
- has match participants.
- has score records/events.
- optional venue relation.

Indexes/constraints:

- Index `fixtureId, roundNumber`.
- Index `tournamentId, status`.
- Index `tournamentCategoryId, status`.
- Index `scheduledAt`.
- Unique `fixtureId, matchNumber`.

### MatchParticipant

New model.

Fields:

- `id`
- `matchId`
- `teamId`
- `slotLabel`
- `role`
- `seed`
- `isBye`
- `result`: WIN, LOSS, DRAW, WALKOVER, TBD
- `createdAt`
- `updatedAt`

Relationships:

- belongs to match.
- optional team for future rounds before winner is known.

Indexes/constraints:

- Index `matchId`.
- Index `teamId`.
- Unique `matchId, role` for two-sided matches if appropriate.

### Score / Game / Set

Prefer a generic `MatchScore` plus optional JSON metadata first.

Fields:

- `id`
- `matchId`
- `teamId`
- `periodNumber`
- `periodLabel`
- `points`
- `status`
- `metadata`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to match.
- optional team relation.

Indexes/constraints:

- Index `matchId`.
- Unique `matchId, teamId, periodNumber`.

For detailed sport-specific scoring, add `MatchEvent`:

- `id`
- `matchId`
- `actorUserId`
- `eventType`
- `occurredAt`
- `metadata`
- `createdAt`

### Notification

New model.

Fields:

- `id`
- `recipientUserId`
- `tournamentId`
- `registrationId`
- `matchId`
- `type`
- `status`
- `subject`
- `body`
- `channel`: EMAIL, IN_APP, PUSH, SMS
- `sentAt`
- `readAt`
- `failureReason`
- `metadata`
- `createdAt`
- `updatedAt`

Relationships:

- belongs to user.
- optional tournament, registration, match.

Indexes/constraints:

- Index `recipientUserId, status`.
- Index `type`.
- Index `createdAt`.

### AuditLog

Current model: `AuditLog`.

Reuse for:

- auth signup/login/logout
- organizer profile create/update
- tournament create/update/publish/unpublish/block
- registration create/status changes
- fixture generation/regeneration
- match schedule/score/result changes
- payment status changes
- notification fan-out actions

Current fields are sufficient:

- `actorId`
- `entityType`
- `entityId`
- `action`
- `metadata`
- `createdAt`

