import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AdminDbService } from "./admin-db.service";
import { AdminRepository } from "./admin.repository";

@Module({
  imports: [PrismaModule],
  providers: [AdminRepository, AdminDbService],
  exports: [AdminDbService]
})
export class AdminDbModule {}
