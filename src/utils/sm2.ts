const MIN_EASE_FACTOR = 1.3;
const MAX_SM2_QUALITY = 5;
const MIN_SUCCESS_SM2_QUALITY = 3;
const INITIAL_REPETITION = 0;
const REPETITION_INCREMENT = 1;
const MIN_INTERVAL_DAYS = 1;
const FIRST_REVIEW_INTERVAL_DAYS = 1;
const SECOND_REVIEW_INTERVAL_DAYS = 6;
const EASE_FACTOR_INCREMENT = 0.1;
const EASE_FACTOR_PENALTY_BASE = 0.08;
const EASE_FACTOR_PENALTY_STEP = 0.02;

enum ReviewRepetition {
  First = 1,
  Second = 2,
}

export enum ReviewQuality {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

const SM2_QUALITY_BY_RATING: Record<ReviewQuality, number> = {
  [ReviewQuality.Again]: 0,
  [ReviewQuality.Hard]: 3,
  [ReviewQuality.Good]: 4,
  [ReviewQuality.Easy]: 5,
};

export type Sm2State = {
  interval: number;
  repetition: number;
  easeFactor: number;
};

export type Sm2Review = Sm2State & {
  quality: ReviewQuality;
  dueDate: Date;
  lastReviewedAt: Date;
};

function calculateNextEaseFactor(easeFactor: number, quality: number): number {
  return Math.max(
    MIN_EASE_FACTOR,
    easeFactor +
      (EASE_FACTOR_INCREMENT -
        (MAX_SM2_QUALITY - quality) *
          (EASE_FACTOR_PENALTY_BASE +
            (MAX_SM2_QUALITY - quality) * EASE_FACTOR_PENALTY_STEP))
  );
}

function calculateNextRepetition(repetition: number, quality: number): number {
  return quality < MIN_SUCCESS_SM2_QUALITY
    ? INITIAL_REPETITION
    : repetition + REPETITION_INCREMENT;
}

function calculateNextInterval(
  state: Sm2State,
  quality: number,
  repetition: number
): number {
  if (quality < MIN_SUCCESS_SM2_QUALITY) {
    return MIN_INTERVAL_DAYS;
  }
  if (repetition === ReviewRepetition.First) {
    return FIRST_REVIEW_INTERVAL_DAYS;
  }
  if (repetition === ReviewRepetition.Second) {
    return SECOND_REVIEW_INTERVAL_DAYS;
  }

  return Math.max(
    MIN_INTERVAL_DAYS,
    Math.round(state.interval * state.easeFactor)
  );
}

function calculateDueDate(reviewedAt: Date, interval: number): Date {
  const dueDate = new Date(reviewedAt);
  dueDate.setDate(dueDate.getDate() + interval);
  return dueDate;
}

export function calculateSm2Review(
  state: Sm2State,
  quality: ReviewQuality,
  reviewedAt = new Date()
): Sm2Review {
  const sm2Quality = SM2_QUALITY_BY_RATING[quality];
  const nextEaseFactor = calculateNextEaseFactor(state.easeFactor, sm2Quality);
  const nextRepetition = calculateNextRepetition(state.repetition, sm2Quality);
  const nextInterval = calculateNextInterval(state, sm2Quality, nextRepetition);

  return {
    interval: nextInterval,
    repetition: nextRepetition,
    easeFactor: nextEaseFactor,
    quality,
    dueDate: calculateDueDate(reviewedAt, nextInterval),
    lastReviewedAt: new Date(reviewedAt),
  };
}
