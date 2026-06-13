# Gap Analysis

Status meanings:

- Exists: usable foundation is implemented.
- Partial: some model/API/UI exists but not enough for target behavior.
- Missing: no implementation found beyond docs/plans.

| Module | Status | Relevant files | Reusable pieces | Expected changes | Data models needed | API/routes needed | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Public marketing/homepage | Partial | `apps/frontend/app/(public)/page.tsx`, `styles/globals.css` | Topbar, hero, feature tiles, status pill | Replace foundation copy with original product home; add discovery CTAs, sports, organizer value, FAQ/pricing | Existing `Sport`, `City`, `Tournament` for dynamic sections | Optional `GET /tournaments?limit=...`; public pages | Low |
| 2. Tournament discovery/listing | Partial | `app/tournaments/page.tsx`, `DiscoveryController`, `DiscoveryRepository` | Search, city/sport/upcoming filters, tournament card | Add richer cards, pagination controls, status chips, date ranges, category summaries | Existing models sufficient for first pass | Existing `GET /tournaments`; maybe add featured/sort filters | Medium |
| 3. Location/city/global browsing | Partial | `GET /cities`, `City`, listing query `city` | City catalog and city filter | Add `/locations/[city]` route and global/all locations page | Existing `City`, `Venue`, `Tournament` | Existing `GET /cities`, `GET /tournaments?city=` | Low |
| 4. Sport/category filtering | Partial | `GET /sports`, `Sport`, `TournamentCategory` | Sport catalog, sport filter, category DTOs | Add `/sports/[sport]`; add category filter if needed | Existing `Sport`, `TournamentCategory` | Existing `GET /sports`, `GET /tournaments?sport=`; optional category query | Low |
| 5. Tournament details page | Partial | `app/tournaments/[slug]/page.tsx`, `TournamentDetailDto` | Schedule, venue, organizer, category cards | Add media, rules, category selector, registration CTA, fixtures/results tabs | Existing `Tournament`, `TournamentCategory`, `TournamentMedia`; future fixture/match models | Existing detail API; later fixture/results endpoints | Medium |
| 6. Event/category registration | Missing | Plans: `004-registration-booking.plan.md` | Category model and auth | Add registration service, player form, capacity checks | `Registration`, `Team`, `TeamMember` | `POST /registrations`, `GET /me/registrations` | High |
| 7. Ticket booking/payment/offline registration | Missing | No source implementation | Entry fee fields exist on categories | Start with offline/manual/payment placeholder; add provider only after approval | `Registration`, `Ticket/Booking`, optional `Payment` | Registration endpoints; future payment intent/webhook endpoints | High |
| 8. User/player accounts | Partial | `AuthController`, `use-auth.ts`, `/me` | Signup/login/me/logout, player role | Add account dashboard, registration history, profile edit, password reset later | Existing `User`, `UserRole`; future `PlayerProfile` | `GET/PATCH /me/profile`, `GET /me/registrations`, auth support routes | Medium |
| 9. Organizer accounts | Partial | `OrganizerController`, `/organizer` | Organizer signup/profile, role guard | Add profile edit UI, verification messaging, onboarding | Existing `OrganizerProfile` | Existing profile endpoints; future onboarding endpoints | Medium |
| 10. Organizer dashboard | Partial | `app/organizer/page.tsx` | Dashboard shell and role redirect | Add KPIs, nav, owned tournaments, tasks | Existing plus future registrations/matches | `GET /organizer/dashboard`, `GET /organizer/tournaments` | Medium |
| 11. Tournament creation/editing | Missing | Plan: `003-organizer-tournament-management.plan.md` | Existing tournament/category schema | Add organizer-owned CRUD, publish validation, forms | Existing `Tournament`, `TournamentCategory`, `TournamentMedia`, `Venue` may need more fields | `GET/POST/PATCH /organizer/tournaments`, publish/unpublish routes | High |
| 12. Team/player management | Missing | Plan: `004-registration-booking.plan.md` | Auth users and category participant type | Add team containers, manual organizer entries, member management | `Team`, `TeamMember`, `Registration`, possibly `PlayerProfile` | Organizer registration/team endpoints | High |
| 13. Fixture generation: knockout | Missing | Plan: `005-fixtures-scoring.plan.md` | Category `formatType=KNOCKOUT` | Add generator, fixture run, matches, slots | `Fixture`, `Match`, `MatchParticipant` | `POST /organizer/tournament-categories/:id/fixtures/generate` | High |
| 13. Fixture generation: round robin | Missing | Plan: `005-fixtures-scoring.plan.md` | Category `formatType=ROUND_ROBIN` | Add generator and standings derivation | `Fixture`, `Match`, `MatchParticipant`, standings view/model optional | Same generation endpoint plus standings endpoint | High |
| 13. Fixture generation: heats/groups | Missing | Current enum lacks `HEAT` | Swimming seed category exists but heat support is not modeled | Add heat/group format after first fixture slice | Extend format enum or add group/heats models | Future heat generation endpoints | High |
| 14. Match scheduling | Missing | Plan: `005-fixtures-scoring.plan.md` | Venue model | Add match time/court/ground assignment | `Match`, optional `PlayingSurface` | `PATCH /organizer/matches/:id/schedule` | Medium |
| 15. Live scoring/result updates | Missing | Plan: `005-fixtures-scoring.plan.md` | None beyond route placeholders in docs | Add generic score snapshots first, sport engines later | `Score`, `Game/Set`, `MatchEvent` | `PATCH /organizer/matches/:id/score`, `GET /matches/:id` | High |
| 16. Winners/runners/results display | Missing | Detail page has no results tab | Tournament detail layout can host tabs | Add completed matches and podium/results UI | `Match`, `MatchParticipant`, score models | Public fixtures/results endpoints | Medium |
| 17. Notifications/email | Missing | Redis service, docs only | Audit logs and future queue docs | Add notification model, provider abstraction, BullMQ only when needed | `Notification`, notification delivery rows | Organizer announcement endpoints; queue workers | High |
| 18. Static legal/info pages | Missing | No `/about`, `/contact`, `/privacy`, `/terms` routes | App Router and global CSS | Add original static pages; add payment/refund page if payments exist | None initially | Static frontend routes only | Low |
| 19. Admin/moderation | Missing | `RoleType.ADMIN`, seeded admin | Roles guard and audit logs | Add admin route group, organizer verification, catalog management, moderation | Existing models plus moderation flags if needed | `/admin/*`, admin catalog/moderation endpoints | High |
| 20. Mobile/responsive behavior | Partial | CSS media query at `max-width: 860px` | Responsive grids and shell classes | Improve mobile navigation, form layouts, cards, detail sections | None | None unless mobile app added | Medium |

## Biggest Missing Modules

1. Organizer tournament CRUD and publish workflow.
2. Registration/booking and team/player management.
3. Fixtures, scheduling, scoring, and standings.
4. Notifications/email.
5. Payments and booking reconciliation.
6. Admin verification/moderation.
7. Static legal/info pages.

