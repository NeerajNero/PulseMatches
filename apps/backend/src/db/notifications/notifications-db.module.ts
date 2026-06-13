import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationsDbService } from "./notifications-db.service";
import { NotificationsRepository } from "./notifications.repository";

@Module({
  imports: [PrismaModule],
  providers: [NotificationsRepository, NotificationsDbService],
  exports: [NotificationsDbService]
})
export class NotificationsDbModule {}
