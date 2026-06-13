import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class TournamentListQueryDto {
  @ApiPropertyOptional({ example: "bengaluru", description: "City slug or UUID." })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "badminton", description: "Sport slug or UUID." })
  @IsOptional()
  @IsString()
  sport?: string;

  @ApiPropertyOptional({ example: "published", enum: ["draft", "published", "archived", "blocked"] })
  @IsOptional()
  @IsIn(["draft", "published", "archived", "blocked"])
  status?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  upcoming_only?: boolean;

  @ApiPropertyOptional({ example: "2026-06-01T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  starts_from?: string;

  @ApiPropertyOptional({ example: "2026-07-01T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  starts_to?: string;

  @ApiPropertyOptional({ example: "open" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}

