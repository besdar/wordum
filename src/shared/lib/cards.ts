import {appSettings} from '../model/AppSettings';
import {LearningCard} from '../model/collection';

const filterListeningCards = (card: LearningCard) =>
  appSettings.getSetting('useExternalVoiceWhenAvailable')
    ? Boolean(card.sound)
    : true;

export const filterActualCards = (card: LearningCard) =>
  new Date(card.fsrsCard.due) < new Date() && filterListeningCards(card);
