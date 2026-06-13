import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OrganizerFixturesDbModule } from "../../db/organizer-fixtures/organizer-fixtures-db.module";
import { NotificationsModule } from "../../notifications/notifications.module";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrganizerFixturesController } from "./organizer-fixtures.controller";
import { OrganizerFixturesService } from "./organizer-fixtures.service";
import { OrganizerFixturesTransform } from "./organizer-fixtures.transform";

@Module({
  imports: [AuthModule, OrganizerFixturesDbModule, NotificationsModule, JwtModule.register({})],
  controllers: [OrganizerFixturesController],
  providers: [OrganizerFixturesService, OrganizerFixturesTransform, JwtAuthGuard, RolesGuard]
})
export class OrganizerFixturesModule {}
