import {getCollection, saveCollection} from '../../../shared/model/storage';
import {
  downloadVoice,
  createLearningCardsForCollectionItem,
  getUUID,
} from '../../../shared/lib/collection';
import {translate} from '../../../shared/lib/i18n';
import {showToastMessage} from '../../../shared/lib/message';
import {LearningCard, LearningType} from '../../../shared/model/collection';

export const addWordToCollection = async (
  collectionId: string,
  newItem: Omit<LearningCard, 'learningType' | 'fsrsCard' | 'collectionId'>,
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
  const isListeningIncludedInGeneration =
    collection.typesOfCardsToGenerate.includes(LearningType.Listening);
  const sourceVoice = isListeningIncludedInGeneration
    ? await downloadVoice(newItem.sourceVoice)
    : undefined;
  const targetVoice = isListeningIncludedInGeneration
    ? await downloadVoice(newItem.targetVoice)
    : undefined;
  const newWordCards = await createLearningCardsForCollectionItem(
    {
      ...newItem,
      collectionId: itemId,
    },
    collection.learningLanguage,
    collection.typesOfCardsToGenerate,
    sourceVoice,
    targetVoice,
  );

  return saveCollection({
    ...collection,
    words: {...collection.words, [itemId]: newWordCards},
  });
};
