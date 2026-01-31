import {Card} from 'ts-fsrs';
import {AppSupportedLanguages} from './lang';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from './storage';
import {createLearningCardsForCollectionItem, getUUID} from '../lib/collection';
import {filterActualCards} from '../lib/cards';

export enum LearningType {
  Flascards = 'Flashcards',
  Writing = 'Writing',
  Listening = 'Listening',
}

export type TranslationResponse = {
  translation: string;
  examples?: string;
};

export type LearningCard = TranslationResponse & {
  wordId: string; // keyof CollectionItems
  value: string;
  fsrsCard: Card;
  learningType: LearningType;
};

export type CollectionItems = Record<string, LearningCard[]>;

export type CollectionFormFields = {
  name: string;
  sourceLanguage: AppSupportedLanguages;
  targetLanguage: AppSupportedLanguages;
  wordsToTrain: number;
  learningLanguage: 'source' | 'target';
  words: CollectionItems;
  supportedLearningTypes: LearningType[];
};

export type CollectionType = {
  id: string;
} & CollectionFormFields;

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const getInitialCollection = (): Optional<CollectionType, 'id'> => ({
  name: '',
  sourceLanguage: AppSupportedLanguages.ENGLISH,
  targetLanguage: AppSupportedLanguages.RUSSIAN,
  wordsToTrain: 20,
  learningLanguage: 'target',
  supportedLearningTypes: [
    LearningType.Flascards,
    LearningType.Listening,
    LearningType.Writing,
  ],
  words: {},
});

export class Collection {
  #collection: Optional<CollectionType, 'id'> = getInitialCollection();
  #learningCardsToDelete: LearningCard[] = [];
  #isNew = true;

  constructor(collection?: Optional<CollectionType, 'id'>) {
    if (collection) {
      this.#collection = collection;
    }
  }

  #reset() {
    this.#collection = getInitialCollection();
    this.#learningCardsToDelete = [];
  }

  async init(id?: string) {
    if (!id) {
      return this;
    }

    const collection = await AsyncStorage.getItem(
      StorageKeys.COLLECTIONS + '_' + id,
    );

    if (collection) {
      this.#collection = JSON.parse(collection);
    }

    this.#isNew = false;

    return this;
  }

  async saveCollection(payload?: Optional<CollectionType, 'id'>) {
    this.#isNew = false;

    if (payload) {
      this.#collection = {
        ...this.#collection,
        ...payload,
      };
    }

    if (this.#learningCardsToDelete.length) {
      for (const card of this.#learningCardsToDelete) {
        const learningCards = this.#collection.words[card.wordId];
        if (learningCards.length === 1) {
          delete this.#collection.words[card.wordId];
        } else {
          this.#collection.words[card.wordId] = learningCards.filter(
            el =>
              el.value !== card.value || card.learningType !== el.learningType,
          );
        }
      }
    }

    if (!this.#collection.id) {
      this.#collection.id = getUUID();
    }

    await AsyncStorage.setItem(
      StorageKeys.COLLECTIONS + '_' + this.#collection.id,
      JSON.stringify(this.#collection),
    );

    this.#learningCardsToDelete = [];

    return this;
  }

  deleteCollection = async () => {
    await AsyncStorage.removeItem(
      StorageKeys.COLLECTIONS + '_' + this.#collection.id,
    );

    this.#reset();
  };

  setCollectionItemForDeletion = (collectionItem: LearningCard) => {
    if (!this.#collection.words[collectionItem.wordId]) {
      return this;
    }

    this.#learningCardsToDelete.push(collectionItem);

    return this;
  };

  getLearningCards() {
    return Object.values(this.#collection.words);
  }

  getWordsToLearn() {
    return this.getLearningCards().filter(cards =>
      cards.some(
        card =>
          filterActualCards(card) &&
          this.#collection.supportedLearningTypes.includes(card.learningType),
      ),
    );
  }

  getProperty<T extends keyof Omit<CollectionType, 'words'>>(
    key: T,
  ): Readonly<Optional<CollectionType, 'id'>[T]> {
    return this.#collection[key];
  }

  isWordInCollection(valueToSearch: string) {
    return Boolean(
      Object.values(this.#collection.words)
        .flat()
        .find(({value}) => valueToSearch === value),
    );
  }

  async addWord(
    newItem: Pick<LearningCard, 'value' | keyof TranslationResponse>,
  ) {
    if (this.isWordInCollection(newItem.value)) {
      return;
    }

    const itemId = getUUID();

    const newWordCards = createLearningCardsForCollectionItem(
      {
        ...newItem,
        wordId: itemId,
      },
      this.#collection.learningLanguage,
      this.#collection.supportedLearningTypes,
    );

    this.#collection = {
      ...this.#collection,
      words: {...this.#collection.words, [itemId]: newWordCards},
    };

    return this.saveCollection();
  }

  async deleteWord(wordId: string) {
    if (!this.#collection.words[wordId]) {
      return this;
    }

    delete this.#collection.words[wordId];

    return this.saveCollection();
  }

  dangerouslyGetInnerObject() {
    return this.#collection;
  }

  getLearningLanguage() {
    return this.#collection.learningLanguage === 'source'
      ? this.#collection.sourceLanguage
      : this.#collection.targetLanguage;
  }

  isItNew() {
    return this.#isNew;
  }
}

const getCollectionsKeys = () =>
  AsyncStorage.getAllKeys().then(result =>
    result
      .filter(key => key.startsWith(StorageKeys.COLLECTIONS))
      .map(key => key.replace(StorageKeys.COLLECTIONS + '_', '')),
  );

export const getCollections = (): Promise<Collection[]> =>
  getCollectionsKeys().then(keys =>
    Promise.all(keys.map(key => new Collection().init(key))),
  );

export const isThereAnyWordsToLearn = async () => {
  const collectionsKeys = await getCollectionsKeys();

  for (const collectionKey of collectionsKeys) {
    const collection = await new Collection().init(collectionKey);

    if (collection.getWordsToLearn().length) {
      return true;
    }
  }

  return false;
};
