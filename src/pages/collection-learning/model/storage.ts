import {saveCollection} from '../../../shared/model/storage';
import {
  downloadVoice,
  createLearningCardsForCollectionItem,
  getUUID,
} from '../../../shared/lib/collection';
import {translate} from '../../../shared/lib/i18n';
import {showToastMessage} from '../../../shared/lib/message';
import {
  Collection,
  LearningCard,
  LearningType,
} from '../../../shared/model/collection';

export const addWordToCollection = async (
  collection: Collection,
  newItem: Omit<LearningCard, 'learningType' | 'fsrsCard' | 'collectionId'>,
) => {
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
