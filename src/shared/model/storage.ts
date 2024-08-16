import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUUID} from '../lib/collection';
import {
  Collection,
  AddCollectionFormFields,
  LearningType,
  LearningCard,
} from './collection';
import {unlink} from '@dr.pogodin/react-native-fs';

export enum StorageKeys {
  COLLECTIONS = 'COLLECTIONS',
  APP_SETTINGS = 'APP_SETTINGS',
}

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
    words: {},
    ...data,
  });

export const deleteCollectionItem = async (
  collectionItem: LearningCard,
  collection: Collection,
) => {
  if (!collection.words[collectionItem.id]) {
    return;
  }

  await saveCollection({
    ...collection,
    words: {
      ...collection.words,
      itemId: collection.words[collectionItem.id].filter(
        word => word.value !== collectionItem!.value,
      ),
    },
  });

  if (collectionItem?.learningType === LearningType.Listening) {
    if (collectionItem.value) {
      await unlink(collectionItem.value);
    }

    if (collectionItem.translation) {
      await unlink(collectionItem.translation);
    }
  } else {
    if (collectionItem?.sourceVoice) {
      await unlink(collectionItem.sourceVoice);
    }

    if (collectionItem?.targetVoice) {
      await unlink(collectionItem.targetVoice);
    }
  }
};
