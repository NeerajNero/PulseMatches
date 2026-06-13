import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminDbModule } from "../../db/admin/admin-db.module";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { AdminTransform } from "./admin.transform";

@Module({
  imports: [AuthModule, AdminDbModule, JwtModule.register({})],
  controllers: [AdminController],
  providers: [AdminService, AdminTransform, JwtAuthGuard, RolesGuard]
})
export class AdminModule {}
