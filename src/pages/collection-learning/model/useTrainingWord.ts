import {useState, useMemo, useEffect} from 'react';
import {
  Collection,
  CollectionItem,
  LearningType,
} from '../../../shared/model/collection';
import {fsrs, Rating} from 'ts-fsrs';
import {getFsrsRatingFromUserAnswer, getWordsToLearn} from '../lib/learning';
import {saveCollection} from '../../../shared/api/storage';
import {Answers} from './types';

export const useTrainingWord = (collection: Collection) => {
  const learingInstance = useMemo(() => fsrs(), []);
  const [isItFinal, setIsItFinal] = useState(false);
  const [collectionItem, setCollectionItem] = useState<
    CollectionItem | undefined
  >();
  const [timer, setTimer] = useState(Date.now());
  const [wordsToLearn, setWordsToLearn] = useState<CollectionItem[]>([]);
  const [statistics, setStat] = useState({
    [Rating.Easy]: 0,
    [Rating.Hard]: 0,
    [Rating.Good]: 0,
    [Rating.Again]: 0,
  });

  useEffect(() => {
    if (collection?.words.length) {
      const result =
        getWordsToLearn(collection.words)
          .slice(0, collection.wordsToTrain)
          .sort(() => Math.random() - 0.5) || [];

      setWordsToLearn(result);
      setCollectionItem(result[0]);
      setTimer(Date.now());
    }
  }, [collection?.words, collection?.wordsToTrain]);

  const setNextTrainingWord = (previousAnswer: Answers) => {
    let words = wordsToLearn;
    if (previousAnswer !== Answers.SkipListening) {
      const grade = getFsrsRatingFromUserAnswer(
        previousAnswer,
        Date.now() - timer,
      );

      learingInstance.next(
        collectionItem!.fsrsCard,
        Date.now(),
        grade,
        ({card}) => {
          collectionItem!.fsrsCard = card;
        },
      );

      setStat(prev => ({...prev, [grade]: prev[grade] + 1}));
    } else {
      words = wordsToLearn.filter(
        ({learningType}) => learningType !== LearningType.Listening,
      );
      setWordsToLearn(words);
    }

    const filteredWords = getWordsToLearn(words);
    const nextWord = filteredWords[0];

    if (!nextWord) {
      setIsItFinal(true);

      if (wordsToLearn.length && collection) {
        saveCollection(collection);
      }
    }

    setCollectionItem(nextWord);
    setTimer(Date.now());
  };

  return {
    trainingWord: collectionItem?.value,
    setNextTrainingWord,
    translation: collectionItem?.translation,
    isItFinal,
    examples: collectionItem?.examples,
    learningType: collectionItem?.learningType,
    learningLanguage:
      collection?.learningLanguage === 'source'
        ? collection?.sourceLanguage
        : collection?.targetLanguage,
    statistics,
  };
};
