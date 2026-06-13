import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, Length, MinLength, ValidateIf } from "class-validator";
import { ApiResponseDto } from "../../../common/dto/api-response.dto";

export enum SignupRoleDto {
  PLAYER = "player",
  ORGANIZER = "organizer"
}

export class SignupRequestDto {
  @ApiProperty({ example: "player@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: "ChangeMe123!" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: "Aarav Sharma" })
  @IsString()
  @Length(2, 160)
  display_name!: string;

  @ApiProperty({ enum: SignupRoleDto, example: SignupRoleDto.PLAYER })
  @IsEnum(SignupRoleDto)
  role!: SignupRoleDto;

  @ApiPropertyOptional({ example: "North Court Club" })
  @ValidateIf((dto: SignupRequestDto) => dto.role === SignupRoleDto.ORGANIZER)
  @IsString()
  @Length(2, 180)
  organization_name?: string;

  @ApiPropertyOptional({ example: "+919999999999" })
  @IsOptional()
  @IsString()
  @Length(7, 40)
  contact_phone?: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: "player@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "ChangeMe123!" })
  @IsString()
  password!: string;
}

export class RefreshRequestDto {
  @ApiProperty({ example: "refresh-token-value" })
  @IsString()
  refresh_token!: string;
}

export class LogoutRequestDto {
  @ApiPropertyOptional({ example: "refresh-token-value" })
  @IsOptional()
  @IsString()
  refresh_token?: string;
}

export class OrganizerProfileSummaryDto {
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
}

export class CurrentUserDto {
  @ApiProperty({ example: "85e9f43b-a6cb-46ee-95e9-bad0955c6308" })
  id!: string;

  @ApiProperty({ example: "player@example.com" })
  email!: string;

  @ApiProperty({ example: "Aarav Sharma" })
  display_name!: string;

  @ApiProperty({ type: [String], example: ["PLAYER"] })
  roles!: string[];

  @ApiProperty({ example: "ACTIVE" })
  status!: string;

  @ApiPropertyOptional({ type: OrganizerProfileSummaryDto, nullable: true })
  @Type(() => OrganizerProfileSummaryDto)
  organizer_profile!: OrganizerProfileSummaryDto | null;
}

export class AuthTokensDto {
  @ApiProperty({ example: "jwt-access-token" })
  access_token!: string;

  @ApiProperty({ example: "refresh-token-value" })
  refresh_token!: string;

  @ApiProperty({ example: 900 })
  expires_in!: number;
}

export class AuthResponseDto {
  @ApiProperty({ type: CurrentUserDto })
  @Type(() => CurrentUserDto)
  user!: CurrentUserDto;

  @ApiProperty({ type: AuthTokensDto })
  @Type(() => AuthTokensDto)
  tokens!: AuthTokensDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;
}

export class AuthApiResponseDto extends ApiResponseDto<AuthResponseDto> {
  @ApiProperty({ type: AuthResponseDto })
  declare data: AuthResponseDto;
}

export class CurrentUserApiResponseDto extends ApiResponseDto<CurrentUserDto> {
  @ApiProperty({ type: CurrentUserDto })
  declare data: CurrentUserDto;
}

export class LogoutApiResponseDto extends ApiResponseDto<LogoutResponseDto> {
  @ApiProperty({ type: LogoutResponseDto })
  declare data: LogoutResponseDto;
}

