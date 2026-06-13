import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { OrganizerProfilesDbService } from "./organizer-profiles-db.service";
import { OrganizerProfilesRepository } from "./organizer-profiles.repository";

@Module({
  imports: [PrismaModule],
  providers: [OrganizerProfilesRepository, OrganizerProfilesDbService],
  exports: [OrganizerProfilesDbService]
})
export class OrganizerProfilesDbModule {}

