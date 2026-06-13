-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationPaymentMode" AS ENUM ('OFFLINE', 'FREE');

-- CreateEnum
CREATE TYPE "RegistrationPaymentStatus" AS ENUM ('NOT_REQUIRED', 'PENDING_OFFLINE', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "registrations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "tournament_category_id" UUID,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "payment_mode" "RegistrationPaymentMode" NOT NULL,
    "payment_status" "RegistrationPaymentStatus" NOT NULL,
    "fee_amount" INTEGER NOT NULL DEFAULT 0,
    "fee_currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "player_name" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(40),
    "notes" VARCHAR(500),
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "registrations_user_id_idx" ON "registrations"("user_id");

-- CreateIndex
CREATE INDEX "registrations_user_id_status_idx" ON "registrations"("user_id", "status");

-- CreateIndex
CREATE INDEX "registrations_tournament_id_idx" ON "registrations"("tournament_id");

-- CreateIndex
CREATE INDEX "registrations_tournament_id_status_idx" ON "registrations"("tournament_id", "status");

-- CreateIndex
CREATE INDEX "registrations_tournament_category_id_idx" ON "registrations"("tournament_category_id");

-- CreateIndex
CREATE INDEX "registrations_tournament_category_id_status_idx" ON "registrations"("tournament_category_id", "status");

-- CreateIndex
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_tournament_category_id_fkey" FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

