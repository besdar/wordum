import {createEmptyCard} from 'ts-fsrs';
import {
  LearningType,
  LearningCard,
  CollectionFormFields,
} from '../model/collection';

export const getUUID = () => Math.random().toString(16).slice(2);

export const createLearningCardsForCollectionItem = (
  newItem: Omit<LearningCard, 'learningType' | 'fsrsCard'>,
  learningLanguage: CollectionFormFields['learningLanguage'],
  cardsToGenerate: CollectionFormFields['supportedLearningTypes'],
) => {
  const cards: LearningCard[] = [];
  const isLearningSourceLanguage = learningLanguage === 'source';

  const learningValue = isLearningSourceLanguage
    ? newItem.value
    : newItem.translation;

  if (cardsToGenerate.includes(LearningType.Flascards)) {
    cards.push(
      {
        wordId: newItem.wordId,
        value: newItem.value,
        translation: newItem.translation,
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
      },
      {
        wordId: newItem.wordId,
        value: newItem.translation,
        translation: newItem.value,
        fsrsCard: createEmptyCard(),
        examples: newItem.examples,
        learningType: LearningType.Flascards,
      },
    );
  }

  if (cardsToGenerate.includes(LearningType.Writing)) {
    cards.push({
      wordId: newItem.wordId,
      value: learningValue,
      translation: isLearningSourceLanguage
        ? newItem.translation
        : newItem.value,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Writing,
    });
  }

  if (cardsToGenerate.includes(LearningType.Listening)) {
    const audioCards: LearningCard[] = [];
    const audioCard: LearningCard = {
      wordId: newItem.wordId,
      value: learningValue,
      translation: isLearningSourceLanguage
        ? newItem.translation
        : newItem.value,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Listening,
    };

    const learningValues = learningValue.split(',').map(el => el.trim());
    if (!isLearningSourceLanguage && learningValues.length > 1) {
      audioCards.push(
        ...learningValues.map(separateLearningValue => ({
          ...audioCard,
          value: separateLearningValue,
        })),
      );
    } else {
      audioCards.push(audioCard);
    }

    cards.push(...audioCards);
  }

  return cards;
};
