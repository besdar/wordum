import {createEmptyCard, Rating} from 'ts-fsrs';
import {appSettings} from '../../../../shared/model/AppSettings';
import {
  Collection,
  LearningCard,
  LearningType,
} from '../../../../shared/model/collection';
import {Answers} from '../../model/types';
import {
  getCardsToLearn,
  getFsrsRatingFromUserAnswer,
  getInitialWordsToLearn,
} from '../learning';
import {filterActualCards} from '../../../../shared/lib/cards';

jest.mock('../../../../shared/lib/cards', () => ({
  filterActualCards: jest.fn(),
}));

jest.mock('../../../../shared/lib/message', () => ({
  showToastMessage: jest.fn(),
}));

describe('getFsrsRatingFromUserAnswer', () => {
  it('should return Rating.Again for incorrect answers', () => {
    const result = getFsrsRatingFromUserAnswer(
      Answers.Incorrect,
      1000,
      LearningType.Flascards,
      'test',
    );

    expect(result).toBe(Rating.Again);
  });

  it('should return Rating.Easy if time is sufficient', () => {
    jest.spyOn(appSettings, 'getSetting').mockImplementation(key => {
      if (key === 'timeTakenPerCharacterInput') return 100;
      if (key === 'timeGradeLimitEasy') return 1200;
      return 0;
    });

    const result = getFsrsRatingFromUserAnswer(
      Answers.Correct,
      1100,
      LearningType.Flascards,
      'test',
    );
    expect(result).toBe(Rating.Easy);
  });

  it('should return Rating.Good if time is moderate', () => {
    jest.spyOn(appSettings, 'getSetting').mockImplementation(key => {
      if (key === 'timeTakenPerCharacterInput') return 100;
      if (key === 'timeGradeLimitEasy') return 1200;
      if (key === 'timeGradeLimitGood') return 1400;
      return 0;
    });

    const result = getFsrsRatingFromUserAnswer(
      Answers.Correct,
      1300,
      LearningType.Flascards,
      'test',
    );
    expect(result).toBe(Rating.Good);
  });

  it('should return Rating.Hard if time is insufficient', () => {
    jest.spyOn(appSettings, 'getSetting').mockImplementation(key => {
      if (key === 'timeTakenPerCharacterInput') return 100;
      if (key === 'timeGradeLimitEasy') return 1200;
      if (key === 'timeGradeLimitGood') return 1000;
      return 0;
    });

    const result = getFsrsRatingFromUserAnswer(
      Answers.Correct,
      2000,
      LearningType.Flascards,
      'test',
    );
    expect(result).toBe(Rating.Hard);
  });
});

describe('getCardsToLearn', () => {
  it('should filter cards based on actual cards and supported learning types', () => {
    const cards: LearningCard[] = [
      {
        learningType: LearningType.Writing,
        translation: '',
        wordId: '1',
        value: '',
        fsrsCard: createEmptyCard(),
      },
      {
        learningType: LearningType.Flascards,
        translation: '',
        wordId: '2',
        value: '',
        fsrsCard: createEmptyCard(),
      },
    ];
    const supportedLearningTypes = [LearningType.Writing];

    (filterActualCards as jest.Mock).mockImplementation(() => true); // Mocking filterActualCards to always return true

    const result = getCardsToLearn(cards, supportedLearningTypes);
    expect(result).toEqual([cards[0]]);
  });
});

describe('getInitialWordsToLearn', () => {
  it('should return a shuffled list of cards to learn', () => {
    const collection = {
      getProperty: jest.fn(key => {
        if (key === 'supportedLearningTypes') return [LearningType.Writing];
        if (key === 'wordsToTrain') return 2;
        return [];
      }),
      getWordsToLearn: jest.fn(() => [
        [{learningType: LearningType.Writing}],
        [{learningType: LearningType.Flascards}],
      ]),
    } as unknown as Collection;

    (filterActualCards as jest.Mock).mockImplementation(() => true); // Mocking filterActualCards to always return true

    const result = getInitialWordsToLearn(collection);
    expect(result.length).toBe(1); // Only one card should be returned
    expect(result[0].learningType).toBe(LearningType.Writing); // Ensure the returned card is of the correct type
  });

  it('should return an empty array if no cards are available', () => {
    const collection = {
      getProperty: jest.fn(() => []),
      getWordsToLearn: jest.fn(() => []),
    } as unknown as Collection;

    const result = getInitialWordsToLearn(collection);
    expect(result).toEqual([]); // Should return an empty array
  });
});
