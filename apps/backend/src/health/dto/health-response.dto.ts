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

export class HealthApiResponseDto extends ApiResponseDto<HealthResponseDto> {
  @ApiProperty({ type: HealthResponseDto })
  declare data: HealthResponseDto;
}
