import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { NotificationEmailProvider } from "../notifications/notification-email.provider";

async function main() {
  if ((process.env.NOTIFICATION_PROVIDER ?? "noop").toLowerCase() !== "smtp") {
    throw new Error("Set NOTIFICATION_PROVIDER=smtp to send a real test email");
  }

  const to = process.env.NOTIFICATION_TEST_TO ?? process.env.TEST_NOTIFICATION_EMAIL;
  if (!to?.trim()) {
    throw new Error("Set NOTIFICATION_TEST_TO or TEST_NOTIFICATION_EMAIL to send a test email");
  }

  const app = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });
  try {
    const provider = app.get(NotificationEmailProvider, { strict: false });
    const result = await provider.send({
      notificationId: `manual-test-${Date.now()}`,
      to: to.trim(),
      recipientName: "Test Recipient",
      subject: "MatchFlow Arena email provider test",
      text: "This is a manual SMTP provider test from MatchFlow Arena.",
      html: "<p>This is a manual SMTP provider test from MatchFlow Arena.</p>"
    });
    console.log(JSON.stringify({
      status: "test_email_sent",
      provider: result.provider,
      provider_message_id: result.providerMessageId ?? null
    }));
  } finally {
    await app.close();
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
