import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { OrganizerFixturesDbService } from "./organizer-fixtures-db.service";
import { OrganizerFixturesRepository } from "./organizer-fixtures.repository";

@Module({
  imports: [PrismaModule],
  providers: [OrganizerFixturesRepository, OrganizerFixturesDbService],
  exports: [OrganizerFixturesDbService]
})
export class OrganizerFixturesDbModule {}
