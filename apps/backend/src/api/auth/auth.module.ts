import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthDbModule } from "../../db/auth/auth-db.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthTransform } from "./auth.transform";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [AuthDbModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthTransform, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard]
})
export class AuthModule {}

