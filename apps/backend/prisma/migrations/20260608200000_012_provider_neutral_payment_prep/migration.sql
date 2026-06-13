-- Add provider-neutral payment intent/event lifecycle models without integrating a real gateway.
ALTER TYPE "RegistrationPaymentMode" ADD VALUE IF NOT EXISTS 'ONLINE_PROVIDER';
ALTER TYPE "PaymentProvider" ADD VALUE IF NOT EXISTS 'MOCK';

CREATE TYPE "PaymentIntentMode" AS ENUM ('ONLINE', 'OFFLINE', 'FREE');
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'REQUIRES_ACTION', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');
CREATE TYPE "PaymentAttemptStatus" AS ENUM ('STARTED', 'REDIRECTED', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'EXPIRED');

CREATE TABLE "payment_intents" (
  "id" UUID NOT NULL,
  "registration_id" UUID NOT NULL,
  "payment_record_id" UUID,
  "tournament_id" UUID NOT NULL,
  "tournament_category_id" UUID,
  "user_id" UUID NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "mode" "PaymentIntentMode" NOT NULL,
  "status" "PaymentIntentStatus" NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "provider_intent_id" VARCHAR(160),
  "provider_checkout_url" VARCHAR(1000),
  "idempotency_key" VARCHAR(220),
  "expires_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payment_intents_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_intents_amount_non_negative_chk" CHECK ("amount" >= 0)
);

CREATE TABLE "payment_attempts" (
  "id" UUID NOT NULL,
  "payment_intent_id" UUID NOT NULL,
  "registration_id" UUID NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "status" "PaymentAttemptStatus" NOT NULL,
  "provider_attempt_id" VARCHAR(160),
  "error_code" VARCHAR(120),
  "error_message" VARCHAR(500),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_events" (
  "id" UUID NOT NULL,
  "payment_intent_id" UUID,
  "payment_record_id" UUID,
  "registration_id" UUID,
  "tournament_id" UUID,
  "tournament_category_id" UUID,
  "provider" "PaymentProvider" NOT NULL,
  "event_type" VARCHAR(160) NOT NULL,
  "provider_event_id" VARCHAR(160),
  "payload" JSONB NOT NULL,
  "signature_valid" BOOLEAN,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_intents_idempotency_key_key" ON "payment_intents"("idempotency_key");
CREATE INDEX "payment_intents_registration_id_idx" ON "payment_intents"("registration_id");
CREATE INDEX "payment_intents_payment_record_id_idx" ON "payment_intents"("payment_record_id");
CREATE INDEX "payment_intents_tournament_id_idx" ON "payment_intents"("tournament_id");
CREATE INDEX "payment_intents_tournament_category_id_idx" ON "payment_intents"("tournament_category_id");
CREATE INDEX "payment_intents_user_id_idx" ON "payment_intents"("user_id");
CREATE INDEX "payment_intents_status_idx" ON "payment_intents"("status");
CREATE INDEX "payment_intents_provider_idx" ON "payment_intents"("provider");

CREATE INDEX "payment_attempts_payment_intent_id_idx" ON "payment_attempts"("payment_intent_id");
CREATE INDEX "payment_attempts_registration_id_idx" ON "payment_attempts"("registration_id");
CREATE INDEX "payment_attempts_provider_idx" ON "payment_attempts"("provider");
CREATE INDEX "payment_attempts_status_idx" ON "payment_attempts"("status");

CREATE INDEX "payment_events_payment_intent_id_idx" ON "payment_events"("payment_intent_id");
CREATE INDEX "payment_events_payment_record_id_idx" ON "payment_events"("payment_record_id");
CREATE INDEX "payment_events_registration_id_idx" ON "payment_events"("registration_id");
CREATE INDEX "payment_events_tournament_id_idx" ON "payment_events"("tournament_id");
CREATE INDEX "payment_events_tournament_category_id_idx" ON "payment_events"("tournament_category_id");
CREATE INDEX "payment_events_provider_idx" ON "payment_events"("provider");
CREATE INDEX "payment_events_provider_event_id_idx" ON "payment_events"("provider_event_id");
CREATE INDEX "payment_events_event_type_idx" ON "payment_events"("event_type");

ALTER TABLE "payment_intents"
ADD CONSTRAINT "payment_intents_registration_id_fkey"
FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_intents"
ADD CONSTRAINT "payment_intents_payment_record_id_fkey"
FOREIGN KEY ("payment_record_id") REFERENCES "payment_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_intents"
ADD CONSTRAINT "payment_intents_tournament_id_fkey"
FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_intents"
ADD CONSTRAINT "payment_intents_tournament_category_id_fkey"
FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_intents"
ADD CONSTRAINT "payment_intents_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_attempts"
ADD CONSTRAINT "payment_attempts_payment_intent_id_fkey"
FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_attempts"
ADD CONSTRAINT "payment_attempts_registration_id_fkey"
FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_events"
ADD CONSTRAINT "payment_events_payment_intent_id_fkey"
FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_events"
ADD CONSTRAINT "payment_events_payment_record_id_fkey"
FOREIGN KEY ("payment_record_id") REFERENCES "payment_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_events"
ADD CONSTRAINT "payment_events_registration_id_fkey"
FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_events"
ADD CONSTRAINT "payment_events_tournament_id_fkey"
FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_events"
ADD CONSTRAINT "payment_events_tournament_category_id_fkey"
FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
