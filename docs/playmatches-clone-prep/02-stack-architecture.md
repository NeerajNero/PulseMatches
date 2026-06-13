# Stack And Architecture

## Framework And Language

- Language: TypeScript.
- Backend framework: NestJS 10.
- Frontend framework: Next.js 14 App Router with React 18.
- Package manager: pnpm 9.15.4.
- Monorepo: pnpm workspaces.

## Backend Architecture

Backend source lives in `apps/backend/src`.

Key patterns:

- `main.ts` enables helmet, CORS, global validation, exception filtering, response envelope, and Swagger.
- Feature modules are imported by `AppModule`.
- Current modules: `HealthModule`, `AuthModule`, `OrganizerModule`, `DiscoveryModule`.
- Data access is intentionally layered:
  - controller
  - service
  - DB service
  - repository
  - Prisma service
- API response shaping uses transform classes, for example `DiscoveryTransform` and `AuthTransform`.
- Request validation uses `class-validator` and `class-transformer`.
- Swagger decorators define the API contract.

Important backend conventions:

- Use UUID primary keys.
- Use lifecycle status enums instead of hard deletes.
- Use snake_case API DTO fields and mapped Prisma fields.
- Add `created_at`/`updated_at` on business tables.
- Write audit logs for important business state changes.
- Regenerate OpenAPI and SDK after backend DTO/route changes.

## API Layer

Current API endpoints:

| Method | Path | Purpose | Auth |
| --- | --- | --- | --- |
| `GET` | `/health` | API health | Public |
| `POST` | `/auth/signup` | Player/organizer signup | Public |
| `POST` | `/auth/login` | Login | Public |
| `POST` | `/auth/refresh` | Refresh access token | Public |
| `POST` | `/auth/logout` | Logout and revoke refresh token | JWT |
| `GET` | `/auth/me` | Current user | JWT |
| `GET` | `/organizer/profile` | Current organizer profile | JWT + ORGANIZER |
| `POST` | `/organizer/profile` | Create organizer profile | JWT + ORGANIZER |
| `PATCH` | `/organizer/profile` | Update organizer profile | JWT + ORGANIZER |
| `GET` | `/sports` | Active sports | Public |
| `GET` | `/cities` | Active cities | Public |
| `GET` | `/tournaments` | Public published tournament listing | Public |
| `GET` | `/tournaments/:slugOrId` | Public tournament detail | Public |

Swagger is mounted at `/docs`, with raw JSON available through the Swagger JSON endpoint used by `scripts/export-openapi.mjs` as `/docs-json`.

## Frontend Architecture

Frontend source lives in `apps/frontend`.

Key patterns:

- Next routes live directly under `apps/frontend/app`.
- Root provider composition is in `components/providers/app-providers.tsx`.
- Server state uses React Query.
- API calls go through hooks in `apps/frontend/hooks`.
- Hooks use `apiClient` from `apps/frontend/lib/apis/api.ts`.
- `apiClient` wraps generated SDK clients from `@matchflow/client-sdk`.
- Auth tokens are currently stored in browser `localStorage`.
- UI is global CSS plus small component primitives.

Current route groups are minimal:

- `app/(public)` exists for the homepage only.
- No `(auth)`, `(organizer)`, or `(admin)` route groups exist yet.
- Protected pages redirect client-side with `window.location.assign`.
- No Next middleware is present.

## Styling System

Styling is global CSS only:

- File: `apps/frontend/styles/globals.css`
- CSS variables define colors.
- Layout classes include `topbar`, `page-shell`, `listing-shell`, `detail-shell`, `dashboard-shell`, `auth-page`.
- Reusable card/panel patterns include `feature-tile`, `tournament-card`, `detail-panel`, `score-panel`, `auth-panel`.

There is no Tailwind, CSS modules, shadcn/ui, Radix, Material UI, or icon library dependency in `apps/frontend/package.json`.

## Database And ORM

Database:

- PostgreSQL 16 through Docker.
- Prisma 5 in `apps/backend/prisma`.

Current migrations:

- `20260525192231_002a_auth_and_roles`
- `20260525194342_002_public_tournament_discovery`

Current model areas:

- Auth and roles.
- Organizer profiles.
- Sports, cities, venues.
- Public tournament discovery.
- Refresh tokens.
- Audit logs.

## Authentication And Authorization

Current auth:

- Email/password signup and login.
- Password hashing with `bcryptjs`.
- JWT access token signed with `@nestjs/jwt`.
- Refresh token values generated with Node crypto, stored as SHA-256 hashes.
- Roles stored in `user_roles`.
- Backend guards: `JwtAuthGuard`, `RolesGuard`.
- Role decorator: `@Roles(RoleType.ORGANIZER)`.

Current roles:

- `PLAYER`
- `ORGANIZER`
- `ADMIN`

Admin role exists in schema and seed but no admin API or UI exists yet.

## State Management

- React Query is used for server state.
- Query keys are centralized in `apps/frontend/utils/query-constants.ts`.
- No Redux, Zustand, or client-side global store exists.

## Forms And Validation

Frontend:

- Plain React form handling with `FormEvent` and `FormData`.
- Inputs use native required/minLength constraints in current pages.

Backend:

- DTO classes use `class-validator`.
- Global `ValidationPipe` uses whitelist, transform, and unknown-field rejection.

No React Hook Form, Zod, Yup, or Valibot dependency is present.

## Testing Setup

Detected scripts:

- Root: `pnpm build`, `pnpm typecheck`, `pnpm lint`.
- Backend: `build`, `typecheck`, `lint`.
- Frontend: `build`, `typecheck`, `lint`.

No Jest, Vitest, Testing Library, Cypress, or Playwright config or test files were found in source. Future implementation should add focused tests or document why verification is manual.

## Deployment And Runtime Assumptions

Local runtime is Docker-first:

- Backend: port `3010`.
- Frontend: port `3002`.
- Postgres host port: `55432`.
- Redis host port: `56379`.

`docker-compose.yml` starts:

- `postgres`
- `redis`
- `backend`
- `frontend`

The backend container runs Prisma deploy and seed before starting. The frontend image builds with public env args for app name and backend URL.

