-- AlterTable
ALTER TABLE "card_review_states" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "decks" ADD COLUMN     "deleted_at" TIMESTAMP(3);
