-- Add manual/offline payment tracking without integrating a payment provider.
ALTER TYPE "RegistrationPaymentStatus" ADD VALUE IF NOT EXISTS 'WAIVED';

ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYMENT_MARKED_PAID';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYMENT_MARKED_FAILED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PAYMENT_WAIVED';

CREATE TYPE "PaymentProvider" AS ENUM ('MANUAL', 'FUTURE_PROVIDER');

CREATE TABLE "payment_records" (
  "id" UUID NOT NULL,
  "registration_id" UUID NOT NULL,
  "tournament_id" UUID NOT NULL,
  "tournament_category_id" UUID,
  "user_id" UUID,
  "provider" "PaymentProvider" NOT NULL DEFAULT 'MANUAL',
  "mode" "RegistrationPaymentMode" NOT NULL,
  "status" "RegistrationPaymentStatus" NOT NULL,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
  "reference" VARCHAR(160),
  "internal_notes" VARCHAR(1000),
  "paid_at" TIMESTAMP(3),
  "verified_by_organizer_user_id" UUID,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_records_amount_non_negative_chk" CHECK ("amount" >= 0)
);

CREATE UNIQUE INDEX "payment_records_registration_id_key" ON "payment_records"("registration_id");
CREATE INDEX "payment_records_registration_id_idx" ON "payment_records"("registration_id");
CREATE INDEX "payment_records_tournament_id_idx" ON "payment_records"("tournament_id");
CREATE INDEX "payment_records_tournament_category_id_idx" ON "payment_records"("tournament_category_id");
CREATE INDEX "payment_records_user_id_idx" ON "payment_records"("user_id");
CREATE INDEX "payment_records_status_idx" ON "payment_records"("status");
CREATE INDEX "payment_records_provider_idx" ON "payment_records"("provider");

ALTER TABLE "payment_records"
ADD CONSTRAINT "payment_records_registration_id_fkey"
FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_records"
ADD CONSTRAINT "payment_records_tournament_id_fkey"
FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_records"
ADD CONSTRAINT "payment_records_tournament_category_id_fkey"
FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payment_records"
ADD CONSTRAINT "payment_records_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_records"
ADD CONSTRAINT "payment_records_verified_by_organizer_user_id_fkey"
FOREIGN KEY ("verified_by_organizer_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
