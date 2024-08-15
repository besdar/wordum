import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Collection,
  CollectionItem,
  AddCollectionFormFields,
} from '../model/collection';
import {StorageKeys} from '../model/storage';
import {APISources} from '../model/apiSources';
import {
  createLearningCardsForCollectionItem,
  downloadVoice,
  getUUID,
} from '../lib/collection';

export const getCollection = (id: string): Promise<Collection> =>
  AsyncStorage.getItem(StorageKeys.COLLECTIONS + '_' + id).then(value =>
    JSON.parse(value || '{}'),
  );

export const getCollections = (): Promise<Collection[]> =>
  AsyncStorage.getAllKeys().then(result =>
    Promise.all(
      result
        .filter(key => key.startsWith(StorageKeys.COLLECTIONS))
        .flatMap(key =>
          getCollection(key.replace(StorageKeys.COLLECTIONS + '_', '')),
        ),
    ),
  );

export const deleteCollection = (id: string) =>
  AsyncStorage.removeItem(StorageKeys.COLLECTIONS + '_' + id);

export const saveCollection = (collection: Collection) =>
  AsyncStorage.setItem(
    StorageKeys.COLLECTIONS + '_' + collection.id,
    JSON.stringify(collection),
  ).then(() => collection);

export const updateCollection = (
  data: AddCollectionFormFields & Partial<Pick<Collection, 'id' | 'words'>>,
) =>
  saveCollection({
    id: getUUID(),
    words: [],
    ...data,
  });

export const addWordToCollection = async (
  collectionId: string,
  newItem: Omit<CollectionItem, 'learningType' | 'fsrsCard'>,
) => {
  const collection = await getCollection(collectionId);

  const sourceVoice = await downloadVoice(newItem.sourceVoice);
  const targetVoice = await downloadVoice(newItem.targetVoice);
  const newWordCards = await createLearningCardsForCollectionItem(
    newItem,
    collection.learningLanguage,
    sourceVoice,
    targetVoice,
  );

  return saveCollection({
    ...collection,
    words: [...collection.words, ...newWordCards],
  });
};

export const getAPISource = () =>
  AsyncStorage.getItem(StorageKeys.API_SOURCE).then(
    result => (result as APISources) || APISources.ReversoContextUnofficial,
  );
