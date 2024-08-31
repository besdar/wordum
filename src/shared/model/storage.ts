import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUUID} from '../lib/collection';
import {
  Collection,
  CollectionFormFields,
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

const deleteCollectionItemFiles = async (collectionItem: LearningCard) => {
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

export const deleteCollection = (collection: Collection) =>
  Promise.all(
    Object.values(collection.words).flat().map(deleteCollectionItemFiles),
  ).finally(() =>
    AsyncStorage.removeItem(StorageKeys.COLLECTIONS + '_' + collection.id),
  );

export const saveCollection = (collection: Collection) =>
  AsyncStorage.setItem(
    StorageKeys.COLLECTIONS + '_' + collection.id,
    JSON.stringify(collection),
  ).then(() => collection);

export const updateCollection = (
  data: CollectionFormFields & Partial<Pick<Collection, 'id'>>,
) => {
  // const dataToSave: Omit<typeof data, 'cardsForDeletion'> & {
  //   cardsForDeletion?: CollectionFormFields['cardsForDeletion'];
  // } = data;

  // if (Object.keys(data.words).length && data.cardsForDeletion.length) {
  //   data.cardsForDeletion.forEach(card => {
  //     dataToSave.words[card.collectionId] = dataToSave.words[
  //       card.collectionId
  //     ].filter(oldCard => oldCard.value !== card.value);

  //     deleteCollectionItemFiles(card);
  //   });
  // }

  // delete dataToSave.cardsForDeletion;

  return saveCollection({
    id: getUUID(),
    ...data,
  });
};

export const deleteCollectionItem = async (
  collectionItem: LearningCard,
  collection: Collection,
) => {
  if (!collection.words[collectionItem.collectionId]) {
    return;
  }

  await saveCollection({
    ...collection,
    words: {
      ...collection.words,
      itemId: collection.words[collectionItem.collectionId].filter(
        word => word.value !== collectionItem!.value,
      ),
    },
  });

  return deleteCollectionItemFiles(collectionItem);
};

export const getDataExport = () =>
  AsyncStorage.getAllKeys().then(keys =>
    Promise.all(keys.map(key => AsyncStorage.getItem(key))),
  );
