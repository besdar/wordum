import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from './storage';
import {getCollections, LearningType} from './collection';
import packageJSON from '../../../package.json';

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

      await collection.saveCollection();
    }
  }
}

export const dataRestructure = new DataRestructure();
