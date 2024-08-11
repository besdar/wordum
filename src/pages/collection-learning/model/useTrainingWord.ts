import {useState, useMemo, useEffect} from 'react';
import {CollectionItem, LearningType} from '../../../shared/model/types';
import {fsrs} from 'ts-fsrs';
import {useQuery} from '../../../shared/lib/useQuery';
import {getFsrsRatingFromUserAnswer, getWordsToLearn} from '../lib/learning';
import {getCollection, saveCollection} from '../../../shared/api/async-storage';
import {Answers} from './types';

export const useTrainingWord = (collectionId: string) => {
  const learingInstance = useMemo(() => fsrs(), []);
  const [isItFinal, setIsItFinal] = useState(false);
  const [collectionItem, setCollectionItem] = useState<
    CollectionItem | undefined
  >();
  const [timer, setTimer] = useState(Date.now());
  const [wordsToLearn, setWordsToLearn] = useState<CollectionItem[]>([]);
  const {data: collection, isLoading} = useQuery({
    queryFn: () => getCollection(collectionId),
    initialData: undefined,
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
      learingInstance.next(
        collectionItem!.fsrsCard,
        Date.now(),
        getFsrsRatingFromUserAnswer(previousAnswer, Date.now() - timer),
        ({card}) => {
          collectionItem!.fsrsCard = card;
        },
      );
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
    isLoading,
    examples: collectionItem?.examples,
    learningType: collectionItem?.learningType,
    learningLanguage:
      collection?.learningLanguage === 'source'
        ? collection?.sourceLanguage
        : collection?.targetLanguage,
  };
};
