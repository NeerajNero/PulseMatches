-- Add generic manual scoring and result fields for generated fixtures.
ALTER TYPE "MatchStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS';
ALTER TYPE "MatchStatus" ADD VALUE IF NOT EXISTS 'COMPLETED';

ALTER TABLE "matches" ADD COLUMN "round_position" INTEGER;
ALTER TABLE "matches" ADD COLUMN "completed_at" TIMESTAMP(3);
ALTER TABLE "matches" ADD COLUMN "winner_participant_id" UUID;
ALTER TABLE "matches" ADD COLUMN "winner_team_id" UUID;
ALTER TABLE "matches" ADD COLUMN "result_notes" VARCHAR(500);

WITH ranked_matches AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "fixture_round_id"
      ORDER BY "match_number" ASC, "created_at" ASC, "id" ASC
    ) AS "position"
  FROM "matches"
)
UPDATE "matches"
SET "round_position" = ranked_matches."position"
FROM ranked_matches
WHERE "matches"."id" = ranked_matches."id";

ALTER TABLE "matches" ALTER COLUMN "round_position" SET NOT NULL;

CREATE TABLE "match_scores" (
  "id" UUID NOT NULL,
  "match_id" UUID NOT NULL,
  "match_entrant_id" UUID NOT NULL,
  "score" INTEGER NOT NULL,
  "is_winner" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "match_scores_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "match_scores_score_non_negative_chk" CHECK ("score" >= 0)
);

CREATE UNIQUE INDEX "matches_fixture_round_id_round_position_key" ON "matches"("fixture_round_id", "round_position");
CREATE INDEX "matches_completed_at_idx" ON "matches"("completed_at");
CREATE INDEX "matches_winner_participant_id_idx" ON "matches"("winner_participant_id");
CREATE INDEX "matches_winner_team_id_idx" ON "matches"("winner_team_id");
CREATE UNIQUE INDEX "match_scores_match_entrant_id_key" ON "match_scores"("match_entrant_id");
CREATE INDEX "match_scores_match_id_idx" ON "match_scores"("match_id");
CREATE INDEX "match_scores_match_entrant_id_idx" ON "match_scores"("match_entrant_id");
CREATE INDEX "match_scores_is_winner_idx" ON "match_scores"("is_winner");

ALTER TABLE "matches"
ADD CONSTRAINT "matches_winner_participant_id_fkey"
FOREIGN KEY ("winner_participant_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "matches"
ADD CONSTRAINT "matches_winner_team_id_fkey"
FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "match_scores"
ADD CONSTRAINT "match_scores_match_id_fkey"
FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "match_scores"
ADD CONSTRAINT "match_scores_match_entrant_id_fkey"
FOREIGN KEY ("match_entrant_id") REFERENCES "match_entrants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
