import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";

export class CreateOrganizerProfileRequestDto {
  @ApiProperty({ example: "North Court Club" })
  @IsString()
  @Length(2, 180)
  organization_name!: string;

  @ApiProperty({ example: "organizer@example.com" })
  @IsEmail()
  contact_email!: string;

  @ApiPropertyOptional({ example: "+919999999999" })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  contact_phone?: string;
}

export class UpdateOrganizerProfileRequestDto {
  @ApiPropertyOptional({ example: "North Court Club" })
  @IsOptional()
  @IsString()
  @Length(2, 180)
  organization_name?: string;

  @ApiPropertyOptional({ example: "organizer@example.com" })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ example: "+919999999999", nullable: true })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  contact_phone?: string;
}

export class OrganizerProfileResponseDto {
  @ApiProperty({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  id!: string;

  @ApiProperty({ example: "North Court Club" })
  organization_name!: string;

  @ApiProperty({ example: "north-court-club" })
  slug!: string;

  @ApiProperty({ example: "organizer@example.com" })
  contact_email!: string;

  @ApiPropertyOptional({ example: "+919999999999", nullable: true })
  contact_phone!: string | null;

  @ApiProperty({ example: "PENDING" })
  verification_status!: string;

  @ApiProperty({ example: "ACTIVE" })
  status!: string;

  @ApiProperty({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  user_id!: string;

  @ApiProperty({ example: "2026-05-26T00:00:00.000Z" })
  created_at!: string;

  @ApiProperty({ example: "2026-05-26T00:00:00.000Z" })
  updated_at!: string;
}

export class OrganizerProfileApiResponseDto extends ApiResponseDto<OrganizerProfileResponseDto> {
  @ApiProperty({ type: OrganizerProfileResponseDto })
  declare data: OrganizerProfileResponseDto;
}

