import {useState, useMemo, useEffect} from 'react';
import {CollectionItem} from '../../../shared/model/types';
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
  const {data: collection, isLoading} = useQuery({
    queryFn: () => getCollection(collectionId),
    initialData: undefined,
  });

  const wordsToLearn = useMemo(() => {
    if (!collection?.words.length) {
      return [];
    }

    const result =
      getWordsToLearn(collection.words)
        .slice(0, collection.wordsToTrain)
        .sort(() => Math.random() - 0.5) || [];

    setCollectionItem(result[0]);
    setTimer(Date.now());

    return result;
  }, [collection]);

  useEffect(() => {
    if (isItFinal && wordsToLearn.length && collection) {
      saveCollection(collection);
    }
  }, [collection, isItFinal, wordsToLearn.length]);

  const setNextTrainingWord = (previousAnswer: Answers) => {
    learingInstance.next(
      collectionItem!.fsrsCard,
      Date.now(),
      getFsrsRatingFromUserAnswer(previousAnswer, Date.now() - timer),
      ({card}) => {
        collectionItem!.fsrsCard = card;
      },
    );
    const filteredWords = getWordsToLearn(wordsToLearn);
    const nextWord = filteredWords[0];

    if (!nextWord) {
      setIsItFinal(true);
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
  };
};
