import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PaymentsDbService } from "./payments-db.service";
import { PaymentsRepository } from "./payments.repository";

@Module({
  imports: [PrismaModule],
  providers: [PaymentsRepository, PaymentsDbService],
  exports: [PaymentsDbService]
})
export class PaymentsDbModule {}
