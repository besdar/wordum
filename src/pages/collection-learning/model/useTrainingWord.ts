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
  getWordsToLearn,
} from '../lib/learning';
import {Answers} from './types';
import {
  deleteCollectionItem,
  saveCollection,
} from '../../../shared/model/storage';

export const useTrainingWord = (collection: Collection) => {
  const learingInstance = useMemo(() => fsrs(), []);
  const [isItFinal, setIsItFinal] = useState(false);
  const [learningCard, setCollectionItem] = useState<
    LearningCard | undefined
  >();
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
    const listOfCardsMappedToWordsToLearn = getWordsToLearn(
      collection.words,
      collection.typesOfCardsToGenerate,
    )
      .slice(0, collection.wordsToTrain)
      .flat();

    const result = getCardsToLearn(
      listOfCardsMappedToWordsToLearn,
      collection.typesOfCardsToGenerate,
    ).sort(() => Math.random() - 0.5);

    setWordsToLearn(result);
    setCollectionItem(result[0]);
    setTimer(Date.now());
  }, [
    collection.typesOfCardsToGenerate,
    collection.words,
    collection.wordsToTrain,
  ]);

  const setNextTrainingWord = async (previousAnswer: Answers) => {
    let words = wordsToLearn;
    if ([Answers.Correct, Answers.Incorrect].includes(previousAnswer)) {
      const grade = getFsrsRatingFromUserAnswer(
        previousAnswer,
        Date.now() - timer,
        learningCard!.learningType,
        learningCard!.value,
      );

      learingInstance.next(
        learningCard!.fsrsCard,
        Date.now(),
        grade,
        ({card}) => {
          learningCard!.fsrsCard = card;
        },
      );

      setStat(prev => ({...prev, [grade]: prev[grade] + 1}));
    } else if (previousAnswer === Answers.Delete) {
      await deleteCollectionItem(learningCard as LearningCard, collection);

      words = words.filter(word => word.value !== learningCard!.value);
    } else if (previousAnswer === Answers.SkipListening) {
      words = wordsToLearn.filter(
        ({learningType}) => learningType !== LearningType.Listening,
      );
      setWordsToLearn(words);
    }

    const filteredWords = getCardsToLearn(
      words,
      collection.typesOfCardsToGenerate,
    );
    setWordsCount(words.length - filteredWords.length);
    const nextWord = filteredWords[0];

    if (!nextWord) {
      setIsItFinal(true);

      if (wordsToLearn.length && collection) {
        return saveCollection(collection);
      }
    }

    setCollectionItem(nextWord);
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
      collection?.learningLanguage === 'source'
        ? collection?.sourceLanguage
        : collection?.targetLanguage,
    statistics,
    progress: wordsCount / wordsToLearn.length,
  };
};
