import {createLearningCardsForCollectionItem} from '../../../shared/lib/collection';
import {Collection} from '../../../shared/model/collection';

export const parseTextToCollectionWords = (
  text: string,
  learningLanguage: Collection['learningLanguage'],
) =>
  text
    .split('\n')
    .filter(Boolean)
    .flatMap(line => {
      const [value, translation] = line.split(';');

      return createLearningCardsForCollectionItem(
        {
          value: value.trim(),
          translation: translation.trim(),
        },
        learningLanguage,
      );
    });
