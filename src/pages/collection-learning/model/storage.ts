import {translate} from '../../../shared/lib/i18n';
import {showToastMessage} from '../../../shared/lib/message';
import {
  Collection,
  LearningCard,
  TranslationResponse,
} from '../../../shared/model/collection';

export const addWordToCollection = async (
  collection: Collection,
  newItem: Pick<LearningCard, 'value' | keyof TranslationResponse>,
) => {
  if (collection.isWordInCollection(newItem.value)) {
    showToastMessage(translate('exist_word_message'));

    return collection;
  }

  return collection.addWord(newItem);
};
