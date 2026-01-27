import {appSettings} from '../../model/AppSettings';
import {LearningCard, LearningType} from '../../model/collection';
import {filterActualCards} from '../cards';

jest.mock('../../model/AppSettings', () => ({
  appSettings: {
    getSetting: jest.fn(),
  },
}));

const mockCard: LearningCard = {
  wordId: 'id',
  learningType: LearningType.Flascards,
  value: 'test',
  translation: 'translation',
  fsrsCard: {
    stability: 1,
    difficulty: 1,
    elapsed_days: 1,
    scheduled_days: 1,
    reps: 1,
    lapses: 1,
    state: 1,
    due: new Date(Date.now() - 1000 * 60 * 60 * 24),
    // FSRSParameters.learning_steps array is ["1m", "10m"] (i.e. repeating intervals) and learning_steps here is an index of that array
    learning_steps: 0,
  },
  sound: 'someSound.mp3',
};

describe('filterActualCards', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for a card that is due and has sound', () => {
    (appSettings.getSetting as jest.Mock).mockReturnValue(true);

    expect(filterActualCards(mockCard)).toBe(true);
  });

  it('should return false for a card that is due but has no sound', () => {
    (appSettings.getSetting as jest.Mock).mockReturnValue(true);
    const cardWithoutSound: LearningCard = {...mockCard, sound: undefined};

    expect(filterActualCards(cardWithoutSound)).toBe(false);
  });

  it('should return false for a card that is not due', () => {
    const cardNotDue: LearningCard = {
      ...mockCard,
      fsrsCard: {
        ...mockCard.fsrsCard,
        due: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      sound: 'someSound.mp3',
    };
    (appSettings.getSetting as jest.Mock).mockReturnValue(true);

    expect(filterActualCards(cardNotDue)).toBe(false);
  });
});
