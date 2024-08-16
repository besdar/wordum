import {getCollection, saveCollection} from '../../../shared/model/storage';
import {
  downloadVoice,
  createLearningCardsForCollectionItem,
  getUUID,
} from '../../../shared/lib/collection';
import {translate} from '../../../shared/lib/i18n';
import {showToastMessage} from '../../../shared/lib/message';
import {LearningCard} from '../../../shared/model/collection';

export const addWordToCollection = async (
  collectionId: string,
  newItem: Omit<LearningCard, 'learningType' | 'fsrsCard' | 'id'>,
) => {
  const collection = await getCollection(collectionId);

  if (
    Object.values(collection.words)
      .flat()
      .find(({value}) => newItem.value === value)
  ) {
    showToastMessage(translate('exist_word_message'));

    return collection;
  }

  const itemId = getUUID();
  const sourceVoice = await downloadVoice(newItem.sourceVoice);
  const targetVoice = await downloadVoice(newItem.targetVoice);
  const newWordCards = await createLearningCardsForCollectionItem(
    {
      ...newItem,
      id: itemId,
    },
    collection.learningLanguage,
    sourceVoice,
    targetVoice,
  );

  return saveCollection({
    ...collection,
    words: {...collection.words, [itemId]: newWordCards},
  });
};
