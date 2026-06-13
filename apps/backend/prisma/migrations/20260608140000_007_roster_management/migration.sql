-- CreateEnum
CREATE TYPE "ParticipantSource" AS ENUM ('REGISTRATION', 'MANUAL');

-- CreateEnum
CREATE TYPE "RosterParticipantStatus" AS ENUM ('ACTIVE', 'WITHDRAWN', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('ACTIVE', 'WITHDRAWN', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('CAPTAIN', 'PLAYER', 'SUBSTITUTE');

-- CreateTable
CREATE TABLE "participants" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "tournament_category_id" UUID,
    "registration_id" UUID,
    "user_id" UUID,
    "display_name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(320),
    "phone" VARCHAR(40),
    "source" "ParticipantSource" NOT NULL,
    "status" "RosterParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "tournament_id" UUID NOT NULL,
    "tournament_category_id" UUID,
    "name" VARCHAR(180) NOT NULL,
    "status" "TeamStatus" NOT NULL DEFAULT 'ACTIVE',
    "seed" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" UUID NOT NULL,
    "team_id" UUID NOT NULL,
    "participant_id" UUID,
    "user_id" UUID,
    "display_name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(320),
    "phone" VARCHAR(40),
    "role" "TeamMemberRole" NOT NULL DEFAULT 'PLAYER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_registration_id_key" ON "participants"("registration_id");

-- CreateIndex
CREATE INDEX "participants_tournament_id_idx" ON "participants"("tournament_id");

-- CreateIndex
CREATE INDEX "participants_tournament_id_status_idx" ON "participants"("tournament_id", "status");

-- CreateIndex
CREATE INDEX "participants_tournament_category_id_idx" ON "participants"("tournament_category_id");

-- CreateIndex
CREATE INDEX "participants_registration_id_idx" ON "participants"("registration_id");

-- CreateIndex
CREATE INDEX "participants_user_id_idx" ON "participants"("user_id");

-- CreateIndex
CREATE INDEX "participants_status_idx" ON "participants"("status");

-- CreateIndex
CREATE INDEX "teams_tournament_id_idx" ON "teams"("tournament_id");

-- CreateIndex
CREATE INDEX "teams_tournament_id_status_idx" ON "teams"("tournament_id", "status");

-- CreateIndex
CREATE INDEX "teams_tournament_category_id_idx" ON "teams"("tournament_category_id");

-- CreateIndex
CREATE INDEX "teams_status_idx" ON "teams"("status");

-- CreateIndex
CREATE UNIQUE INDEX "teams_tournament_id_tournament_category_id_name_key" ON "teams"("tournament_id", "tournament_category_id", "name");

-- CreateIndex
CREATE INDEX "team_members_team_id_idx" ON "team_members"("team_id");

-- CreateIndex
CREATE INDEX "team_members_participant_id_idx" ON "team_members"("participant_id");

-- CreateIndex
CREATE INDEX "team_members_user_id_idx" ON "team_members"("user_id");

-- CreateIndex
CREATE INDEX "team_members_role_idx" ON "team_members"("role");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_team_id_participant_id_key" ON "team_members"("team_id", "participant_id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_tournament_category_id_fkey" FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "registrations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_category_id_fkey" FOREIGN KEY ("tournament_category_id") REFERENCES "tournament_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
