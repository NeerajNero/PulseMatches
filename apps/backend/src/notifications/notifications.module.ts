import { Module } from "@nestjs/common";
import { NotificationsDbModule } from "../db/notifications/notifications-db.module";
import { NotificationEmailProvider } from "./notification-email.provider";
import { NotificationTemplateService } from "./notification-template.service";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [NotificationsDbModule],
  providers: [NotificationsService, NotificationTemplateService, NotificationEmailProvider],
  exports: [NotificationsService]
})
export class NotificationsModule {}
