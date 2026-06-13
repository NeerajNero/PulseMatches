import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RegistrationsDbModule } from "../../db/registrations/registrations-db.module";
import { NotificationsModule } from "../../notifications/notifications.module";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RegistrationsController } from "./registrations.controller";
import { RegistrationsService } from "./registrations.service";
import { RegistrationsTransform } from "./registrations.transform";

@Module({
  imports: [AuthModule, RegistrationsDbModule, NotificationsModule, JwtModule.register({})],
  controllers: [RegistrationsController],
  providers: [RegistrationsService, RegistrationsTransform, JwtAuthGuard, RolesGuard]
})
export class RegistrationsModule {}
