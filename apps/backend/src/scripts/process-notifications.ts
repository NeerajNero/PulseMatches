import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { NotificationsService } from "../notifications/notifications.service";

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });
  try {
    const notifications = app.get(NotificationsService);
    const limit = Number(process.env.NOTIFICATION_PROCESS_LIMIT ?? 20);
    const result = await notifications.processPendingNotifications(Number.isInteger(limit) && limit > 0 ? limit : 20);
    console.log(JSON.stringify({ status: "notifications_processed", ...result }));

    if (process.env.NOTIFICATION_PROCESS_REQUIRE_WORK === "true" && result.processed === 0) {
      process.exitCode = 1;
    }
  } finally {
    await app.close();
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
