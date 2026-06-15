import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDto } from "../../common/dto/api-response.dto";

export class HealthResponseDto {
  @ApiProperty({ example: "ok" })
  status!: "ok";

  @ApiProperty({ example: "matchflow-arena-api" })
  service!: string;

  @ApiProperty({ example: "0.1.0" })
  version!: string;

  @ApiProperty({ example: "2026-05-26T00:00:00.000Z" })
  checked_at!: string;
}

export class HealthDependencyDto {
  @ApiProperty({ example: "database" })
  name!: string;

  @ApiProperty({ example: "ok" })
  status!: "ok" | "error";
}

export class HealthEnvCheckDto {
  @ApiProperty({ example: "DATABASE_URL" })
  name!: string;

  @ApiProperty({ example: true })
  configured!: boolean;
}

export class HealthReadyResponseDto {
  @ApiProperty({ example: "ok" })
  status!: "ok" | "error";

  @ApiProperty({ example: "matchflow-arena-api" })
  service!: string;

  @ApiProperty({ example: "0.1.0" })
  version!: string;

  @ApiProperty({ example: "2026-05-26T00:00:00.000Z" })
  checked_at!: string;

  @ApiProperty({ type: [HealthDependencyDto] })
  dependencies!: HealthDependencyDto[];

  @ApiProperty({ type: [HealthEnvCheckDto] })
  required_env!: HealthEnvCheckDto[];
}

export class HealthApiResponseDto extends ApiResponseDto<HealthResponseDto> {
  @ApiProperty({ type: HealthResponseDto })
  declare data: HealthResponseDto;
}

export class HealthReadyApiResponseDto extends ApiResponseDto<HealthReadyResponseDto> {
  @ApiProperty({ type: HealthReadyResponseDto })
  declare data: HealthReadyResponseDto;
}
