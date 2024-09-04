import {Grade, Rating} from 'ts-fsrs';
import {LearningCard, LearningType} from '../../../shared/model/collection';
import {Answers} from '../model/types';
import {appSettings} from '../../../shared/model/AppSettings';
import {filterActualCards} from '../../../shared/lib/cards';

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

export const getCardsToLearn = (
  cards: LearningCard[],
  supportedLearningTypes: readonly LearningType[],
) =>
  cards.filter(
    card =>
      filterActualCards(card) &&
      supportedLearningTypes.includes(card.learningType),
  );
