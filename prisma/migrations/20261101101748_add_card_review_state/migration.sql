-- CreateTable
CREATE TABLE "card_review_states" (
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "repetition" INTEGER NOT NULL DEFAULT 0,
    "ease_factor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "due_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_reviewed_at" TIMESTAMP(3),

    CONSTRAINT "card_review_states_pkey" PRIMARY KEY ("card_id")
);

-- CreateIndex
CREATE INDEX "card_review_states_user_id_due_date_idx" ON "card_review_states"("user_id", "due_date");

-- AddForeignKey
ALTER TABLE "card_review_states" ADD CONSTRAINT "card_review_states_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
