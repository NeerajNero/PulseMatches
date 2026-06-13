import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { RegistrationsDbService } from "./registrations-db.service";
import { RegistrationsRepository } from "./registrations.repository";

@Module({
  imports: [PrismaModule],
  providers: [RegistrationsRepository, RegistrationsDbService],
  exports: [RegistrationsDbService]
})
export class RegistrationsDbModule {}
