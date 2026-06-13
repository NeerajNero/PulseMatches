# Target Product Analysis

## Reference Boundary

Playmatches was reviewed only as public product/UX inspiration. The final app must remain an original MatchFlow Arena product:

- Do not copy Playmatches branding, logo, images, screenshots, text, data, testimonials, pricing copy, or exact layout.
- Do not scrape or import Playmatches tournament data.
- Build original names, assets, copy, navigation, and visual design.
- Use the same repo stack and conventions already present here.

Public reference pages indicate a product centered on tournament discovery, online enrollment/booking, organizer tools, automated fixtures, scoring, results, and notifications. The homepage also exposes city/global tournament links, supported sports, mobile app/scoring tool positioning, featured tournaments, organizer calls to action, FAQ, and legal links. Organizer/public pages describe create tournaments, manage teams/players, knockout/round-robin/heat fixtures, scoring apps, notifications, online ticket booking, and free/pro-style feature comparison.

Sources inspected:

- https://www.playmatches.com/
- https://www.playmatches.com/organizers
- https://www.playmatches.com/about-us/
- https://www.playmatches.com/sports/tennis
- Existing repo audit: `docs/features/discovery/playmatches-feature-audit.md`

## User Roles

| Role | Desired responsibilities |
| --- | --- |
| Guest | Browse home, sports, locations, tournament listings, tournament details, static pages. |
| Player | Sign up/login, register for categories, manage bookings/registrations, view schedules, fixtures, live scores, and results. |
| Organizer | Create and publish tournaments, manage categories, registrations, teams/players, fixtures, schedules, scores, and notifications. |
| Admin | Verify organizers/tournaments, manage catalogs, moderate published content, audit sensitive changes. |

## Public Flow

1. Guest lands on home page.
2. Guest discovers tournaments by city, sport, date, status, or keyword.
3. Guest opens a tournament detail page.
4. Detail page shows sport, city, venue, date range, registration state, organizer, categories, fees, capacity, rules/overview, fixtures/results when available.
5. Guest selects a category and is prompted to log in or create an account.

## Player Flow

1. Player signs up or logs in.
2. Player registers for a tournament category.
3. Player supplies participant/team details.
4. Registration is confirmed directly or left pending/offline-payment-pending depending on payment rules.
5. Player views registration history and booking status.
6. Player follows fixtures, schedule, match status, live scores, results, and winner/runner-up summaries.

## Organizer Flow

1. Organizer signs up and creates an organizer profile.
2. Organizer creates draft tournament.
3. Organizer adds sport, city, venue, schedule, registration window, categories/events, fees, capacity, rules, and media.
4. Organizer publishes tournament if validation passes.
5. Organizer reviews registrations and manually adds teams/players when needed.
6. Organizer generates fixtures for a category.
7. Organizer schedules matches and assigns court/ground/time.
8. Organizer updates scores/results.
9. Organizer sends announcements and schedule/result notifications in later slices.

## Feature Breakdown

| Area | Desired feature set |
| --- | --- |
| Marketing/public home | Brand-original hero, discovery entry points, supported sports, organizer CTA, pricing comparison, FAQ. |
| Discovery | Tournament listing, filters, search, sport pages, city/location pages, global browsing. |
| Tournament detail | Event summary, media, status, categories, fees, schedule, venue, organizer, fixtures/results tabs. |
| Registration | Account-gated player/team registration, fee snapshot, status, capacity checks. |
| Booking/payment | Offline/manual first unless a provider is explicitly approved; online payment later. |
| Organizer dashboard | KPIs, tournament management, registrations, fixture/scoring workflow. |
| Fixture generation | Knockout and round robin first, heats/groups later. |
| Match scheduling | Court/ground/time assignment, status lifecycle. |
| Scoring/results | Generic score snapshots first; sport-specific engines later. |
| Notifications | Email/notification model and provider abstraction later. |
| Static pages | About, Contact, Privacy, Terms, Refund/Payments policy if payments are added. |
| Admin | Organizer verification, tournament moderation, catalog management. |
| Mobile/responsive | Responsive web now; native mobile is out of current repo scope. |

