import {useState, useMemo, useEffect} from 'react';
import {
  Collection,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';
import {fsrs, Rating} from 'ts-fsrs';
import {
  getFsrsRatingFromUserAnswer,
  getCardsToLearn,
  getInitialWordsToLearn,
} from '../lib/learning';
import {Answers} from './types';
import {EVENT_TYPE, eventBus} from '../../../shared/model/EventBus';

export const useTrainingWord = (collection: Collection) => {
  const learningInstance = useMemo(() => fsrs(), []);
  const [isItFinal, setIsItFinal] = useState(false);
  const [learningCard, setLearningCard] = useState<LearningCard | undefined>();
  const [timer, setTimer] = useState(Date.now());
  const [wordsToLearn, setWordsToLearn] = useState<LearningCard[]>([]);
  const [wordsCount, setWordsCount] = useState(0);
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
    setTimer(Date.now());
  }, [collection]);

  const setNextTrainingWord = async (previousAnswer: Answers) => {
    let words = wordsToLearn;
    if ([Answers.Correct, Answers.Incorrect].includes(previousAnswer)) {
      const grade = getFsrsRatingFromUserAnswer(
        previousAnswer,
        Date.now() - timer,
        learningCard!.learningType,
        learningCard!.value,
      );

      // TODO: put this mutating inside Collection class
      learningInstance.next(
        learningCard!.fsrsCard,
        Date.now(),
        grade,
        ({card}) => {
          learningCard!.fsrsCard = card;
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
    setTimer(Date.now());
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
  };
};
