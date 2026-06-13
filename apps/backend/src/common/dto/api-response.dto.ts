import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto<TData = unknown> {
  @ApiProperty({ example: 200 })
  status_code!: number;

  @ApiProperty({ example: "Success" })
  status!: "Success" | "Error";

  @ApiProperty({ example: "Request successful" })
  message!: string;

  @ApiProperty({ nullable: true })
  data!: TData | null;

  @ApiProperty({ nullable: true })
  error!: unknown | null;
}

