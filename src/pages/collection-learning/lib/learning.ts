import {Grade, Rating} from 'ts-fsrs';
import {CollectionItem} from '../../../shared/model/collection';
import {Answers} from '../model/types';

export const getFsrsRatingFromUserAnswer = (
  answer: Answers,
  timeToRespond: number,
): Grade => {
  if (answer === Answers.Incorrect) {
    return Rating.Again;
  }

  if (timeToRespond < 5000) {
    return Rating.Easy;
  } else if (timeToRespond < 15000) {
    return Rating.Good;
  }

  return Rating.Hard;
};

export const getWordsToLearn = (words: CollectionItem[]) =>
  words.filter(word => new Date(word.fsrsCard.due) < new Date());
