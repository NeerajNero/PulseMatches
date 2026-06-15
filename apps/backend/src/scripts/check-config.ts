import { validateEnv } from "../config/env.validation";

function main() {
  const config = validateEnv(process.env);
  const corsOriginCount = config.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean).length;

  console.log(JSON.stringify({
    status: "config_ok",
    node_env: config.NODE_ENV,
    service_name: config.SERVICE_NAME,
    app_version: config.APP_VERSION,
    cors_origin_count: corsOriginCount,
    notification_provider: config.NOTIFICATION_PROVIDER,
    payment_provider: config.PAYMENT_PROVIDER,
    payment_reconciliation_provider: config.PAYMENT_RECONCILIATION_PROVIDER,
    export_max_rows: config.EXPORT_MAX_ROWS,
    operations_thresholds: {
      stale_notification_minutes: config.OPS_STALE_NOTIFICATION_MINUTES,
      stale_payment_intent_minutes: config.OPS_STALE_PAYMENT_INTENT_MINUTES,
      failed_notification_alert_threshold: config.OPS_FAILED_NOTIFICATION_ALERT_THRESHOLD,
      failed_payment_alert_threshold: config.OPS_FAILED_PAYMENT_ALERT_THRESHOLD
    },
    rate_limits: {
      ttl_seconds: config.RATE_LIMIT_TTL_SECONDS,
      default_max_requests: config.RATE_LIMIT_MAX_REQUESTS,
      auth_max_requests: config.AUTH_RATE_LIMIT_MAX_REQUESTS,
      payment_max_requests: config.PAYMENT_RATE_LIMIT_MAX_REQUESTS,
      export_max_requests: config.EXPORT_RATE_LIMIT_MAX_REQUESTS
    }
  }));
}

try {
  main();
} catch (error) {
  console.error(JSON.stringify({
    status: "config_invalid",
    error: error instanceof Error ? error.message : "Invalid runtime configuration"
  }));
  process.exit(1);
}
