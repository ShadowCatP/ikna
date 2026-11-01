-- DropForeignKey
ALTER TABLE "card_review_states" DROP CONSTRAINT IF EXISTS "card_review_states_card_id_fkey";

-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT IF EXISTS "cards_deck_id_fkey";

-- DropForeignKey
ALTER TABLE "decks" DROP CONSTRAINT IF EXISTS "decks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "review_logs" DROP CONSTRAINT IF EXISTS "review_logs_user_id_fkey";

-- Cast existing UUID strings in place. Existing primary keys and indexes remain intact.
ALTER TABLE "card_review_states"
  ALTER COLUMN "card_id" TYPE UUID USING "card_id"::uuid,
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid;

ALTER TABLE "cards"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "deck_id" TYPE UUID USING "deck_id"::uuid;

ALTER TABLE "decks"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid;

ALTER TABLE "review_logs"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid,
  ALTER COLUMN "card_id" TYPE UUID USING "card_id"::uuid;

ALTER TABLE "user_profiles"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid;

-- AddForeignKey
ALTER TABLE "decks" ADD CONSTRAINT "decks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_review_states" ADD CONSTRAINT "card_review_states_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
