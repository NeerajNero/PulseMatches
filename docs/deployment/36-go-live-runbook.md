# MatchFlow Arena: Go-Live & Deployment Runbook

This document is the official operational guide for deploying the MatchFlow Arena sports tournament platform to Staging or Production. It includes copy-paste commands, configurations, validation procedures, and rollback scripts.

---

## 1. Deployment Architecture Overview

MatchFlow Arena is a monorepo containing a NestJS API backend, a Next.js frontend, a PostgreSQL database, and a Redis instance. You can deploy it using two main topologies:

1. **Option A: Self-Hosted Container Topology (VPS / Docker Compose)**
   - **Reverse Proxy**: Caddy (handles automatic TLS/SSL termination, routing `/api/*` and `/health` to backend, and `/*` to frontend).
   - **Application Core**: Backend and frontend containers run in an isolated Docker bridge network.
   - **Security**: Databases and caches are kept private within the Docker network and are not exposed directly to the public internet.

2. **Option B: PaaS Container Topology (Render / Fly.io)**
   - **Infrastructure**: Automated via the included `render.yaml` blueprint.
   - **TLS & Edge**: Managed at the Render edge layer (no custom proxy container required).
   - **Linking**: Dynamically connects environment variables (e.g. database credentials, redis host, and frontend/backend URLs).

---

## 2. Production Environment Variables Checklist

Before initiating any deployment, compile a production `.env` file (or populate your platform's secret manager) using these variable mappings. **Do not use local dev values in production.**

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables performance optimizations |
| `FRONTEND_NODE_ENV` | `production` | Next.js build-time context |
| `CORS_ORIGINS` | `https://play.yourdomain.com` | Origin allowed to make API requests (No wildcards) |
| `FE_APP_URL` | `https://play.yourdomain.com` | Base URL of frontend application |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.yourdomain.com` | Build-time API address for frontend client |
| `DATABASE_URL` | `postgresql://user:secure_password@host:5432/matchflow_arena` | Connection string for live PostgreSQL |
| `REDIS_PASSWORD` | `extremely_secure_random_string` | Required password to authenticate with Redis |
| `JWT_ACCESS_TOKEN_SECRET` | `secure_32char_token_secret` | Secret key for signing Access Tokens |
| `JWT_REFRESH_TOKEN_SECRET` | `secure_32char_refresh_secret` | Secret key for signing Refresh Tokens |
| `NOTIFICATION_PROVIDER` | `smtp` (or `noop` / `log` for staging) | Service provider for notifications |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.mailgun.org` / `587` | Details of your transactional email server |
| `SMTP_USER` / `SMTP_PASS` | `smtp_username` / `smtp_password` | Credentials for your email server |
| `PAYMENT_PROVIDER` | `razorpay` (or `manual` for staging) | Payments gateway provider |
| `RAZORPAY_KEY_ID` | `rzp_live_XXXXX` | Razorpay Merchant Key ID |
| `RAZORPAY_KEY_SECRET` | `secure_razorpay_secret` | Razorpay API Secret |
| `RAZORPAY_WEBHOOK_SECRET` | `secure_webhook_secret` | Verification secret for payment webhooks |

---

## 3. Option A: VPS Deployment via Docker Compose & Caddy

### Step 1: Provision & Configure the Host
Connect to your target VPS (Ubuntu 22.04 LTS or similar) and install Docker and Docker Compose:
```bash
# Update local packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to Docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Set Up Directories and Configuration Files
Create the directory structure on the host machine and place the production configs:
```bash
mkdir -p /opt/matchflow
cd /opt/matchflow
```

Copy the following files to `/opt/matchflow`:
- `docker-compose.prod.yml` (save as `docker-compose.yml`)
- `Caddyfile`
- `.env` (Create with values from the environment checklist)

### Step 3: Run Database Migrations (Pre-boot)
Before starting the application services, you must apply the migrations to the database. We use the `backend-migrate` tool service defined under the `tools` profile in our production compose configuration:

```bash
# Compile images and run migrations
docker compose --env-file .env run --rm backend-migrate
```

*Note: This command runs a one-shot container that executes `pnpm prisma migrate deploy` and exits immediately.*

### Step 4: Boot the Core Services
Start the persistent database, cache, backend, frontend, and Caddy proxy in daemon mode:

```bash
docker compose --env-file .env up -d postgres redis backend frontend proxy
```

### Step 5: Check Service Status
Confirm all containers are running and their health checks are reporting healthy:
```bash
docker compose ps
```

To tail the application logs:
```bash
# Backend api logs
docker compose logs -f backend

# Frontend ui logs
docker compose logs -f frontend

# Caddy proxy logs
docker compose logs -f proxy
```

---

## 4. Option B: Cloud PaaS Deployment (Render)

Render uses the declarative blueprint defined in [render.yaml](file:///Users/neerajkumarsharmau/Desktop/projects/pulsematches/render.yaml).

### Step 1: Connect your Git Repository
1. Log in to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your MatchFlow Arena repository.

### Step 2: Configure Blueprint Deployments
1. Name your blueprint group (e.g., `matchflow-prod`).
2. Render will parse `render.yaml` and discover:
   - `matchflow-postgres` (PostgreSQL Database)
   - `matchflow-redis` (Redis cache)
   - `matchflow-backend` (NestJS Docker Web Service)
   - `matchflow-frontend` (Next.js Docker Web Service)
3. Under the Blueprint environment variables UI, fill in the values for the following:
   - `CADDY_LETSENCRYPT_EMAIL`
   - `SMTP_USER` / `SMTP_PASS` / `SMTP_HOST` / `SMTP_PORT`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`
   - `CORS_ORIGINS` / `FE_APP_URL` (If you have a custom domain. Otherwise, Render will link them automatically)
4. Click **Apply**. Render will spin up the database and cache first, then build and deploy the backend and frontend.

### Step 3: Post-Deploy Database Migration
To run migrations against the Render database:
1. Open the **matchflow-backend** Web Service in the dashboard.
2. Select **Shell** from the sidebar.
3. Run the migrations deploy script:
   ```bash
   npx prisma migrate deploy
   ```

---

## 5. Runtime Operations & Background Jobs

MatchFlow Arena depends on periodic backend tasks to process outgoing notifications (SMTP outbox) and reconcile payments.

### Processing Notifications (Cron/Systemd)
To process the outbox queue, execute the following command every 1–5 minutes:

**Using Docker Compose:**
```bash
docker compose --env-file .env run --rm backend pnpm notifications:process
```

**Using a standard cron job on the host machine:**
```text
*/2 * * * * cd /opt/matchflow && docker compose run --rm backend pnpm notifications:process >> /var/log/matchflow-notifications.log 2>&1
```

### Reconciling Payments (Daily Cron)
To reconcile pending Razorpay transactions, trigger this command once a day:

**Using Docker Compose:**
```bash
docker compose --env-file .env run --rm backend pnpm payments:reconcile
```

---

## 6. Go-Live Verification Procedures

Once deployed, run these verification steps from the operator terminal to guarantee full system readiness.

### 1. Verify API Health and Database Connections
Verify that the backend is responding and has successfully connected to the PostgreSQL database and Redis:
```bash
# Query general health endpoint
curl -fsS https://api.yourdomain.com/health

# Query ready endpoint (ensures db and cache checks pass)
curl -fsS https://api.yourdomain.com/health/ready
```
*Expected Response (status code `200 OK`):*
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    },
    "redis": {
      "status": "up"
    }
  }
}
```

### 2. Verify Frontend Delivery
Verify that the Next.js frontend is served and has headers configured for caching and security:
```bash
curl -I https://play.yourdomain.com/
```
*Expected response headers include:*
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

### 3. Execute Remote Smoke Tests
Run the automated MVP validation suite against the newly deployed environment. **Ensure the API target environment is loaded with test-safe mock seeding before running this on a production database.**
```bash
API_URL=https://api.yourdomain.com pnpm smoke:mvp
```

---

## 7. Rollback Procedures

If a critical failure is detected during the go-live verification phase, execute these steps immediately to restore service.

### VPS Docker Compose Rollback
If you need to roll back to the previously deployed images:

```bash
# 1. Update the tag/hash in your .env or docker-compose.prod.yml file
# 2. Re-pull/re-build target tags
docker compose pull backend frontend

# 3. Gracefully replace running containers
docker compose --env-file .env up -d --no-deps backend frontend

# 4. Check for stable boot
docker compose ps
```

### Database Rollback Strategy
- Prisma migrations are **forward-only**.
- If a migration fails halfway, check database logs to identify the lock or issue.
- If a deployment failure occurs **after** migrations are successfully run, keep the database schema forward-compatible (new columns nullable/optional) so you can safely rollback the backend code image without rolling back the database.
- If you must roll back a migration due to a destructive change:
  1. Restore the pre-deploy database snapshot.
  2. Deploy the previous code base image.
