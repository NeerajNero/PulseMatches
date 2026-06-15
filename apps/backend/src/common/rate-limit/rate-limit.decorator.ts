import { SetMetadata } from "@nestjs/common";

export const RATE_LIMIT_KEY = "rate_limit";

export type RateLimitBucket = "auth" | "payment" | "export" | "admin_action";

export interface RateLimitOptions {
  bucket: RateLimitBucket;
}

export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);
