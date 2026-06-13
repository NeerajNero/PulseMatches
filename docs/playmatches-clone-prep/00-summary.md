# Playmatches Clone Prep Summary

Inspection date: 2026-06-08

## What This Repo Is

This repository is a pnpm workspace for MatchFlow Arena, an original sports tournament discovery and management platform. It already has a working full-stack foundation:

- NestJS API in `apps/backend`
- Next.js App Router web app in `apps/frontend`
- Prisma/PostgreSQL schema and migrations
- Redis service in Docker for future queues/cache
- Generated `typescript-fetch` SDK in `libs/client_sdk`
- Docker-first local runtime through `docker-compose.yml`

The product direction already matches a Playmatches-like sports tournament platform, but the repo must keep MatchFlow Arena original. Playmatches should be treated only as public product/UX inspiration. Do not copy its name, branding, logo, images, screenshots, copy, layout, tournament data, or proprietary assets.

## Current Stack

| Area | Detected stack |
| --- | --- |
| Package manager | pnpm 9.15.4 |
| Monorepo | pnpm workspaces: `apps/*`, `libs/*` |
| Backend | NestJS 10, TypeScript |
| Frontend | Next.js 14 App Router, React 18 |
| API contract | Nest Swagger/OpenAPI, generated `typescript-fetch` SDK |
| Database | PostgreSQL 16, Prisma 5 |
| Auth | Email/password, bcryptjs, JWT access tokens, hashed refresh tokens |
| State | React Query for server state |
| Styling | Global CSS in `apps/frontend/styles/globals.css` |
| Forms | Plain React forms with `FormData`; backend validation with `class-validator` |
| Runtime | Docker compose for Postgres, Redis, backend, frontend |
| Testing | No dedicated test framework found; scripts provide lint, typecheck, build |

## Clone-Readiness Verdict

The repo is ready for staged implementation, not for a rewrite. It already has the key foundations for a Playmatches-inspired tournament platform:

- Public tournament discovery data model and API.
- Public tournament list/detail routes.
- Player and organizer auth foundation.
- Organizer profile API and shell route.
- Contract-first API/SDK flow.
- Dockerized local runtime and seed data.

The next implementation should build on these pieces in vertical slices.

## Biggest Risks

- Organizer tournament CRUD is planned but not implemented.
- Registration, booking, payments, teams, fixtures, scoring, notifications, and admin moderation are missing.
- Auth is stored in browser `localStorage`; this is acceptable for the current foundation but needs security review before production.
- There is no automated test suite beyond lint/typecheck/build scripts.
- No email/payment/upload provider exists yet.
- Fixture and scoring logic can become sport-specific quickly; start with generic knockout and round-robin models.

## Recommended First Implementation Phase

Start with Phase 0 cleanup and Phase 1 public discovery polish:

1. Confirm generated artifacts policy for checked-in `apps/backend/dist` and `apps/frontend/.next`.
2. Add missing static pages and better public navigation.
3. Improve tournament list/detail UX using the existing discovery API.
4. Keep organizer CRUD, registrations, fixtures, and scoring behind later approved slices.

