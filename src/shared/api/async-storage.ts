import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Collection,
  CollectionItem,
  StorageKeys,
  AddCollectionFormFields,
  LearningType,
} from '../model/types';
import {createEmptyCard} from 'ts-fsrs';
import {DocumentDirectoryPath, downloadFile} from '@dr.pogodin/react-native-fs';

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

const getUUID = () => Math.random().toString(16).slice(2);

export const createCollection = (data: AddCollectionFormFields) =>
  saveCollection({
    id: getUUID(),
    words: [],
    ...data,
  });

const downloadVoice = async (voiceURL?: string) => {
  if (!voiceURL) {
    return '';
  }

  const voiceFileName = `${DocumentDirectoryPath}/${getUUID()}.mp3`;
  const {statusCode} = await downloadFile({
    fromUrl: voiceURL,
    toFile: voiceFileName,
  }).promise;

  if (statusCode !== 200) {
    return '';
  }

  return voiceFileName;
};

export const addWordToCollection = async (
  collectionId: string,
  newItem: Omit<CollectionItem, 'learningType' | 'fsrsCard'>,
) => {
  const collection = await getCollection(collectionId);
  const isLearningSourceLanguage = collection.learningLanguage === 'source';
  const collectionWords = [...collection.words];
  const sourceVoice = await downloadVoice(newItem.sourceVoice);
  const targetVoice = await downloadVoice(newItem.targetVoice);

  const learningValue = isLearningSourceLanguage
    ? newItem.value
    : newItem.translation;
  collectionWords.push(
    {
      value: newItem.value,
      translation: newItem.translation,
      targetVoice,
      sourceVoice,
      fsrsCard: createEmptyCard(),
      learningType: LearningType.Flascards,
    },
    {
      value: newItem.translation,
      translation: newItem.value,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Flascards,
      targetVoice: sourceVoice,
      sourceVoice: targetVoice,
    },
    {
      value: learningValue,
      translation: isLearningSourceLanguage
        ? newItem.translation
        : newItem.value,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Writing,
    },
  );

  const audioValue = isLearningSourceLanguage ? sourceVoice : targetVoice;
  if (audioValue) {
    collectionWords.push({
      value: audioValue,
      translation: learningValue,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Listening,
    });
  }

  return saveCollection({...collection, words: collectionWords});
};
