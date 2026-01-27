import {LearningCard} from '../model/collection';

export const filterActualCards = (card: LearningCard) =>
  new Date(card.fsrsCard.due) < new Date();
