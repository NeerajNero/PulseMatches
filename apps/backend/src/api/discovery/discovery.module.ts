import { Module } from "@nestjs/common";
import { DiscoveryDbModule } from "../../db/discovery/discovery-db.module";
import { DiscoveryController } from "./discovery.controller";
import { DiscoveryService } from "./discovery.service";
import { DiscoveryTransform } from "./discovery.transform";

@Module({
  imports: [DiscoveryDbModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService, DiscoveryTransform]
})
export class DiscoveryModule {}

