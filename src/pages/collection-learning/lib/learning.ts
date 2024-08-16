import {Grade, Rating} from 'ts-fsrs';
import {
  CollectionItems,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';
import {Answers} from '../model/types';

export const getFsrsRatingFromUserAnswer = (
  answer: Answers,
  timeToRespond: number,
  learningType: LearningType,
  word: string,
): Grade => {
  if (answer === Answers.Incorrect) {
    return Rating.Again;
  }

  const typingTime =
    learningType !== LearningType.Flascards ? word.length * 250 : 0;
  if (typingTime + 7000 > timeToRespond) {
    return Rating.Easy;
  } else if (typingTime + 15000 > timeToRespond) {
    return Rating.Good;
  }

  return Rating.Hard;
};

const filterActualCards = (card: LearningCard) =>
  new Date(card.fsrsCard.due) < new Date();

export const getCardsToLearn = (cards: LearningCard[]) =>
  cards.filter(filterActualCards);

export const getWordsToLearn = (words: CollectionItems) =>
  Object.values(words).filter(cards => cards.some(filterActualCards));
