# UI Component Plan

## Current Design System Snapshot

The current UI is global CSS with small React components. It is not a formal design system yet.

### Existing Layout Components

| Pattern | Source | Notes |
| --- | --- | --- |
| Root provider | `components/providers/app-providers.tsx` | React Query provider. |
| Auth shell | `components/custom/auth/auth-shell.tsx` | Reusable login/signup shell. |
| Public topbar markup | Repeated in pages | Should become `PublicHeader`. |
| Dashboard shell classes | `styles/globals.css` | Used by `/me` and `/organizer`. |
| Listing shell/classes | `styles/globals.css` | Used by `/tournaments`. |
| Detail shell/classes | `styles/globals.css` | Used by tournament detail. |

### Existing Navigation

- `.topbar`
- `.brand`
- `.brand-mark`
- `.nav-links`

No reusable `Header`, `Footer`, `OrganizerSidebar`, or breadcrumb component exists yet.

### Existing Cards And Panels

- `.feature-tile`
- `.tournament-card`
- `.detail-panel`
- `.score-panel`
- `.auth-panel`

### Existing Forms

- `.auth-form`
- `.filter-bar`
- `.checkbox-field`
- `.form-error`
- `.form-link`

No reusable input/select/button form primitives exist yet.

### Existing Buttons And Badges

- `.primary-action`
- `.secondary-action`
- `StatusPill`

`StatusPill` only supports `ready` and `planned`; tournament-specific statuses need more tones.

### Existing State Patterns

- `.state-text` for loading/error/empty copy.
- No reusable skeleton, empty state, error boundary, toast, modal, or dialog component exists.

## Components To Reuse

| Need | Reuse |
| --- | --- |
| Auth routes | `AuthShell`, `.auth-form`, `.primary-action`, `.secondary-action` |
| Public tournament listing | `.filter-bar`, `.tournament-card`, `.state-text` |
| Detail panels | `.detail-panel`, `.detail-grid`, `.detail-list` |
| Dashboard cards | `.dashboard-shell`, `.dashboard-grid`, `.feature-tile` |
| Status display | Extend `StatusPill` |

## Components To Create

### Shared Layout

| Component | Purpose |
| --- | --- |
| `PublicHeader` | Brand, discovery links, auth actions. |
| `PublicFooter` | About/contact/legal/location links. |
| `PageHeader` | Standard title/eyebrow/description block. |
| `DashboardLayout` | Shared authenticated dashboard shell. |
| `OrganizerNav` | Organizer section navigation. |
| `Breadcrumbs` | Tournament detail and organizer nested routes. |

### Shared UI

| Component | Purpose |
| --- | --- |
| `Button` | Normalize primary/secondary/danger/loading states. |
| `TextField` | Shared label/help/error input. |
| `SelectField` | Shared select styling. |
| `CheckboxField` | Shared checkbox/toggle pattern. |
| `StatusBadge` | Tournament, registration, match, payment statuses. |
| `EmptyState` | Reusable empty result/dashboard panels. |
| `LoadingState` | Standard loading text/skeleton. |
| `ErrorState` | Recoverable API error display. |
| `DataTable` | Organizer lists for tournaments, teams, registrations, matches. |
| `Tabs` | Tournament detail sections: overview, events, fixtures, results. |
| `Dialog` | Confirm publish/unpublish/cancel/status changes. |

### Tournament Discovery

| Component | Purpose | Reuse |
| --- | --- | --- |
| `TournamentCard` | Public card with sport, city, dates, venue, categories, status. | Current `.tournament-card`. |
| `TournamentListTable` | Dense organizer/admin list. | New table component. |
| `SportFilter` | Sport select/chips. | `useSports`. |
| `LocationFilter` | City select/chips. | `useCities`. |
| `TournamentStatusBadge` | `published`, `draft`, `registration_open`, etc. | Extend `StatusPill`. |
| `DateRangeText` | Consistent tournament date range. | New helper/component. |
| `CategorySummaryChips` | Category names and fees. | Existing category DTOs. |

### Tournament Detail And Registration

| Component | Purpose |
| --- | --- |
| `TournamentHero` | Title, sport, city, date, status, primary CTA. |
| `TournamentMedia` | Organizer media or original placeholder. |
| `TournamentInfoGrid` | Schedule, venue, organizer, registration state. |
| `EventCategorySelector` | Select bookable category. |
| `RegistrationForm` | Player/team details and confirmation. |
| `FeeSummary` | Fee/offline/payment status display. |
| `VenuePanel` | Address and future map link. |

### Organizer

| Component | Purpose |
| --- | --- |
| `OrganizerDashboardCards` | Tournaments, registrations, upcoming matches, tasks. |
| `TournamentEditorForm` | Draft/edit form. |
| `TournamentEventForm` | Category/event creation. |
| `TeamManagementTable` | Team/player rows and status actions. |
| `RegistrationStatusMenu` | Confirm/cancel/reject flows. |
| `FixtureBracketView` | Knockout bracket. |
| `RoundRobinTable` | Round-robin standings and match matrix. |
| `MatchScheduleEditor` | Court/ground/date/time form. |
| `MatchScoreEditor` | Generic score update. |
| `NotificationComposer` | Organizer announcement form later. |

### Pricing/Plan Comparison

Create an original `PlanComparisonSection` for organizer pricing/free-vs-pro style messaging. Keep copy, names, prices, and plan rules original. Do not copy Playmatches pricing labels or table text.

## UI Risks

- Current CSS is acceptable for MVP but will get hard to maintain as dashboards grow.
- No icon library exists; adding one would be a new package and should be justified before installation.
- There is no modal/dialog primitive. Browser confirm can work for first implementation, but status-changing organizer flows will eventually need a real dialog.
- Status vocabulary needs to be centralized so public cards, dashboards, and detail pages do not diverge.

