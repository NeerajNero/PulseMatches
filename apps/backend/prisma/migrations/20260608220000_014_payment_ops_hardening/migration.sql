-- Add payment operations records for manual refund tracking and one-shot reconciliation visibility.
CREATE TYPE "PaymentRefundStatus" AS ENUM (
  'REQUESTED',
  'APPROVED',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
  'MANUAL_RECORDED'
);

CREATE TYPE "PaymentReconciliationStatus" AS ENUM (
  'STARTED',
  'COMPLETED',
  'FAILED'
);

CREATE TABLE "payment_refunds" (
  "id" UUID NOT NULL,
  "payment_record_id" UUID NOT NULL,
  "payment_intent_id" UUID,
  "registration_id" UUID NOT NULL,
  "tournament_id" UUID NOT NULL,
  "tournament_category_id" UUID,
  "user_id" UUID,
  "provider" "PaymentProvider" NOT NULL,
  "status" "PaymentRefundStatus" NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "reason" VARCHAR(500),
  "internal_notes" VARCHAR(1000),
  "provider_refund_id" VARCHAR(160),
  "requested_by_user_id" UUID,
  "processed_by_user_id" UUID,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payment_refunds_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_refunds_amount_nonnegative" CHECK ("amount" >= 0)
);

CREATE TABLE "payment_reconciliation_runs" (
  "id" UUID NOT NULL,
  "provider" "PaymentProvider" NOT NULL,
  "status" "PaymentReconciliationStatus" NOT NULL DEFAULT 'STARTED',
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP(3),
  "checked_count" INTEGER NOT NULL DEFAULT 0,
  "updated_count" INTEGER NOT NULL DEFAULT 0,
  "failed_count" INTEGER NOT NULL DEFAULT 0,
  "summary" JSONB,
  "error" VARCHAR(1000),

  CONSTRAINT "payment_reconciliation_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payment_refunds_payment_record_id_idx" ON "payment_refunds"("payment_record_id");
CREATE INDEX "payment_refunds_payment_intent_id_idx" ON "payment_refunds"("payment_intent_id");
CREATE INDEX "payment_refunds_registration_id_idx" ON "payment_refunds"("registration_id");
CREATE INDEX "payment_refunds_tournament_id_idx" ON "payment_refunds"("tournament_id");
CREATE INDEX "payment_refunds_tournament_category_id_idx" ON "payment_refunds"("tournament_category_id");
CREATE INDEX "payment_refunds_user_id_idx" ON "payment_refunds"("user_id");
CREATE INDEX "payment_refunds_status_idx" ON "payment_refunds"("status");
CREATE INDEX "payment_refunds_provider_idx" ON "payment_refunds"("provider");

CREATE INDEX "payment_reconciliation_runs_provider_idx" ON "payment_reconciliation_runs"("provider");
CREATE INDEX "payment_reconciliation_runs_status_idx" ON "payment_reconciliation_runs"("status");
CREATE INDEX "payment_reconciliation_runs_started_at_idx" ON "payment_reconciliation_runs"("started_at");

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_payment_record_id_fkey"
  FOREIGN KEY ("payment_record_id") REFERENCES "payment_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_payment_intent_id_fkey"
  FOREIGN KEY ("payment_intent_id") REFERENCES "payment_intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_registration_id_fkey"
  FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_tournament_id_fkey"
  FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_tournament_category_id_fkey"
  FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_requested_by_user_id_fkey"
  FOREIGN KEY ("requested_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_refunds" ADD CONSTRAINT "payment_refunds_processed_by_user_id_fkey"
  FOREIGN KEY ("processed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
