import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { OrganizerRostersDbService } from "./organizer-rosters-db.service";
import { OrganizerRostersRepository } from "./organizer-rosters.repository";

@Module({
  imports: [PrismaModule],
  providers: [OrganizerRostersRepository, OrganizerRostersDbService],
  exports: [OrganizerRostersDbService]
})
export class OrganizerRostersDbModule {}
