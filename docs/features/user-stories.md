# MatchFlow Arena User Stories

## Player Stories

| ID | Feature | Priority | Story | Acceptance Criteria | Dependencies | Non-goals |
| --- | --- | --- | --- | --- | --- | --- |
| P-001 | Tournament discovery | P0 | As a player, I can browse tournaments by city, sport, status, and date. | Listing supports public filters and stable public URLs. | Sports, cities, tournaments, venues. | Personalized recommendations. |
| P-002 | Tournament details | P0 | As a player, I can view tournament details, categories, venue, organizer, and fees. | Detail page shows status, categories, schedule, venue, and organizer verification. | Public discovery model. | Copying any reference UI. |
| P-003 | Registration | P1 | As a player, I can register for a tournament category. | Registration stores status and fee snapshot. | Auth, tournament categories. | Real payment gateway in MVP. |
| P-004 | Fixtures and results | P1 | As a player, I can view fixtures, match status, results, and scores. | Public pages show scheduled/live/completed states. | Registrations, fixture generation, scoring. | Advanced statistics in early MVP. |

## Organizer Stories

| ID | Feature | Priority | Story | Acceptance Criteria | Dependencies | Non-goals |
| --- | --- | --- | --- | --- | --- | --- |
| O-001 | Organizer profile | P0 | As an organizer, I can create an organization or club profile. | Profile has slug and verification status. | Auth and roles. | Public verification workflow automation. |
| O-002 | Tournament management | P0 | As an organizer, I can create draft tournaments with venue, schedule, sports, and categories. | Draft can be edited and later published/unpublished. | Auth, sports, cities, venues. | Bulk upload in first implementation. |
| O-003 | Registration management | P1 | As an organizer, I can view registrations and add players or teams manually. | Organizer sees status and participant data for owned tournaments. | Registration slice. | Payment reconciliation. |
| O-004 | Fixture generation | P1 | As an organizer, I can generate knockout and round-robin fixtures. | Matches are stored and can be scheduled. | Registrations, category formats. | Complex seeding and same-academy avoidance in first fixture pass. |
| O-005 | Scoring | P1 | As an organizer, I can update match scores and results. | Match status and score snapshots update public views. | Fixtures and matches. | Live multi-device scoring in first scoring pass. |
| O-006 | Analytics | P2 | As an organizer, I can view tournament KPIs. | Dashboard summarizes registrations, matches, and results. | Registrations, scoring. | Advanced leaderboards in MVP. |

## Admin Stories

| ID | Feature | Priority | Story | Acceptance Criteria | Dependencies | Non-goals |
| --- | --- | --- | --- | --- | --- | --- |
| A-001 | Verification | P1 | As an admin, I can verify organizers and tournaments. | Verification status changes are audited. | Auth and admin role. | Full KYC automation. |
| A-002 | Catalog management | P1 | As an admin, I can manage sports and cities. | Sports/cities can be active/inactive. | Auth and admin role. | Import tooling in MVP. |
| A-003 | Moderation | P2 | As an admin, I can moderate published tournaments. | Admin can unpublish or flag content with audit history. | Tournament management. | Community reporting workflows. |

## Slice Mapping

- Slice 1: Satisfies foundation only.
- Slice 2: Enables auth and role dependencies.
- Slice 3: Implements P-001 and P-002.
- Slice 4: Implements O-002.
- Slice 5: Implements P-003 and O-003.
- Slice 6: Implements O-004 and part of P-004.
- Slice 7: Implements O-005 and scoring/results for P-004.
- Slice 8: Implements O-006 and leaderboard/analytics.
