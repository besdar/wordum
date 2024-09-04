import {
  createLearningCardsForCollectionItem,
  getUUID,
} from '../../../shared/lib/collection';
import {
  CollectionFormFields,
  CollectionItems,
} from '../../../shared/model/collection';

export const parseTextToCollectionWords = (
  text: string,
  learningLanguage: CollectionFormFields['learningLanguage'],
  cardsToGenerate: CollectionFormFields['supportedLearningTypes'],
) =>
  text
    .split('\n')
    .filter(Boolean)
    .flat()
    .reduce<CollectionItems>((acc, line) => {
      const [value, translation] = line.split(';');

      const itemId = getUUID();
      acc[itemId] = createLearningCardsForCollectionItem(
        {
          wordId: itemId,
          value: value.trim(),
          translation: translation.trim(),
        },
        learningLanguage,
        cardsToGenerate,
      );

      return acc;
    }, {});
