import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HealthApiResponseDto, HealthResponseDto } from "./dto/health-response.dto";
import { HealthService } from "./health.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "Check API health" })
  @ApiOkResponse({ type: HealthApiResponseDto })
  getHealth(): HealthResponseDto {
    return this.healthService.getHealth();
  }
}
