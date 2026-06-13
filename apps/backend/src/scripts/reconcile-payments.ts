import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { PaymentsService } from "../api/payments/payments.service";

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });
  try {
    const payments = app.get(PaymentsService);
    const result = await payments.reconcilePayments();
    console.log(JSON.stringify(result));

    if (process.env.PAYMENT_RECONCILIATION_REQUIRE_WORK === "true" && result.checked === 0) {
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
