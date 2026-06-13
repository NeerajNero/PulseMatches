-- CreateEnum
CREATE TYPE "FixtureFormat" AS ENUM ('KNOCKOUT', 'ROUND_ROBIN');

-- CreateEnum
CREATE TYPE "FixtureEntrantType" AS ENUM ('PARTICIPANT', 'TEAM');

-- CreateEnum
CREATE TYPE "FixtureSetStatus" AS ENUM ('DRAFT', 'GENERATED', 'SCHEDULED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FixtureRoundStage" AS ENUM ('ROUND_ROBIN', 'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL', 'THIRD_PLACE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('UNSCHEDULED', 'SCHEDULED', 'POSTPONED', 'CANCELLED');

-- CreateTable
CREATE TABLE "fixture_sets" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "tournament_category_id" UUID NOT NULL,
    "format" "FixtureFormat" NOT NULL,
    "entrant_type" "FixtureEntrantType" NOT NULL,
    "status" "FixtureSetStatus" NOT NULL DEFAULT 'GENERATED',
    "name" VARCHAR(180),
    "generated_at" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixture_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixture_rounds" (
    "id" UUID NOT NULL,
    "fixture_set_id" UUID NOT NULL,
    "round_number" INTEGER NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "stage" "FixtureRoundStage" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixture_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL,
    "fixture_set_id" UUID NOT NULL,
    "fixture_round_id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "tournament_category_id" UUID NOT NULL,
    "match_number" INTEGER NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'UNSCHEDULED',
    "scheduled_at" TIMESTAMP(3),
    "venue_name" VARCHAR(180),
    "court_name" VARCHAR(120),
    "notes" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_entrants" (
    "id" UUID NOT NULL,
    "match_id" UUID NOT NULL,
    "participant_id" UUID,
    "team_id" UUID,
    "slot_number" INTEGER NOT NULL,
    "is_bye" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_entrants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fixture_sets_tournament_id_idx" ON "fixture_sets"("tournament_id");

-- CreateIndex
CREATE INDEX "fixture_sets_tournament_category_id_idx" ON "fixture_sets"("tournament_category_id");

-- CreateIndex
CREATE INDEX "fixture_sets_tournament_id_tournament_category_id_idx" ON "fixture_sets"("tournament_id", "tournament_category_id");

-- CreateIndex
CREATE INDEX "fixture_sets_status_idx" ON "fixture_sets"("status");

-- CreateIndex
CREATE INDEX "fixture_rounds_fixture_set_id_idx" ON "fixture_rounds"("fixture_set_id");

-- CreateIndex
CREATE UNIQUE INDEX "fixture_rounds_fixture_set_id_round_number_key" ON "fixture_rounds"("fixture_set_id", "round_number");

-- CreateIndex
CREATE INDEX "matches_fixture_set_id_idx" ON "matches"("fixture_set_id");

-- CreateIndex
CREATE INDEX "matches_fixture_round_id_idx" ON "matches"("fixture_round_id");

-- CreateIndex
CREATE INDEX "matches_tournament_id_idx" ON "matches"("tournament_id");

-- CreateIndex
CREATE INDEX "matches_tournament_category_id_idx" ON "matches"("tournament_category_id");

-- CreateIndex
CREATE INDEX "matches_scheduled_at_idx" ON "matches"("scheduled_at");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE UNIQUE INDEX "matches_fixture_set_id_match_number_key" ON "matches"("fixture_set_id", "match_number");

-- CreateIndex
CREATE INDEX "match_entrants_match_id_idx" ON "match_entrants"("match_id");

-- CreateIndex
CREATE INDEX "match_entrants_participant_id_idx" ON "match_entrants"("participant_id");

-- CreateIndex
CREATE INDEX "match_entrants_team_id_idx" ON "match_entrants"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "match_entrants_match_id_slot_number_key" ON "match_entrants"("match_id", "slot_number");

-- AddForeignKey
ALTER TABLE "fixture_sets" ADD CONSTRAINT "fixture_sets_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixture_sets" ADD CONSTRAINT "fixture_sets_tournament_category_id_fkey" FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixture_rounds" ADD CONSTRAINT "fixture_rounds_fixture_set_id_fkey" FOREIGN KEY ("fixture_set_id") REFERENCES "fixture_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_fixture_set_id_fkey" FOREIGN KEY ("fixture_set_id") REFERENCES "fixture_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_fixture_round_id_fkey" FOREIGN KEY ("fixture_round_id") REFERENCES "fixture_rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_category_id_fkey" FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_entrants" ADD CONSTRAINT "match_entrants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_entrants" ADD CONSTRAINT "match_entrants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_entrants" ADD CONSTRAINT "match_entrants_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "match_entrants" ADD CONSTRAINT "match_entrants_one_real_entrant_or_bye_chk" CHECK (
    ("is_bye" = true AND "participant_id" IS NULL AND "team_id" IS NULL)
    OR
    ("is_bye" = false AND (("participant_id" IS NOT NULL AND "team_id" IS NULL) OR ("participant_id" IS NULL AND "team_id" IS NOT NULL)))
);
