import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { checkTcpReachable } from "../common/utils/tcp-check.util";
import { PrismaService } from "../db/prisma/prisma.service";
import { HealthReadyResponseDto, HealthResponseDto } from "./dto/health-response.dto";

@Injectable()
export class HealthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  getHealth(): HealthResponseDto {
    return {
      status: "ok",
      service: this.config.get<string>("SERVICE_NAME", "matchflow-arena-api"),
      version: this.config.get<string>("APP_VERSION", "0.1.0"),
      checked_at: new Date().toISOString()
    };
  }

  async getReady(): Promise<HealthReadyResponseDto> {
    const databaseOk = await this.checkDatabase();
    const redisOk = await checkTcpReachable({
      host: this.config.get<string>("REDIS_HOST", "localhost"),
      port: this.config.get<number>("REDIS_PORT", 56379)
    });
    const requiredEnv = [
      { name: "database", key: "DATABASE_URL" },
      { name: "access_token_signing", key: "JWT_ACCESS_TOKEN_SECRET" },
      { name: "refresh_token_signing", key: "JWT_REFRESH_TOKEN_SECRET" },
      { name: "frontend_url", key: "FE_APP_URL" }
    ].map((item) => ({
      name: item.name,
      configured: Boolean(this.config.get<string>(item.key))
    }));
    const dependencies = [
      { name: "database", status: databaseOk ? "ok" as const : "error" as const },
      { name: "redis", status: redisOk ? "ok" as const : "error" as const }
    ];
    const envOk = requiredEnv.every((item) => item.configured);
    const status = databaseOk && redisOk && envOk ? "ok" as const : "error" as const;

    return {
      ...this.getHealth(),
      status,
      dependencies,
      required_env: requiredEnv
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
