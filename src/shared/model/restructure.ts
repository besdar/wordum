import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from './storage';
import {CollectionFormFields, getCollections, LearningType} from './collection';
import packageJSON from '../../../package.json';

const collectionRestructureV020 = (innerObject: CollectionFormFields) => {
  if (innerObject.supportedLearningTypes) {
    return false;
  }

  // @ts-ignore
  innerObject.supportedLearningTypes = innerObject.typesOfCardsToGenerate;

  const wordsEntries = Object.entries(innerObject.words);
  for (const [wordKey, learningCards] of wordsEntries) {
    learningCards.forEach(el => {
      // @ts-ignore
      el.wordId = el.collectionId;
    });

    const listeningCard = learningCards.find(
      card => card.learningType === LearningType.Listening,
    );

    if (!listeningCard) {
      continue;
    }

    const writingCard = learningCards.find(
      card => card.learningType === LearningType.Writing,
    );

    if (!writingCard) {
      delete innerObject.words[wordKey];

      continue;
    }

    listeningCard.sound = listeningCard.value;
    listeningCard.value = listeningCard.translation;
    listeningCard.translation = writingCard.translation;
  }

  return true;
};

export const restructureOldCollection = (
  data: CollectionFormFields,
  version: {major: number; middle: number; minor: number},
) => {
  if (version.middle < 2) {
    return collectionRestructureV020(data);
  }
};

class DataRestructure {
  promise: Promise<void> | undefined;
  appPreviousVersion: string | undefined | null;

  async #getPreviousVersion() {
    if (!this.appPreviousVersion) {
      this.appPreviousVersion = await AsyncStorage.getItem(
        StorageKeys.PREVIOUS_VERSION,
      );
    }

    return this.appPreviousVersion;
  }

  async init() {
    if (this.promise) {
      return this.promise;
    }

    this.promise = this.#dataRestructureV020();

    return AsyncStorage.setItem(
      StorageKeys.PREVIOUS_VERSION,
      packageJSON.version,
    );
  }

  async #dataRestructureV020() {
    const previousVersion = await this.#getPreviousVersion();
    if (previousVersion) {
      return;
    }

    const collections = await getCollections();

    for (const collection of collections) {
      const innerObject = collection.dangerouslyGetInnerObject();

      if (!collectionRestructureV020(innerObject)) {
        continue;
      }

      await collection.saveCollection();
    }
  }
}

export const dataRestructure = new DataRestructure();
