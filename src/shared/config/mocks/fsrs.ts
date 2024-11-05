jest.mock('ts-fsrs', () => ({
  Rating: jest.requireActual('ts-fsrs').Rating,
  createEmptyCard: jest.fn(() => ({
    stability: 1,
    difficulty: 1,
    elapsed_days: 1,
    scheduled_days: 1,
    reps: 1,
    lapses: 1,
    state: 1,
    due: new Date(),
  })),
  fsrs: jest.fn(),
}));
