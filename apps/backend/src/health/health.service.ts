import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HealthResponseDto } from "./dto/health-response.dto";

@Injectable()
export class HealthService {
  constructor(private readonly config: ConfigService) {}

  getHealth(): HealthResponseDto {
    return {
      status: "ok",
      service: this.config.get<string>("SERVICE_NAME", "matchflow-arena-api"),
      version: this.config.get<string>("APP_VERSION", "0.1.0"),
      checked_at: new Date().toISOString()
    };
  }
}

