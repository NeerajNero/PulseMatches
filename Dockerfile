FROM node:22-alpine AS base

WORKDIR /app

ENV CI=true

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

RUN apk add --no-cache openssl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY libs/client_sdk/package.json libs/client_sdk/package.json

RUN pnpm install --frozen-lockfile

COPY apps apps
COPY libs libs
COPY scripts scripts
COPY openapi.json openapitools.json ./

RUN pnpm --filter @matchflow/backend prisma:generate

FROM base AS backend

RUN pnpm --filter @matchflow/backend build

EXPOSE 3010

CMD ["pnpm", "--filter", "@matchflow/backend", "start"]

FROM base AS frontend

ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:3010
ARG NEXT_PUBLIC_APP_NAME="MatchFlow Arena"

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

RUN pnpm --filter @matchflow/frontend build

EXPOSE 3002

CMD ["pnpm", "--filter", "@matchflow/frontend", "start"]
