import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PaymentsDbModule } from "../../db/payments/payments-db.module";
import { NotificationsModule } from "../../notifications/notifications.module";
import { PaymentProviderService } from "../../payments/payment-provider.service";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { PaymentsTransform } from "./payments.transform";

@Module({
  imports: [AuthModule, PaymentsDbModule, NotificationsModule, JwtModule.register({})],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsTransform, PaymentProviderService, JwtAuthGuard, RolesGuard]
})
export class PaymentsModule {}
