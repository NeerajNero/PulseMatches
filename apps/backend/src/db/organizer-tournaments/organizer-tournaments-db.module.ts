import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { OrganizerTournamentsDbService } from "./organizer-tournaments-db.service";
import { OrganizerTournamentsRepository } from "./organizer-tournaments.repository";

@Module({
  imports: [PrismaModule],
  providers: [OrganizerTournamentsRepository, OrganizerTournamentsDbService],
  exports: [OrganizerTournamentsDbService]
})
export class OrganizerTournamentsDbModule {}
