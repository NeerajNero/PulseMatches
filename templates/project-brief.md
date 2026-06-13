# Project Brief

## Product

- Name:
- One-sentence purpose:
- Primary users:
- Admin users:

## Scope

- First vertical slice:
- Must-have features:
- Explicit non-goals:

## Feature Workflow

- Default flow policy: classify first when scope is unclear
- User-story file:
- Feature index:
- Classification directory:
- Plan directory:
- Approval directory:
- Implementation report directory:
- Block directory:
- Final directory:
- Current feature pointer:
- Context directory:
- Tiny change lane allowed: yes/no
- Context update required after finalize: yes for normal/risky
- Required approval before implementation: yes for normal/risky

## Project Shape

- Backend required: yes/no
- Frontend required: yes/no
- Frontend target: web/mobile/both/none
- If web: Next.js app required: yes/no
- If mobile: Expo app required: yes/no
- If mobile: target platforms: iOS/Android/web preview/all
- If mobile: app targets/store listings:
- If both web and mobile: shared package strategy:

## Stack

- Package manager:
- Monorepo tool:
- Backend:
- Web frontend:
- Mobile frontend:
- Database:
- Cache/queue:
- Docs:
- Deployment target:

## Domain Model

List initial entities:

| Entity | Purpose | Important Fields | Relationships |
| --- | --- | --- | --- |
|  |  |  |  |

## Auth And Roles

| Role | Permissions |
| --- | --- |
|  |  |

## Local Services

| Service | Port | Notes |
| --- | --- | --- |
| Backend | 3000 |  |
| Frontend | 3002 |  |
| Postgres | 5432 |  |
| Redis | 6379 |  |

## External Services

| Service | Environment Variables | Local Stub |
| --- | --- | --- |
|  |  |  |

## Mobile Capabilities

Fill this only when frontend target includes mobile.

| Capability | Required | Notes |
| --- | --- | --- |
| Push notifications |  |  |
| Camera/gallery |  |  |
| File upload/download |  |  |
| QR scanning |  |  |
| Chat/calls |  |  |
| Subscriptions/payments |  |  |
| Deep links |  |  |
| Offline support |  |  |
| OTA updates |  |  |
| Crash/performance monitoring |  |  |

## Verification Target

The first project pass is done when:

- Docker services run.
- First migration applies when backend exists.
- Backend health and Swagger work when backend exists.
- SDK generates when backend and frontend both exist.
- Web frontend can call one backend endpoint through SDK when web exists.
- Mobile frontend starts in dev client or simulator and can call one backend endpoint through SDK when mobile exists.
