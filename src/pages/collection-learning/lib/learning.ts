import {Grade, Rating} from 'ts-fsrs';
import {
  Collection,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';
import {Answers} from '../model/types';
import {appSettings} from '../../../shared/model/AppSettings';
import {filterActualCards} from '../../../shared/lib/cards';
import {setLearningVoice} from './sound';
import {showToastMessage} from '../../../shared/lib/message';
import {translate} from '../../../shared/lib/i18n';
import {ToastAndroid} from 'react-native';

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

export const getInitialWordsToLearn = (collection: Collection) => {
  const supportedLearningTypes = collection.getProperty(
    'supportedLearningTypes',
  );
  const listOfCardsMappedToWordsToLearn = collection
    .getWordsToLearn()
    .slice(0, collection.getProperty('wordsToTrain'))
    .flat();

  return getCardsToLearn(
    listOfCardsMappedToWordsToLearn,
    supportedLearningTypes,
  ).sort(() => Math.random() - 0.5);
};

export const setLearningVoiceOfTheCollection = (collection: Collection) => {
  const supportedLearningTypes = collection.getProperty(
    'supportedLearningTypes',
  );

  if (
    supportedLearningTypes.includes(LearningType.Listening) &&
    !appSettings.getSetting('useExternalVoiceWhenAvailable')
  ) {
    setLearningVoice(collection.getLearningLanguage()).catch(() =>
      showToastMessage(
        translate('voice_is_not_set_message'),
        ToastAndroid.LONG,
      ),
    );
  }
};
