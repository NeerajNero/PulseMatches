type Environment = Record<string, string | undefined>;

export interface AppEnvironment {
  SERVICE_NAME: string;
  PORT: number;
  NODE_ENV: "development" | "test" | "production";
  APP_VERSION: string;
  CORS_ORIGINS: string;
  DATABASE_URL: string;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_TLS_ENABLED: boolean;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRY: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRY: string;
  FE_APP_URL: string;
  NOTIFICATION_PROVIDER: "noop" | "log" | "smtp";
  NOTIFICATION_FROM_EMAIL: string;
  NOTIFICATION_FROM_NAME: string;
  NOTIFICATION_PROCESS_LIMIT: number;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SECURE: boolean;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_REQUIRE_TLS: boolean;
  SMTP_REJECT_UNAUTHORIZED: boolean;
  SMTP_ALLOW_UNAUTH: boolean;
  PAYMENT_PROVIDER: "manual" | "mock" | "razorpay";
  PAYMENT_DEFAULT_CURRENCY: string;
  PAYMENT_MOCK_CHECKOUT_BASE_URL: string;
  PAYMENT_INTENT_EXPIRY_MINUTES: number;
  PAYMENT_WEBHOOK_SECRET: string;
  PAYMENT_RECONCILIATION_PROVIDER: "manual" | "mock" | "razorpay";
  PAYMENT_RECONCILIATION_LIMIT: number;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  RAZORPAY_CHECKOUT_NAME: string;
  RAZORPAY_CHECKOUT_DESCRIPTION: string;
  EXPORT_MAX_ROWS: number;
  OPS_STALE_NOTIFICATION_MINUTES: number;
  OPS_STALE_PAYMENT_INTENT_MINUTES: number;
  OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD: number;
  OPS_FAILED_PAYMENT_ALERT_THRESHOLD: number;
  RATE_LIMIT_TTL_SECONDS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  AUTH_RATE_LIMIT_MAX_REQUESTS: number;
  PAYMENT_RATE_LIMIT_MAX_REQUESTS: number;
  EXPORT_RATE_LIMIT_MAX_REQUESTS: number;
}

const defaults: AppEnvironment = {
  SERVICE_NAME: "matchflow-arena-api",
  PORT: 3010,
  NODE_ENV: "development",
  APP_VERSION: "0.1.0",
  CORS_ORIGINS: "http://localhost:3002",
  DATABASE_URL: "postgresql://matchflow:matchflow_dev_password@localhost:55432/matchflow_arena",
  POSTGRES_DB: "matchflow_arena",
  POSTGRES_USER: "matchflow",
  POSTGRES_PASSWORD: "matchflow_dev_password",
  POSTGRES_HOST: "localhost",
  POSTGRES_PORT: 55432,
  REDIS_HOST: "localhost",
  REDIS_PORT: 56379,
  REDIS_PASSWORD: "",
  REDIS_TLS_ENABLED: false,
  JWT_ACCESS_TOKEN_SECRET: "replace_with_local_dev_secret",
  JWT_ACCESS_TOKEN_EXPIRY: "15m",
  JWT_REFRESH_TOKEN_SECRET: "replace_with_local_refresh_secret",
  JWT_REFRESH_TOKEN_EXPIRY: "7d",
  FE_APP_URL: "http://localhost:3002",
  NOTIFICATION_PROVIDER: "noop",
  NOTIFICATION_FROM_EMAIL: "notifications@matchflow.local",
  NOTIFICATION_FROM_NAME: "MatchFlow Arena",
  NOTIFICATION_PROCESS_LIMIT: 20,
  SMTP_HOST: "",
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  SMTP_USER: "",
  SMTP_PASS: "",
  SMTP_REQUIRE_TLS: false,
  SMTP_REJECT_UNAUTHORIZED: true,
  SMTP_ALLOW_UNAUTH: false,
  PAYMENT_PROVIDER: "manual",
  PAYMENT_DEFAULT_CURRENCY: "INR",
  PAYMENT_MOCK_CHECKOUT_BASE_URL: "",
  PAYMENT_INTENT_EXPIRY_MINUTES: 30,
  PAYMENT_WEBHOOK_SECRET: "",
  PAYMENT_RECONCILIATION_PROVIDER: "manual",
  PAYMENT_RECONCILIATION_LIMIT: 25,
  RAZORPAY_KEY_ID: "",
  RAZORPAY_KEY_SECRET: "",
  RAZORPAY_WEBHOOK_SECRET: "",
  RAZORPAY_CHECKOUT_NAME: "MatchFlow Arena",
  RAZORPAY_CHECKOUT_DESCRIPTION: "Tournament registration fee",
  EXPORT_MAX_ROWS: 5000,
  OPS_STALE_NOTIFICATION_MINUTES: 30,
  OPS_STALE_PAYMENT_INTENT_MINUTES: 60,
  OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD: 10,
  OPS_FAILED_PAYMENT_ALERT_THRESHOLD: 5,
  RATE_LIMIT_TTL_SECONDS: 60,
  RATE_LIMIT_MAX_REQUESTS: 120,
  AUTH_RATE_LIMIT_MAX_REQUESTS: 20,
  PAYMENT_RATE_LIMIT_MAX_REQUESTS: 30,
  EXPORT_RATE_LIMIT_MAX_REQUESTS: 20
};

function parsePort(value: string | undefined, fallback: number, name: string): number {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") {
    return fallback;
  }
  return value === "true";
}

function parseNodeEnv(value: string | undefined): AppEnvironment["NODE_ENV"] {
  const env = value ?? defaults.NODE_ENV;
  if (env !== "development" && env !== "test" && env !== "production") {
    throw new Error("NODE_ENV must be development, test, or production");
  }
  return env;
}

function parseNotificationProvider(value: string | undefined): AppEnvironment["NOTIFICATION_PROVIDER"] {
  const provider = (value ?? defaults.NOTIFICATION_PROVIDER).toLowerCase();
  if (provider !== "noop" && provider !== "log" && provider !== "smtp") {
    throw new Error("NOTIFICATION_PROVIDER must be noop, log, or smtp");
  }
  return provider;
}

function parsePaymentProvider(value: string | undefined): AppEnvironment["PAYMENT_PROVIDER"] {
  const provider = (value ?? defaults.PAYMENT_PROVIDER).toLowerCase();
  if (provider !== "manual" && provider !== "mock" && provider !== "razorpay") {
    throw new Error("PAYMENT_PROVIDER must be manual, mock, or razorpay");
  }
  return provider;
}

function requireValue(value: string, name: string): string {
  if (!value.trim()) {
    throw new Error(`${name} is required when NOTIFICATION_PROVIDER=smtp`);
  }
  return value;
}

function isWeakSecret(value: string, defaultValue: string): boolean {
  const trimmed = value.trim();
  return !trimmed
    || trimmed === defaultValue
    || trimmed.toLowerCase().includes("replace")
    || trimmed.length < 32;
}

function isPlaceholderValue(value: string, defaultValue: string): boolean {
  const trimmed = value.trim();
  return !trimmed
    || trimmed === defaultValue
    || trimmed.toLowerCase().includes("replace_")
    || trimmed.toLowerCase().includes("placeholder");
}

function isLocalDevDatabaseUrl(value: string): boolean {
  return value.includes("matchflow_dev_password")
    || value.includes("@localhost:55432/")
    || value.includes("@127.0.0.1:55432/");
}

function isWildcardOrigin(value: string): boolean {
  return value.split(",").map((origin) => origin.trim()).some((origin) => origin === "*" || origin === "");
}

function isLocalhostUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname);
  } catch {
    return true;
  }
}

function validateProductionConfig(config: AppEnvironment): void {
  if (config.NODE_ENV !== "production") {
    return;
  }

  const errors: string[] = [];

  if (isPlaceholderValue(config.DATABASE_URL, defaults.DATABASE_URL) || isLocalDevDatabaseUrl(config.DATABASE_URL)) {
    errors.push("DATABASE_URL must be set to a non-placeholder production database URL");
  }
  if (isWeakSecret(config.JWT_ACCESS_TOKEN_SECRET, defaults.JWT_ACCESS_TOKEN_SECRET)) {
    errors.push("JWT_ACCESS_TOKEN_SECRET must be set to a strong production value of at least 32 characters");
  }
  if (isWeakSecret(config.JWT_REFRESH_TOKEN_SECRET, defaults.JWT_REFRESH_TOKEN_SECRET)) {
    errors.push("JWT_REFRESH_TOKEN_SECRET must be set to a strong production value of at least 32 characters");
  }
  if (isWildcardOrigin(config.CORS_ORIGINS) || config.CORS_ORIGINS === defaults.CORS_ORIGINS) {
    errors.push("CORS_ORIGINS must list explicit production origins and must not use wildcard/default origins");
  }
  if (isPlaceholderValue(config.FE_APP_URL, defaults.FE_APP_URL) || isLocalhostUrl(config.FE_APP_URL)) {
    errors.push("FE_APP_URL must be set to the production frontend URL");
  }
  if (!config.SERVICE_NAME.trim()) {
    errors.push("SERVICE_NAME is required in production");
  }
  if (!config.APP_VERSION.trim()) {
    errors.push("APP_VERSION is required in production");
  }
  if (config.NOTIFICATION_PROVIDER === "smtp" && config.SMTP_HOST === defaults.SMTP_HOST) {
    errors.push("SMTP_HOST must be configured when NOTIFICATION_PROVIDER=smtp");
  }
  if (config.PAYMENT_PROVIDER === "razorpay") {
    if (isPlaceholderValue(config.RAZORPAY_KEY_ID, defaults.RAZORPAY_KEY_ID)) {
      errors.push("RAZORPAY_KEY_ID must be configured when PAYMENT_PROVIDER=razorpay");
    }
    if (isPlaceholderValue(config.RAZORPAY_KEY_SECRET, defaults.RAZORPAY_KEY_SECRET)) {
      errors.push("RAZORPAY_KEY_SECRET must be configured when PAYMENT_PROVIDER=razorpay");
    }
    if (isPlaceholderValue(config.RAZORPAY_WEBHOOK_SECRET, defaults.RAZORPAY_WEBHOOK_SECRET)) {
      errors.push("RAZORPAY_WEBHOOK_SECRET must be configured when PAYMENT_PROVIDER=razorpay");
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}

export function validateEnv(env: Environment): AppEnvironment {
  const config: AppEnvironment = {
    SERVICE_NAME: env.SERVICE_NAME ?? defaults.SERVICE_NAME,
    PORT: parsePort(env.PORT, defaults.PORT, "PORT"),
    NODE_ENV: parseNodeEnv(env.NODE_ENV),
    APP_VERSION: env.APP_VERSION ?? defaults.APP_VERSION,
    CORS_ORIGINS: env.CORS_ORIGINS ?? defaults.CORS_ORIGINS,
    DATABASE_URL: env.DATABASE_URL ?? defaults.DATABASE_URL,
    POSTGRES_DB: env.POSTGRES_DB ?? defaults.POSTGRES_DB,
    POSTGRES_USER: env.POSTGRES_USER ?? defaults.POSTGRES_USER,
    POSTGRES_PASSWORD: env.POSTGRES_PASSWORD ?? defaults.POSTGRES_PASSWORD,
    POSTGRES_HOST: env.POSTGRES_HOST ?? defaults.POSTGRES_HOST,
    POSTGRES_PORT: parsePort(env.POSTGRES_PORT, defaults.POSTGRES_PORT, "POSTGRES_PORT"),
    REDIS_HOST: env.REDIS_HOST ?? defaults.REDIS_HOST,
    REDIS_PORT: parsePort(env.REDIS_PORT, defaults.REDIS_PORT, "REDIS_PORT"),
    REDIS_PASSWORD: env.REDIS_PASSWORD ?? defaults.REDIS_PASSWORD,
    REDIS_TLS_ENABLED: parseBoolean(env.REDIS_TLS_ENABLED, defaults.REDIS_TLS_ENABLED),
    JWT_ACCESS_TOKEN_SECRET: env.JWT_ACCESS_TOKEN_SECRET ?? defaults.JWT_ACCESS_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXPIRY: env.JWT_ACCESS_TOKEN_EXPIRY ?? defaults.JWT_ACCESS_TOKEN_EXPIRY,
    JWT_REFRESH_TOKEN_SECRET: env.JWT_REFRESH_TOKEN_SECRET ?? defaults.JWT_REFRESH_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_EXPIRY: env.JWT_REFRESH_TOKEN_EXPIRY ?? defaults.JWT_REFRESH_TOKEN_EXPIRY,
    FE_APP_URL: env.FE_APP_URL ?? defaults.FE_APP_URL,
    NOTIFICATION_PROVIDER: parseNotificationProvider(env.NOTIFICATION_PROVIDER),
    NOTIFICATION_FROM_EMAIL: env.NOTIFICATION_FROM_EMAIL ?? defaults.NOTIFICATION_FROM_EMAIL,
    NOTIFICATION_FROM_NAME: env.NOTIFICATION_FROM_NAME ?? defaults.NOTIFICATION_FROM_NAME,
    NOTIFICATION_PROCESS_LIMIT: parsePort(
      env.NOTIFICATION_PROCESS_LIMIT,
      defaults.NOTIFICATION_PROCESS_LIMIT,
      "NOTIFICATION_PROCESS_LIMIT"
    ),
    SMTP_HOST: env.SMTP_HOST ?? defaults.SMTP_HOST,
    SMTP_PORT: parsePort(env.SMTP_PORT, defaults.SMTP_PORT, "SMTP_PORT"),
    SMTP_SECURE: parseBoolean(env.SMTP_SECURE, defaults.SMTP_SECURE),
    SMTP_USER: env.SMTP_USER ?? defaults.SMTP_USER,
    SMTP_PASS: env.SMTP_PASS ?? defaults.SMTP_PASS,
    SMTP_REQUIRE_TLS: parseBoolean(env.SMTP_REQUIRE_TLS, defaults.SMTP_REQUIRE_TLS),
    SMTP_REJECT_UNAUTHORIZED: parseBoolean(env.SMTP_REJECT_UNAUTHORIZED, defaults.SMTP_REJECT_UNAUTHORIZED),
    SMTP_ALLOW_UNAUTH: parseBoolean(env.SMTP_ALLOW_UNAUTH, defaults.SMTP_ALLOW_UNAUTH),
    PAYMENT_PROVIDER: parsePaymentProvider(env.PAYMENT_PROVIDER),
    PAYMENT_DEFAULT_CURRENCY: env.PAYMENT_DEFAULT_CURRENCY ?? defaults.PAYMENT_DEFAULT_CURRENCY,
    PAYMENT_MOCK_CHECKOUT_BASE_URL: env.PAYMENT_MOCK_CHECKOUT_BASE_URL ?? defaults.PAYMENT_MOCK_CHECKOUT_BASE_URL,
    PAYMENT_INTENT_EXPIRY_MINUTES: parsePort(
      env.PAYMENT_INTENT_EXPIRY_MINUTES,
      defaults.PAYMENT_INTENT_EXPIRY_MINUTES,
      "PAYMENT_INTENT_EXPIRY_MINUTES"
    ),
    PAYMENT_WEBHOOK_SECRET: env.PAYMENT_WEBHOOK_SECRET ?? defaults.PAYMENT_WEBHOOK_SECRET,
    PAYMENT_RECONCILIATION_PROVIDER: parsePaymentProvider(env.PAYMENT_RECONCILIATION_PROVIDER || env.PAYMENT_PROVIDER),
    PAYMENT_RECONCILIATION_LIMIT: parsePort(
      env.PAYMENT_RECONCILIATION_LIMIT,
      defaults.PAYMENT_RECONCILIATION_LIMIT,
      "PAYMENT_RECONCILIATION_LIMIT"
    ),
    RAZORPAY_KEY_ID: env.RAZORPAY_KEY_ID ?? defaults.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: env.RAZORPAY_KEY_SECRET ?? defaults.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: env.RAZORPAY_WEBHOOK_SECRET ?? defaults.RAZORPAY_WEBHOOK_SECRET,
    RAZORPAY_CHECKOUT_NAME: env.RAZORPAY_CHECKOUT_NAME ?? defaults.RAZORPAY_CHECKOUT_NAME,
    RAZORPAY_CHECKOUT_DESCRIPTION: env.RAZORPAY_CHECKOUT_DESCRIPTION ?? defaults.RAZORPAY_CHECKOUT_DESCRIPTION,
    EXPORT_MAX_ROWS: parsePort(env.EXPORT_MAX_ROWS, defaults.EXPORT_MAX_ROWS, "EXPORT_MAX_ROWS"),
    OPS_STALE_NOTIFICATION_MINUTES: parsePort(
      env.OPS_STALE_NOTIFICATION_MINUTES,
      defaults.OPS_STALE_NOTIFICATION_MINUTES,
      "OPS_STALE_NOTIFICATION_MINUTES"
    ),
    OPS_STALE_PAYMENT_INTENT_MINUTES: parsePort(
      env.OPS_STALE_PAYMENT_INTENT_MINUTES,
      defaults.OPS_STALE_PAYMENT_INTENT_MINUTES,
      "OPS_STALE_PAYMENT_INTENT_MINUTES"
    ),
    OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD: parsePort(
      env.OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD,
      defaults.OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD,
      "OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD"
    ),
    OPS_FAILED_PAYMENT_ALERT_THRESHOLD: parsePort(
      env.OPS_FAILED_PAYMENT_ALERT_THRESHOLD,
      defaults.OPS_FAILED_PAYMENT_ALERT_THRESHOLD,
      "OPS_FAILED_PAYMENT_ALERT_THRESHOLD"
    ),
    RATE_LIMIT_TTL_SECONDS: parsePort(env.RATE_LIMIT_TTL_SECONDS, defaults.RATE_LIMIT_TTL_SECONDS, "RATE_LIMIT_TTL_SECONDS"),
    RATE_LIMIT_MAX_REQUESTS: parsePort(env.RATE_LIMIT_MAX_REQUESTS, defaults.RATE_LIMIT_MAX_REQUESTS, "RATE_LIMIT_MAX_REQUESTS"),
    AUTH_RATE_LIMIT_MAX_REQUESTS: parsePort(
      env.AUTH_RATE_LIMIT_MAX_REQUESTS,
      defaults.AUTH_RATE_LIMIT_MAX_REQUESTS,
      "AUTH_RATE_LIMIT_MAX_REQUESTS"
    ),
    PAYMENT_RATE_LIMIT_MAX_REQUESTS: parsePort(
      env.PAYMENT_RATE_LIMIT_MAX_REQUESTS,
      defaults.PAYMENT_RATE_LIMIT_MAX_REQUESTS,
      "PAYMENT_RATE_LIMIT_MAX_REQUESTS"
    ),
    EXPORT_RATE_LIMIT_MAX_REQUESTS: parsePort(
      env.EXPORT_RATE_LIMIT_MAX_REQUESTS,
      defaults.EXPORT_RATE_LIMIT_MAX_REQUESTS,
      "EXPORT_RATE_LIMIT_MAX_REQUESTS"
    )
  };

  if (config.NOTIFICATION_PROVIDER === "smtp") {
    config.SMTP_HOST = requireValue(config.SMTP_HOST, "SMTP_HOST");
    config.NOTIFICATION_FROM_EMAIL = requireValue(config.NOTIFICATION_FROM_EMAIL, "NOTIFICATION_FROM_EMAIL");

    if (!config.SMTP_ALLOW_UNAUTH) {
      config.SMTP_USER = requireValue(config.SMTP_USER, "SMTP_USER");
      config.SMTP_PASS = requireValue(config.SMTP_PASS, "SMTP_PASS");
    }
  }

  if (config.PAYMENT_PROVIDER === "razorpay") {
    config.RAZORPAY_KEY_ID = requirePaymentValue(config.RAZORPAY_KEY_ID, "RAZORPAY_KEY_ID");
    config.RAZORPAY_KEY_SECRET = requirePaymentValue(config.RAZORPAY_KEY_SECRET, "RAZORPAY_KEY_SECRET");
    config.RAZORPAY_WEBHOOK_SECRET = requirePaymentValue(config.RAZORPAY_WEBHOOK_SECRET, "RAZORPAY_WEBHOOK_SECRET");
  }

  validateProductionConfig(config);

  return config;
}

function requirePaymentValue(value: string, name: string): string {
  if (!value.trim()) {
    throw new Error(`${name} is required when PAYMENT_PROVIDER=razorpay`);
  }
  return value;
}
