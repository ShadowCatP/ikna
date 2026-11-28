import { calculateSm2Review, type Sm2State } from './sm2';

function createState(overrides: Partial<Sm2State> = {}): Sm2State {
  return { interval: 0, repetition: 0, easeFactor: 2.5, ...overrides };
}

function reviewDate(): Date {
  return new Date(2026, 0, 15, 10, 30, 45, 123);
}

describe('calculateSm2Review', () => {
  describe('successful reviews', () => {
    test.each([
      { quality: 3, easeFactor: 2.36 },
      { quality: 4, easeFactor: 2.5 },
      { quality: 5, easeFactor: 2.6 },
    ])(
      'schedules the first successful review for quality $quality',
      ({ quality, easeFactor }) => {
        const state = createState();
        const reviewedAt = reviewDate();

        const result = calculateSm2Review(state, quality, reviewedAt);

        expect(result).toEqual({
          interval: 1,
          repetition: 1,
          easeFactor: expect.closeTo(easeFactor, 10),
          quality,
          dueDate: new Date(2026, 0, 16, 10, 30, 45, 123),
          lastReviewedAt: reviewedAt,
        });
      }
    );

    it('uses a six-day interval for the second successful review', () => {
      const state = createState({
        interval: 1,
        repetition: 1,
        easeFactor: 2.6,
      });

      const result = calculateSm2Review(state, 5, reviewDate());

      expect(result.interval).toBe(6);
      expect(result.repetition).toBe(2);
      expect(result.easeFactor).toBeCloseTo(2.7, 10);
      expect(result.dueDate).toEqual(new Date(2026, 0, 21, 10, 30, 45, 123));
    });

    it('advances through consecutive successful reviews using the previous ease factor', () => {
      const initialState = createState();
      const reviewedAt = reviewDate();

      const first = calculateSm2Review(initialState, 5, reviewedAt);
      const second = calculateSm2Review(first, 5, first.dueDate);
      const third = calculateSm2Review(second, 5, second.dueDate);
      const fourth = calculateSm2Review(third, 5, third.dueDate);

      expect([
        first.interval,
        second.interval,
        third.interval,
        fourth.interval,
      ]).toEqual([1, 6, 16, 45]);
      expect([
        first.repetition,
        second.repetition,
        third.repetition,
        fourth.repetition,
      ]).toEqual([1, 2, 3, 4]);
      expect(first.easeFactor).toBeCloseTo(2.6, 10);
      expect(second.easeFactor).toBeCloseTo(2.7, 10);
      expect(third.easeFactor).toBeCloseTo(2.8, 10);
      expect(fourth.easeFactor).toBeCloseTo(2.9, 10);
      expect(fourth.dueDate).toEqual(new Date(2026, 2, 24, 10, 30, 45, 123));
    });
  });

  describe('quality ratings', () => {
    test.each([
      { quality: 0, easeFactor: 1.7, repetition: 0, interval: 1 },
      { quality: 1, easeFactor: 1.96, repetition: 0, interval: 1 },
      { quality: 2, easeFactor: 2.18, repetition: 0, interval: 1 },
      { quality: 3, easeFactor: 2.36, repetition: 5, interval: 25 },
      { quality: 4, easeFactor: 2.5, repetition: 5, interval: 25 },
      { quality: 5, easeFactor: 2.6, repetition: 5, interval: 25 },
    ])(
      'updates ease factor and progress for quality $quality',
      ({ quality, easeFactor, repetition, interval }) => {
        const state = createState({ interval: 10, repetition: 4 });

        const result = calculateSm2Review(state, quality, reviewDate());

        expect(result.quality).toBe(quality);
        expect(result.easeFactor).toBeCloseTo(easeFactor, 10);
        expect(result.repetition).toBe(repetition);
        expect(result.interval).toBe(interval);
      }
    );
  });

  describe('failed reviews and recovery', () => {
    test.each([0, 1, 2])(
      'resets an established review sequence for quality %s',
      (quality) => {
        const state = createState({ interval: 30, repetition: 7 });
        const reviewedAt = reviewDate();

        const result = calculateSm2Review(state, quality, reviewedAt);

        expect(result.repetition).toBe(0);
        expect(result.interval).toBe(1);
        expect(result.dueDate).toEqual(new Date(2026, 0, 16, 10, 30, 45, 123));
        expect(result.lastReviewedAt).toEqual(reviewedAt);
      }
    );

    it('restarts the one-day and six-day intervals after a failed review', () => {
      const state = createState({ interval: 30, repetition: 7 });

      const failed = calculateSm2Review(state, 2, reviewDate());
      const recovered = calculateSm2Review(failed, 4, failed.dueDate);
      const secondSuccess = calculateSm2Review(recovered, 4, recovered.dueDate);

      expect(failed.easeFactor).toBeCloseTo(2.18, 10);
      expect(recovered.repetition).toBe(1);
      expect(recovered.interval).toBe(1);
      expect(recovered.easeFactor).toBeCloseTo(2.18, 10);
      expect(secondSuccess.repetition).toBe(2);
      expect(secondSuccess.interval).toBe(6);
      expect(secondSuccess.easeFactor).toBeCloseTo(2.18, 10);
      expect(secondSuccess.dueDate).toEqual(
        new Date(2026, 0, 23, 10, 30, 45, 123)
      );
    });

    it('keeps progress reset across repeated failures', () => {
      const state = createState({ interval: 30, repetition: 7 });

      const first = calculateSm2Review(state, 0, reviewDate());
      const second = calculateSm2Review(first, 0, first.dueDate);

      expect(second.repetition).toBe(0);
      expect(second.interval).toBe(1);
      expect(second.easeFactor).toBe(1.3);
      expect(second.dueDate).toEqual(new Date(2026, 0, 17, 10, 30, 45, 123));
    });
  });

  describe('quality normalization', () => {
    test.each([
      { quality: -10, normalized: 0, easeFactor: 1.7, repetition: 0 },
      { quality: 10, normalized: 5, easeFactor: 2.6, repetition: 1 },
      { quality: -0.5, normalized: 0, easeFactor: 1.7, repetition: 0 },
      { quality: 0.49, normalized: 0, easeFactor: 1.7, repetition: 0 },
      { quality: 0.5, normalized: 1, easeFactor: 1.96, repetition: 0 },
      { quality: 2.49, normalized: 2, easeFactor: 2.18, repetition: 0 },
      { quality: 2.5, normalized: 3, easeFactor: 2.36, repetition: 1 },
      { quality: 4.49, normalized: 4, easeFactor: 2.5, repetition: 1 },
      { quality: 4.5, normalized: 5, easeFactor: 2.6, repetition: 1 },
      { quality: 5.5, normalized: 5, easeFactor: 2.6, repetition: 1 },
    ])(
      'normalizes quality $quality to $normalized before scheduling',
      ({ quality, normalized, easeFactor, repetition }) => {
        const state = createState();

        const result = calculateSm2Review(state, quality, reviewDate());

        expect(result.quality).toBe(normalized);
        expect(result.easeFactor).toBeCloseTo(easeFactor, 10);
        expect(result.repetition).toBe(repetition);
        expect(result.interval).toBe(1);
      }
    );
  });

  describe('ease factor and interval boundaries', () => {
    test.each([0, 1, 2, 3, 4])(
      'does not let ease factor drop below 1.3 for quality %s',
      (quality) => {
        const state = createState({ easeFactor: 1.3 });

        const result = calculateSm2Review(state, quality, reviewDate());

        expect(result.easeFactor).toBe(1.3);
      }
    );

    it('allows ease factor to increase from the lower bound', () => {
      const state = createState({ easeFactor: 1.3 });

      const result = calculateSm2Review(state, 5, reviewDate());

      expect(result.easeFactor).toBeCloseTo(1.4, 10);
    });

    test.each([
      { interval: 6, easeFactor: 1.4, expected: 8 },
      { interval: 3, easeFactor: 2.5, expected: 8 },
      { interval: 6, easeFactor: 1.3, expected: 8 },
      { interval: 0, easeFactor: 2.5, expected: 1 },
      { interval: -5, easeFactor: 2.5, expected: 1 },
    ])(
      'rounds and bounds interval $interval with ease factor $easeFactor to $expected days',
      ({ interval, easeFactor, expected }) => {
        const state = createState({ interval, easeFactor, repetition: 2 });

        const result = calculateSm2Review(state, 4, reviewDate());

        expect(result.interval).toBe(expected);
        expect(result.repetition).toBe(3);
      }
    );
  });

  describe('review dates', () => {
    test.each([
      {
        name: 'month end',
        reviewedAt: new Date(2026, 0, 31, 10, 30, 45, 123),
        dueDate: new Date(2026, 1, 1, 10, 30, 45, 123),
      },
      {
        name: 'year end',
        reviewedAt: new Date(2026, 11, 31, 10, 30, 45, 123),
        dueDate: new Date(2027, 0, 1, 10, 30, 45, 123),
      },
      {
        name: 'leap day',
        reviewedAt: new Date(2028, 1, 28, 10, 30, 45, 123),
        dueDate: new Date(2028, 1, 29, 10, 30, 45, 123),
      },
      {
        name: 'non-leap February',
        reviewedAt: new Date(2026, 1, 28, 10, 30, 45, 123),
        dueDate: new Date(2026, 2, 1, 10, 30, 45, 123),
      },
    ])(
      'schedules the next calendar day across $name',
      ({ reviewedAt, dueDate }) => {
        const state = createState();

        const result = calculateSm2Review(state, 4, reviewedAt);

        expect(result.dueDate).toEqual(dueDate);
        expect(result.lastReviewedAt).toEqual(reviewedAt);
      }
    );

    test.each([
      {
        name: 'the March clock-change date',
        reviewedAt: new Date(2026, 2, 28, 12, 30),
        dueDate: new Date(2026, 2, 29, 12, 30),
      },
      {
        name: 'the October clock-change date',
        reviewedAt: new Date(2026, 9, 24, 12, 30),
        dueDate: new Date(2026, 9, 25, 12, 30),
      },
    ])(
      'preserves local review time across $name',
      ({ reviewedAt, dueDate }) => {
        const state = createState();

        const result = calculateSm2Review(state, 4, reviewedAt);

        expect(result.dueDate).toEqual(dueDate);
        expect(result.lastReviewedAt).toEqual(reviewedAt);
      }
    );

    it('uses the current time when reviewedAt is omitted', () => {
      const state = createState();
      const now = reviewDate();
      jest.useFakeTimers();
      jest.setSystemTime(now);

      try {
        const result = calculateSm2Review(state, 4);

        expect(result.lastReviewedAt).toEqual(now);
        expect(result.dueDate).toEqual(new Date(2026, 0, 16, 10, 30, 45, 123));
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('input independence', () => {
    it('does not mutate the input state or review date', () => {
      const state = Object.freeze(createState({ interval: 6, repetition: 2 }));
      const reviewedAt = reviewDate();

      const result = calculateSm2Review(state, 5, reviewedAt);

      expect(state).toEqual({ interval: 6, repetition: 2, easeFactor: 2.5 });
      expect(reviewedAt).toEqual(new Date(2026, 0, 15, 10, 30, 45, 123));
      expect(result).not.toBe(state);
      expect(result.dueDate).toEqual(new Date(2026, 0, 30, 10, 30, 45, 123));
      expect(result.lastReviewedAt).not.toBe(reviewedAt);
      expect(result.dueDate).not.toBe(reviewedAt);
      expect(result.dueDate).not.toBe(result.lastReviewedAt);
    });

    it('returns independent results when called with the same inputs', () => {
      const state = createState();
      const reviewedAt = reviewDate();
      const first = calculateSm2Review(state, 4, reviewedAt);
      const second = calculateSm2Review(state, 4, reviewedAt);

      first.dueDate.setFullYear(2000);
      first.lastReviewedAt.setFullYear(2000);

      expect(second).toEqual({
        interval: 1,
        repetition: 1,
        easeFactor: 2.5,
        quality: 4,
        dueDate: new Date(2026, 0, 16, 10, 30, 45, 123),
        lastReviewedAt: new Date(2026, 0, 15, 10, 30, 45, 123),
      });
      expect(reviewedAt).toEqual(new Date(2026, 0, 15, 10, 30, 45, 123));
    });
  });
});
