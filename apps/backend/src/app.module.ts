import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdminModule } from "./api/admin/admin.module";
import { AuthModule } from "./api/auth/auth.module";
import { DiscoveryModule } from "./api/discovery/discovery.module";
import { OrganizerModule } from "./api/organizer/organizer.module";
import { OrganizerFixturesModule } from "./api/organizer-fixtures/organizer-fixtures.module";
import { OrganizerRostersModule } from "./api/organizer-rosters/organizer-rosters.module";
import { OrganizerTournamentsModule } from "./api/organizer-tournaments/organizer-tournaments.module";
import { PaymentsModule } from "./api/payments/payments.module";
import { RegistrationsModule } from "./api/registrations/registrations.module";
import { validateEnv } from "./config/env.validation";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv
    }),
    HealthModule,
    AdminModule,
    AuthModule,
    OrganizerModule,
    OrganizerFixturesModule,
    OrganizerRostersModule,
    OrganizerTournamentsModule,
    DiscoveryModule,
    RegistrationsModule,
    PaymentsModule,
    NotificationsModule
  ]
})
export class AppModule {}
