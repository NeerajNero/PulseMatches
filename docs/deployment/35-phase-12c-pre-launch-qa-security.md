# Phase 12C: Pre-Launch QA, Security Hardening & Performance Profiling

This document serves as the official pre-launch checklist and security review audit for **MatchFlow Arena** prior to production deployment.

---

## 1. Security Header Audit Status

We have implemented strict, safe security headers across both the frontend (Next.js) and backend (NestJS/Express) applications.

### A. Frontend (Next.js `next.config.mjs`)
The following headers are injected globally for all incoming paths:
- **`X-DNS-Prefetch-Control: on`**: Instructs browsers to proactively perform DNS resolution on cross-origin links to speed up initial asset loading.
- **`X-Content-Type-Options: nosniff`**: Prevents MIME-sniffing, protecting against malicious uploads disguised as standard styles/images.
- **`X-Frame-Options: SAMEORIGIN`**: Protects against clickjacking. Prevents embedding the MatchFlow application inside an `<iframe>` on any third-party domain.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Ensures referrer headers only include origin details (omitting query parameters or sensitive sub-paths) when traversing secure cross-origins.
- **`Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`**: Explicitly restricts access to device features that are unnecessary for MatchFlow operation, maximizing user privacy.

### B. Backend (NestJS helmet & CORS)
- **`helmet`**: Enabled globally in `main.ts` using Express middleware to enforce secure defaults (e.g. strict CSP, XSS protection, transport-security HSTS).
- **CORS Policies**: Explicitly configured to lock down API access to origin domains defined in `CORS_ORIGINS`. Falls back to local/secure client contexts only.
- **`disable("x-powered-by")`**: Prevents backend framework fingerprinting.

---

## 2. Rate Limiting Configuration & Limits

To prevent brute force attacks, scraping, and application layer DDoS attacks, we have configured a dual-layer rate limiter.

### A. Global Rate Limiting (`@nestjs/throttler` Guard)
- **Global Threshold**: Enforced globally via `ThrottlerGuard` in `AppModule`.
- **Default Limit**: **100 requests per 60 seconds** (1 minute window) per client IP address.

### B. Sensitive Route Overrides (`@Throttle` Overrides)
Stricter limits are applied directly to sensitive endpoints:
1. **User Registration** (`POST /auth/signup`): **10 requests per minute**.
2. **User Authentication** (`POST /auth/login`): **10 requests per minute**.
3. **Razorpay Webhooks** (`POST /payments/webhooks/:provider`): **10 requests per minute**.

---

## 3. Auth & Session Timeout Audit

We employ a secure JWT token rotation scheme to manage user session life cycles.

### A. Token Expiration Policies
- **Access Token**: Expires in **15 minutes** (`ACCESS_TOKEN_EXPIRES_IN_SECONDS = 900`). Used for authenticating api requests using the `Bearer` token scheme.
- **Refresh Token**: Expires in **7 days** (`REFRESH_TOKEN_EXPIRES_IN_DAYS = 7`). Persisted securely to verify user sessions.

### B. Security & Refresh Flow
1. Upon successful login or signup, the backend returns both an access token and a refresh token.
2. The frontend stores tokens in local client storage.
3. Access tokens are attached to the `Authorization: Bearer <token>` header for all authenticated routes.
4. When the access token expires (indicated by a `401 Unauthorized` response), the client triggers the `POST /auth/refresh` request, supplying the refresh token.
5. The backend validates the refresh token against active DB sessions. If valid, it revokes the old refresh token and returns a new rotating pair of access/refresh tokens.

---

## 4. PWA Cross-Browser QA Steps

The application includes PWA installability. Verify prompt flows across mobile platforms:

### A. Chrome / Android QA Steps
1. Navigate to the MatchFlow Arena staging URL in Chrome.
2. Verify the custom PWA "Add to Home Screen" banner triggers at the bottom of the viewport.
3. Tap **Install**.
4. Confirm the app icon appears on the device drawer and opens as a borderless, standalone window (no browser address bar).
5. Open Chrome developer console, toggle Network to **Offline**, and refresh. The cached shell assets must render the landing layout along with the **Offline awareness banner**.

### B. Safari / iOS QA Steps
1. Open the MatchFlow Arena staging URL in iOS Safari.
2. Tap the browser **Share** button.
3. Scroll and select **Add to Home Screen**.
4. Set the app title (defaults to "MatchFlow") and tap **Add**.
5. Confirm the splash page matches the theme color (`#10231d`) and operates in standalone fullscreen mode.

---

## 5. Lighthouse Performance Targets

Aim for these performance targets to ensure a premium user experience:
- **Performance**: **> 90** on Mobile (ensured by aspect-ratio preserved layouts preventing CLS, and system font rendering).
- **Accessibility**: **> 95** (using semantic tags, aria roles, and high color-contrast ratio variables).
- **Best Practices**: **100** (enforced by the strict security headers and HTTPS support).
- **SEO**: **100** (enforced by our metadata, canonical setups, and descriptive layout tags).
