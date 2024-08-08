import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Collection,
  CollectionItem,
  StorageKeys,
  AddCollectionFormFields,
} from '../model/types';
import {createEmptyCard} from 'ts-fsrs';

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

export const createCollection = (data: AddCollectionFormFields) =>
  saveCollection({
    id: Math.random().toString(16).slice(2),
    words: [],
    ...data,
  });

export const addWordToCollection = async (
  collectionId: string,
  newItem: CollectionItem,
) => {
  const collection = await getCollection(collectionId);

  return saveCollection({
    ...collection,
    words: [
      ...collection.words,
      newItem,
      {
        value: newItem.translation,
        translation: newItem.value,
        fsrsCard: createEmptyCard(),
        examples: newItem.examples,
      },
    ],
  });
};
