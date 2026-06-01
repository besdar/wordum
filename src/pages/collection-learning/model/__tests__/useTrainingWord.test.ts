import {renderHook} from '@testing-library/react-native';
import {act} from 'react';
import {createEmptyCard, fsrs, Rating} from 'ts-fsrs';
import {Collection, LearningCard} from '../../../../shared/model/collection';
import {EVENT_TYPE, eventBus} from '../../../../shared/model/EventBus';
import {LearningType} from '../../../../shared/model/learningType';
import {emotionalSupportCards} from '../../lib/emotional-support';
import {
  getCardsToLearn,
  getFsrsRatingFromUserAnswer,
  getInitialWordsToLearn,
} from '../../lib/learning';
import {Answers} from '../types';
import {useTrainingWord} from '../useTrainingWord';

// Mocking dependencies
jest.mock('../../lib/learning', () => ({
  getInitialWordsToLearn: jest.fn(),
  getCardsToLearn: jest.fn(),
  setLearningVoiceOfTheCollection: jest.fn(),
  getFsrsRatingFromUserAnswer: jest.fn(),
}));

describe('useTrainingWord', () => {
  const collection = {
    getProperty: jest.fn(),
    setCollectionItemForDeletion: jest.fn(),
    updateLearningCardFsrsCard: jest.fn(),
    saveCollection: jest.fn(),
  } as unknown as Collection;
  let learningCard: LearningCard;

  beforeEach(() => {
    learningCard = {
      wordId: '1',
      value: 'testWord',
      translation: 'testTranslation',
      learningType: LearningType.Listening,
      fsrsCard: createEmptyCard(),
    };

    (getCardsToLearn as jest.Mock).mockReturnValue([learningCard]);
    (getInitialWordsToLearn as jest.Mock).mockReturnValue([learningCard]);
    (collection.getProperty as jest.Mock).mockReturnValue('source');
    (collection.saveCollection as jest.Mock).mockResolvedValue(undefined);
    (getFsrsRatingFromUserAnswer as jest.Mock).mockReturnValue(Rating.Easy);
    (fsrs as jest.Mock).mockReturnValue({
      next: jest.fn(),
    });
  });

  it('should initialize with the first learning card', () => {
    const {result} = renderHook(() => useTrainingWord(collection));

    expect(result.current.trainingWord).toBe('testWord');
    expect(result.current.translation).toBe('testTranslation');
    expect(result.current.isItFinal).toBe(false);
  });

  it('should set the next training word correctly', async () => {
    const {result} = renderHook(() => useTrainingWord(collection));

    await act(() => result.current.setNextTrainingWord(Answers.Correct));

    expect(result.current.statistics[Rating.Easy]).toBe(1);
    expect(result.current.trainingWord).toBe('testWord'); // Assuming it remains the same for this test
  });

  it('should handle deletion of a word', async () => {
    const {result} = renderHook(() => useTrainingWord(collection));

    await act(() => result.current.setNextTrainingWord(Answers.Delete));

    expect(collection.setCollectionItemForDeletion).toHaveBeenCalledWith(
      learningCard,
    );
  });

  it('should handle skipping listening type', async () => {
    const {result} = renderHook(() => useTrainingWord(collection));

    (getCardsToLearn as jest.Mock).mockReturnValue([]);

    await act(() => result.current.setNextTrainingWord(Answers.SkipListening));

    expect(result.current.isItFinal).toBe(true); // Assuming it leads to final state
  });

  it('should show and hide emotional support cards during learning', async () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
    const {result} = renderHook(() => useTrainingWord(collection));

    await act(() => result.current.setNextTrainingWord(Answers.Correct));
    await act(() => result.current.setNextTrainingWord(Answers.Correct));
    await act(() => result.current.setNextTrainingWord(Answers.Correct));

    expect(result.current.emotionalSupportCard).toBe(emotionalSupportCards[0]);

    act(() => result.current.hideEmotionalSupportCard());

    expect(result.current.emotionalSupportCard).toBeUndefined();

    randomSpy.mockRestore();
  });

  it('should emit training finished event when no more words are left', async () => {
    jest.spyOn(eventBus, 'emit').mockImplementation();
    (getCardsToLearn as jest.Mock).mockReturnValue([]);

    const {result} = renderHook(() => useTrainingWord(collection));

    await act(() => result.current.setNextTrainingWord(Answers.Correct));

    expect(eventBus.emit).toHaveBeenCalledWith(EVENT_TYPE.TRAINING_FINISHED);
  });
});
