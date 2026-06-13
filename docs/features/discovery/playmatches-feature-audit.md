# Playmatches Public Feature Audit

## Source Scope

Public pages inspected on 2026-05-26:

- https://www.playmatches.com
- https://www.playmatches.com/bengaluru
- https://www.playmatches.com/bengaluru/tournaments
- Public tournament detail examples under `/bengaluru/tournaments/...`
- https://www.playmatches.com/scoring-app
- https://www.playmatches.com/sports/badminton
- https://www.playmatches.com/sports/cricket
- https://www.playmatches.com/sports/swimming
- https://www.playmatches.com/organizers
- https://organizer.playmatches.com

The organizer portal itself did not expose static crawlable feature detail during inspection. Organizer-facing notes below are inferred from public organizer/sport pages, not from private dashboard screens.

## Legal Note

Playmatches is used only as a public feature-discovery reference. MatchFlow Arena must not copy Playmatches branding, logo, exact UI, images, screenshots, copywriting, visual layout, or proprietary assets.

## Public/Player-Facing Features

- Homepage with tournament discovery entry points and organizer call-to-action.
- City pages that feature tournaments, upcoming events, and player leaderboard concepts.
- City tournament listing pages with upcoming tournaments, sport labels, dates, venues, and category summary chips.
- Tournament detail pages with verification status, sport, title, date range, countdown, media, categories, entry fees, venue, overview, organizer profile, and share/back actions.
- Sport landing pages that explain supported tournament operations per sport.
- Scoring app page that presents sport selection, real-time score updates, friendly/tournament matches, multi-device support, configurable sets/points, and live score views.
- Mobile app references for browsing tournaments, scores, results, and notifications.

## Organizer-Facing Features

- Create public or private tournaments.
- Manage teams and players.
- Online registration/booking, including payment handling where available.
- Offline/manual player or team additions.
- Bulk email promotion and player communication.
- Automatic fixture/draw generation.
- Knockout, round-robin, round-robin plus knockout, and heat formats.
- Seeding options and manual fixture generation/editing.
- Match scheduling and completion.
- Download/print fixtures.
- Scoring apps for tournament matches.
- Live score display/TV mode.
- Sport-specific score configuration such as badminton sets/points/deuce, cricket overs and ball-by-ball events, and swimming heat timings.
- Tournament analytics for sport-specific stats such as cricket batting/bowling summaries.

## Admin/Moderation Features We May Need

- Organizer verification.
- Tournament verification before public trust badges are shown.
- Sports and cities catalog management.
- Published tournament moderation/unpublish.
- Audit logs for verification, publish/unpublish, registration status changes, fixture generation, and score updates.
- Platform overview for registrations, tournaments, active organizers, and flagged content.

## Tournament Detail Page Structure

Recommended original MatchFlow Arena structure:

- Breadcrumbs and public status.
- Trust indicator: verified/unverified organizer or tournament.
- Sport and tournament title.
- Date/time range and registration/status messaging.
- Hero media owned by organizer or default original placeholder.
- Category list with division name, format, fee, capacity, and registration state.
- Primary registration action per category.
- Venue card with address and future map link.
- Tournament overview/rules section.
- Organizer profile summary.
- Fixtures/results tabs once generated.
- Share action and related tournaments later.

## Tournament Registration Flow

MVP flow:

1. Player opens public tournament detail.
2. Player selects an available category.
3. Auth gate prompts signup/login when needed.
4. Player/team details are captured.
5. Registration is created with `pending` or `confirmed` status.
6. Payment status is stored as `not_required`, `pending`, or `offline_pending` until a real gateway is approved.
7. Player can view personal registration status.
8. Organizer can view and update registration status.

Later flow:

- Online payment gateway.
- Refund/cancellation rules.
- Waiting lists.
- Team invite acceptance.
- Category-specific eligibility validation.

## Fixture Generation Requirements

MVP:

- Store fixture generation runs by category.
- Support knockout and round-robin formats first.
- Generate matches with round labels and participant slots.
- Allow organizer to schedule court/ground and match time.
- Preserve generated fixtures for public display.
- Audit generation and regeneration.

Later:

- Round-robin plus knockout.
- Heats for swimming/athletics.
- Seeding.
- Same-academy or same-team avoidance.
- Printable/exportable brackets.
- Live TV/display views.

## Live Scoring Requirements

MVP scoring slice:

- Match statuses: scheduled, live, completed, cancelled.
- Organizer can update score snapshots and mark winner.
- Public pages show current score/result.
- Round-robin standings update from completed match results.

Later:

- Real-time multi-device scoring.
- Sport-specific scoring engines.
- Point-by-point/ball-by-ball event streams.
- Live TV mode.
- Umpire/scorer permissions.
- Offline scoring recovery.

## Leaderboard/Analytics Requirements

MVP/later split:

- Later MVP: tournament KPIs, wins/losses, registrations by category, match completion.
- Later: city and sport leaderboards, player ranking periods, tournament-specific analytics, cricket-style detailed stat leaders, organizer performance dashboards.

## Payment Requirements

MVP:

- No real gateway.
- Store payment requirement and payment status snapshots on registrations.
- Allow offline/manual confirmation.

Later:

- Payment intents table.
- Provider payload JSONB.
- Webhook handling.
- Refunds/cancellations.
- Regional provider configuration.
- Audit and reconciliation views.

## Notification/Email Requirements

MVP:

- No notification provider in Slice 1.
- Model future notification events in plans only.

Later:

- Email confirmations.
- Schedule/fixture/result updates.
- Organizer announcements.
- Queue-backed retries.
- Notification audit trail.

## MVP vs Later Features

MVP slices:

- Project foundation.
- Auth and roles.
- Public tournament discovery.
- Organizer tournament creation.
- Registration/booking with payment placeholder.
- Fixture generation.
- Scoring/results.
- Basic analytics/leaderboard.

Later:

- Real payments.
- Bulk imports.
- Bulk email/SMS/push.
- Advanced sport-specific scoring.
- Seeding and clash-avoidance fixture logic.
- Live TV mode.
- Mobile apps.
- Public rankings across cities and sports.

## Assumptions

- Public tournament URLs should use unique slugs plus UUIDs or another collision-safe identifier.
- Categories are the bookable unit for registration.
- Teams can represent both individual and multi-person entries.
- Verification is an admin-controlled lifecycle state.
- Redis will be useful for future queues and live scoring, but is not required by Slice 1 app logic.

## Open Questions

- Should MatchFlow Arena support India-only payments first or remain geography-neutral?
- Which sport should be the first fully supported sport in scoring?
- Should organizers self-serve publication immediately, or require admin verification before public listing?
- Should category eligibility rules be structured fields or initially organizer-written text?
- What deployment target should the monorepo optimize for?

## Non-Goals

- Copying Playmatches UI, visual identity, copy, images, screenshots, or proprietary assets.
- Implementing all public reference features in the first pass.
- Building a mobile app in MVP foundation.
- Real payment gateway integration without explicit later approval.
- Live scoring, notifications, and advanced analytics in Slice 1.
