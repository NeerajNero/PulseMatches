import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { DiscoveryDbService } from "./discovery-db.service";
import { DiscoveryRepository } from "./discovery.repository";

@Module({
  imports: [PrismaModule],
  providers: [DiscoveryRepository, DiscoveryDbService],
  exports: [DiscoveryDbService]
})
export class DiscoveryDbModule {}

