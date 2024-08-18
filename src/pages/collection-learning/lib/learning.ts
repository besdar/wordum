import {Grade, Rating} from 'ts-fsrs';
import {
  CollectionItems,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';
import {Answers} from '../model/types';
import {appSettings} from '../../../shared/model/AppSettings';

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
    learningType !== LearningType.Flascards
      ? word.length * appSettings.getSetting('timeTakenPerCharacterInput')
      : 0;
  if (
    typingTime + appSettings.getSetting('timeGradeLimitEasy') >
    timeToRespond
  ) {
    return Rating.Easy;
  } else if (
    typingTime + appSettings.getSetting('timeGradeLimitGood') >
    timeToRespond
  ) {
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
