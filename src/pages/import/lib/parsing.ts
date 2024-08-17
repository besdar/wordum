import {
  createLearningCardsForCollectionItem,
  getUUID,
} from '../../../shared/lib/collection';
import {Collection, CollectionItems} from '../../../shared/model/collection';

export const parseTextToCollectionWords = (
  text: string,
  learningLanguage: Collection['learningLanguage'],
  cardsToGenerate: Collection['typesOfCardsToGenerate'],
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
          collectionId: itemId,
          value: value.trim(),
          translation: translation.trim(),
        },
        learningLanguage,
        cardsToGenerate,
      );

      return acc;
    }, {});
