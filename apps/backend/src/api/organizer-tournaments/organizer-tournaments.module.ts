import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { OrganizerTournamentsDbModule } from "../../db/organizer-tournaments/organizer-tournaments-db.module";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { OrganizerTournamentsController } from "./organizer-tournaments.controller";
import { OrganizerTournamentsService } from "./organizer-tournaments.service";
import { OrganizerTournamentsTransform } from "./organizer-tournaments.transform";

@Module({
  imports: [AuthModule, OrganizerTournamentsDbModule, JwtModule.register({})],
  controllers: [OrganizerTournamentsController],
  providers: [OrganizerTournamentsService, OrganizerTournamentsTransform, JwtAuthGuard, RolesGuard]
})
export class OrganizerTournamentsModule {}
