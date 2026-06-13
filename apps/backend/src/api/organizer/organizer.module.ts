import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthDbModule } from "../../db/auth/auth-db.module";
import { OrganizerProfilesDbModule } from "../../db/organizer-profiles/organizer-profiles-db.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthModule } from "../auth/auth.module";
import { OrganizerController } from "./organizer.controller";
import { OrganizerService } from "./organizer.service";
import { OrganizerTransform } from "./organizer.transform";

@Module({
  imports: [AuthModule, AuthDbModule, OrganizerProfilesDbModule, JwtModule.register({})],
  controllers: [OrganizerController],
  providers: [OrganizerService, OrganizerTransform, JwtAuthGuard, RolesGuard]
})
export class OrganizerModule {}
