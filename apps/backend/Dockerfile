# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
RUN apk add --no-cache openssl

# Copy monorepo workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY libs/client_sdk/package.json libs/client_sdk/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy codebase
COPY apps/backend apps/backend
COPY libs/client_sdk libs/client_sdk
COPY openapi.json openapitools.json ./

# Generate Prisma Client explicitly
RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Build the NestJS application
RUN pnpm --filter @matchflow/backend build

# Prune dev dependencies for production size optimization
RUN pnpm install --prod --frozen-lockfile

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Copy built node_modules, build outputs, and config files
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/apps/backend/package.json /app/apps/backend/package.json
COPY --from=builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=builder /app/apps/backend/prisma /app/apps/backend/prisma

EXPOSE 3010

# Command to start the NestJS backend
CMD ["node", "apps/backend/dist/main.js"]
