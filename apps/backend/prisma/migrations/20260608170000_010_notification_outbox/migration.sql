-- Create durable notification outbox for email-ready delivery.
CREATE TYPE "NotificationType" AS ENUM (
  'REGISTRATION_CREATED',
  'REGISTRATION_APPROVED',
  'REGISTRATION_REJECTED',
  'REGISTRATION_CANCELLED',
  'RESULTS_PUBLISHED',
  'MATCH_SCHEDULE_UPDATED'
);

CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL');

CREATE TYPE "NotificationStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'SENT',
  'FAILED',
  'SKIPPED'
);

CREATE TABLE "notification_outbox" (
  "id" UUID NOT NULL,
  "type" "NotificationType" NOT NULL,
  "channel" "NotificationChannel" NOT NULL DEFAULT 'EMAIL',
  "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "recipient_user_id" UUID,
  "recipient_email" VARCHAR(320),
  "recipient_name" VARCHAR(160),
  "tournament_id" UUID,
  "tournament_category_id" UUID,
  "registration_id" UUID,
  "fixture_set_id" UUID,
  "match_id" UUID,
  "subject" VARCHAR(220),
  "payload" JSONB NOT NULL,
  "provider" VARCHAR(80),
  "provider_message_id" VARCHAR(220),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "max_attempts" INTEGER NOT NULL DEFAULT 3,
  "last_error" VARCHAR(1000),
  "scheduled_at" TIMESTAMP(3),
  "processed_at" TIMESTAMP(3),
  "idempotency_key" VARCHAR(220),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notification_outbox_attempts_non_negative_chk" CHECK ("attempts" >= 0),
  CONSTRAINT "notification_outbox_max_attempts_positive_chk" CHECK ("max_attempts" > 0)
);

CREATE UNIQUE INDEX "notification_outbox_idempotency_key_key" ON "notification_outbox"("idempotency_key");
CREATE INDEX "notification_outbox_status_scheduled_at_idx" ON "notification_outbox"("status", "scheduled_at");
CREATE INDEX "notification_outbox_type_idx" ON "notification_outbox"("type");
CREATE INDEX "notification_outbox_recipient_user_id_idx" ON "notification_outbox"("recipient_user_id");
CREATE INDEX "notification_outbox_tournament_id_idx" ON "notification_outbox"("tournament_id");
CREATE INDEX "notification_outbox_registration_id_idx" ON "notification_outbox"("registration_id");
CREATE INDEX "notification_outbox_fixture_set_id_idx" ON "notification_outbox"("fixture_set_id");
CREATE INDEX "notification_outbox_match_id_idx" ON "notification_outbox"("match_id");

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_recipient_user_id_fkey"
FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_tournament_id_fkey"
FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_tournament_category_id_fkey"
FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_registration_id_fkey"
FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_fixture_set_id_fkey"
FOREIGN KEY ("fixture_set_id") REFERENCES "fixture_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notification_outbox"
ADD CONSTRAINT "notification_outbox_match_id_fkey"
FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
