import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OrganizerRostersDbModule } from "../../db/organizer-rosters/organizer-rosters-db.module";
import { NotificationsModule } from "../../notifications/notifications.module";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrganizerRostersController } from "./organizer-rosters.controller";
import { OrganizerRostersService } from "./organizer-rosters.service";
import { OrganizerRostersTransform } from "./organizer-rosters.transform";

@Module({
  imports: [AuthModule, OrganizerRostersDbModule, NotificationsModule, JwtModule.register({})],
  controllers: [OrganizerRostersController],
  providers: [OrganizerRostersService, OrganizerRostersTransform, JwtAuthGuard, RolesGuard]
})
export class OrganizerRostersModule {}
