import {useState, useMemo, useEffect} from 'react';
import {fsrs, Rating} from 'ts-fsrs';
import {Collection, LearningCard} from '../../../shared/model/collection';
import {EVENT_TYPE, eventBus} from '../../../shared/model/EventBus';
import {LearningType} from '../../../shared/model/learningType';
import {
  getRandomEmotionalSupportCard,
  shouldShowEmotionalSupportCard,
} from '../lib/emotional-support';
import {
  getFsrsRatingFromUserAnswer,
  getCardsToLearn,
  getInitialWordsToLearn,
} from '../lib/learning';
import {Answers} from './types';
import type {EmotionalSupportCard} from './types';

export const useTrainingWord = (collection: Collection) => {
  const learningInstance = useMemo(() => fsrs(), []);
  const [isItFinal, setIsItFinal] = useState(false);
  const [learningCard, setLearningCard] = useState<LearningCard | undefined>();
  const [timer, setTimer] = useState(Date.now());
  const [wordsToLearn, setWordsToLearn] = useState<LearningCard[]>([]);
  const [wordsCount, setWordsCount] = useState(0);
  const [answeredCardsSinceSupportCard, setAnsweredCardsSinceSupportCard] =
    useState(0);
  const [emotionalSupportCard, setEmotionalSupportCard] =
    useState<EmotionalSupportCard>();
  const [statistics, setStat] = useState({
    [Rating.Easy]: 0,
    [Rating.Hard]: 0,
    [Rating.Good]: 0,
    [Rating.Again]: 0,
  });

  useEffect(() => {
    const initilaWordsToLearn = getInitialWordsToLearn(collection);

    setWordsToLearn(initilaWordsToLearn);
    setLearningCard(initilaWordsToLearn[0]);
    setIsItFinal(!initilaWordsToLearn[0]);
    setAnsweredCardsSinceSupportCard(0);
    setEmotionalSupportCard(undefined);
    setTimer(Date.now());
  }, [collection]);

  const hideEmotionalSupportCard = () => {
    setEmotionalSupportCard(undefined);
    setTimer(Date.now());
  };

  const setNextTrainingWord = async (previousAnswer: Answers) => {
    let words = wordsToLearn;
    const isCardAnswered = [Answers.Correct, Answers.Incorrect].includes(
      previousAnswer,
    );
    if (isCardAnswered) {
      const grade = getFsrsRatingFromUserAnswer(
        previousAnswer,
        Date.now() - timer,
        learningCard!.learningType,
        learningCard!.value,
      );

      learningInstance.next(
        learningCard!.fsrsCard,
        Date.now(),
        grade,
        ({card}) => {
          collection.updateLearningCardFsrsCard(learningCard!, card);
        },
      );

      setStat(prev => ({...prev, [grade]: prev[grade] + 1}));
    } else if (previousAnswer === Answers.Delete) {
      collection.setCollectionItemForDeletion(learningCard as LearningCard);

      words = words.filter(word => word.value !== learningCard!.value);
    } else if (previousAnswer === Answers.SkipListening) {
      words = wordsToLearn.filter(
        ({learningType}) => learningType !== LearningType.Listening,
      );
      setWordsToLearn(words);
    }

    const filteredWords = getCardsToLearn(
      words,
      collection.getProperty('supportedLearningTypes'),
    );
    setWordsCount(words.length - filteredWords.length);

    const nextWord = filteredWords[0];
    if (!nextWord) {
      setIsItFinal(true);

      if (wordsToLearn.length) {
        return collection
          .saveCollection()
          .then(() => eventBus.emit(EVENT_TYPE.TRAINING_FINISHED));
      }
    }

    setLearningCard(nextWord);
    const nextAnsweredCardsSinceSupportCard = isCardAnswered
      ? answeredCardsSinceSupportCard + 1
      : answeredCardsSinceSupportCard;

    if (
      isCardAnswered &&
      shouldShowEmotionalSupportCard(nextAnsweredCardsSinceSupportCard)
    ) {
      setAnsweredCardsSinceSupportCard(0);
      setEmotionalSupportCard(getRandomEmotionalSupportCard());
    } else {
      setAnsweredCardsSinceSupportCard(nextAnsweredCardsSinceSupportCard);
      setEmotionalSupportCard(undefined);
      setTimer(Date.now());
    }
  };

  return {
    trainingWord: learningCard?.value,
    setNextTrainingWord,
    translation: learningCard?.translation,
    isItFinal,
    examples: learningCard?.examples,
    learningType: learningCard?.learningType,
    learningLanguage:
      collection.getProperty('learningLanguage') === 'source'
        ? collection.getProperty('sourceLanguage')
        : collection.getProperty('targetLanguage'),
    statistics,
    progress: Number((wordsCount / wordsToLearn.length).toFixed(2)),
    emotionalSupportCard,
    hideEmotionalSupportCard,
  };
};
