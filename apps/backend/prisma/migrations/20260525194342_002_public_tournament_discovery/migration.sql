-- CreateEnum
CREATE TYPE "CatalogStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TournamentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TournamentVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- CreateEnum
CREATE TYPE "TournamentCategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TournamentFormatType" AS ENUM ('KNOCKOUT', 'ROUND_ROBIN', 'LEAGUE', 'FRIENDLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ParticipantType" AS ENUM ('SINGLES', 'DOUBLES', 'TEAM');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('OPEN', 'MALE', 'FEMALE', 'MIXED');

-- CreateEnum
CREATE TYPE "TournamentMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateTable
CREATE TABLE "sports" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "country_code" VARCHAR(2) NOT NULL DEFAULT 'IN',
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "name" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "address" VARCHAR(320) NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "status" "CatalogStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" UUID NOT NULL,
    "organizer_profile_id" UUID NOT NULL,
    "sport_id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "venue_id" UUID,
    "title" VARCHAR(220) NOT NULL,
    "slug" VARCHAR(260) NOT NULL,
    "short_description" VARCHAR(300),
    "description" TEXT,
    "status" "TournamentStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "TournamentVisibility" NOT NULL DEFAULT 'PUBLIC',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "registration_opens_at" TIMESTAMP(3),
    "registration_closes_at" TIMESTAMP(3),
    "max_participants" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_categories" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "format_type" "TournamentFormatType" NOT NULL,
    "participant_type" "ParticipantType" NOT NULL,
    "gender_type" "GenderType" NOT NULL DEFAULT 'OPEN',
    "min_age" INTEGER,
    "max_age" INTEGER,
    "entry_fee_amount" INTEGER NOT NULL DEFAULT 0,
    "entry_fee_currency" VARCHAR(3) NOT NULL DEFAULT 'INR',
    "capacity" INTEGER,
    "status" "TournamentCategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_media" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "type" "TournamentMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" VARCHAR(220),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournament_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sports_slug_key" ON "sports"("slug");

-- CreateIndex
CREATE INDEX "sports_status_idx" ON "sports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");

-- CreateIndex
CREATE INDEX "cities_status_idx" ON "cities"("status");

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "venues"("slug");

-- CreateIndex
CREATE INDEX "venues_city_id_idx" ON "venues"("city_id");

-- CreateIndex
CREATE INDEX "venues_status_idx" ON "venues"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_slug_key" ON "tournaments"("slug");

-- CreateIndex
CREATE INDEX "tournaments_city_id_idx" ON "tournaments"("city_id");

-- CreateIndex
CREATE INDEX "tournaments_sport_id_idx" ON "tournaments"("sport_id");

-- CreateIndex
CREATE INDEX "tournaments_status_idx" ON "tournaments"("status");

-- CreateIndex
CREATE INDEX "tournaments_visibility_idx" ON "tournaments"("visibility");

-- CreateIndex
CREATE INDEX "tournaments_starts_at_idx" ON "tournaments"("starts_at");

-- CreateIndex
CREATE INDEX "tournaments_status_visibility_starts_at_idx" ON "tournaments"("status", "visibility", "starts_at");

-- CreateIndex
CREATE INDEX "tournament_categories_tournament_id_idx" ON "tournament_categories"("tournament_id");

-- CreateIndex
CREATE INDEX "tournament_categories_status_idx" ON "tournament_categories"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_categories_tournament_id_code_key" ON "tournament_categories"("tournament_id", "code");

-- CreateIndex
CREATE INDEX "tournament_media_tournament_id_idx" ON "tournament_media"("tournament_id");

-- CreateIndex
CREATE INDEX "tournament_media_sort_order_idx" ON "tournament_media"("sort_order");

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_organizer_profile_id_fkey" FOREIGN KEY ("organizer_profile_id") REFERENCES "organizer_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_categories" ADD CONSTRAINT "tournament_categories_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_media" ADD CONSTRAINT "tournament_media_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
