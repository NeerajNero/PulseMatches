import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import crypto from "node:crypto";
import type { Request, Response } from "express";
import { RATE_LIMIT_KEY, RateLimitBucket, RateLimitOptions } from "./rate-limit.decorator";

interface RateWindow {
  count: number;
  resetAt: number;
}

type RequestWithHeaders = Request & {
  ip?: string;
};

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly windows = new Map<string, RateWindow>();
  private nextSweepAt = Date.now() + 60_000;

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<RateLimitOptions | undefined>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const response = context.switchToHttp().getResponse<Response>();
    const ttlSeconds = this.config.get<number>("RATE_LIMIT_TTL_SECONDS", 60);
    const maxRequests = this.getMaxRequests(options.bucket);
    const now = Date.now();
    const key = this.createKey(options.bucket, request);
    const current = this.windows.get(key);

    if (!current || current.resetAt <= now) {
      this.windows.set(key, {
        count: 1,
        resetAt: now + ttlSeconds * 1000
      });
      this.sweep(now);
      return true;
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      response.setHeader("Retry-After", String(retryAfterSeconds));
      throw new HttpException("Too many requests. Try again later.", HttpStatus.TOO_MANY_REQUESTS);
    }

    current.count += 1;
    this.sweep(now);
    return true;
  }

  private getMaxRequests(bucket: RateLimitBucket): number {
    if (bucket === "auth") {
      return this.config.get<number>("AUTH_RATE_LIMIT_MAX_REQUESTS", 20);
    }
    if (bucket === "payment") {
      return this.config.get<number>("PAYMENT_RATE_LIMIT_MAX_REQUESTS", 30);
    }
    if (bucket === "export") {
      return this.config.get<number>("EXPORT_RATE_LIMIT_MAX_REQUESTS", 20);
    }
    return this.config.get<number>("RATE_LIMIT_MAX_REQUESTS", 120);
  }

  private createKey(bucket: RateLimitBucket, request: RequestWithHeaders): string {
    const ip = this.getClientIp(request);
    const authHash = this.hashHeader(request.headers.authorization);
    return `${bucket}:${ip}:${authHash ?? "anonymous"}`;
  }

  private getClientIp(request: RequestWithHeaders): string {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
      return forwarded.split(",")[0]?.trim() || "unknown";
    }
    return request.ip ?? request.socket.remoteAddress ?? "unknown";
  }

  private hashHeader(value: string | undefined): string | null {
    if (!value) {
      return null;
    }
    return crypto.createHash("sha256").update(value).digest("hex").slice(0, 16);
  }

  private sweep(now: number): void {
    if (now < this.nextSweepAt) {
      return;
    }
    for (const [key, value] of this.windows.entries()) {
      if (value.resetAt <= now) {
        this.windows.delete(key);
      }
    }
    this.nextSweepAt = now + 60_000;
  }
}
