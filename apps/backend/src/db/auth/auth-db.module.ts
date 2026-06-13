import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthDbService } from "./auth-db.service";
import { AuthRepository } from "./auth.repository";

@Module({
  imports: [PrismaModule],
  providers: [AuthRepository, AuthDbService],
  exports: [AuthDbService]
})
export class AuthDbModule {}

