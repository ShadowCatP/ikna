const MIN_EASE_FACTOR = 1.3;
const MIN_QUALITY = 0;
const MAX_QUALITY = 5;

export type Sm2State = {
  interval: number;
  repetition: number;
  easeFactor: number;
};

export type Sm2Review = Sm2State & {
  quality: number;
  dueDate: Date;
  lastReviewedAt: Date;
};

export function calculateSm2Review(
  state: Sm2State,
  quality: number,
  reviewedAt = new Date()
): Sm2Review {
  const normalizedQuality = Math.max(
    MIN_QUALITY,
    Math.min(MAX_QUALITY, Math.round(quality))
  );
  const nextEaseFactor = Math.max(
    MIN_EASE_FACTOR,
    state.easeFactor +
      (0.1 - (5 - normalizedQuality) * (0.08 + (5 - normalizedQuality) * 0.02))
  );
  const nextRepetition = normalizedQuality < 3 ? 0 : state.repetition + 1;
  let nextInterval: number;

  if (normalizedQuality < 3) {
    nextInterval = 1;
  } else if (nextRepetition === 1) {
    nextInterval = 1;
  } else if (nextRepetition === 2) {
    nextInterval = 6;
  } else {
    nextInterval = Math.max(1, Math.round(state.interval * state.easeFactor));
  }
  const dueDate = new Date(reviewedAt);
  dueDate.setDate(dueDate.getDate() + nextInterval);

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    easeFactor: nextEaseFactor,
    quality: normalizedQuality,
    dueDate,
    lastReviewedAt: new Date(reviewedAt),
  };
}
