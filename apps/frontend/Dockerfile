# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Copy monorepo workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY libs/client_sdk/package.json libs/client_sdk/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy codebase
COPY apps/frontend apps/frontend
COPY libs/client_sdk libs/client_sdk
COPY openapi.json openapitools.json ./

# Define build args for Next.js build-time configuration
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:3010
ARG NEXT_PUBLIC_APP_NAME="MatchFlow Arena"

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js frontend application
RUN pnpm --filter @matchflow/frontend build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

# Create a system user for running the app securely
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and public folder from builder
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public

# Set up the .next directory with correct permissions for caching/prerendering
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverage Next.js standalone output to keep the image size minimal
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static

USER nextjs

EXPOSE 3002

# The entrypoint for standalone Next.js build
CMD ["node", "apps/frontend/server.js"]
