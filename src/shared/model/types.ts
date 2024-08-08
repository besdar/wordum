import {Card} from 'ts-fsrs';

export enum StorageKeys {
  COLLECTIONS = 'COLLECTIONS',
}

export type CollectionItem = {
  value: string;
  translation: string;
  targetVoice?: string;
  sourceVoice?: string;
  examples?: string;
  fsrsCard: Card;
};

export type AddCollectionFormFields = {
  name: string;
  sourceLanguage: SupportedLanguagesType;
  targetLanguage: SupportedLanguagesType;
  wordsToTrain: number;
  learningLanguage: 'source' | 'target';
};

export type Collection = {
  id: string;
  words: CollectionItem[];
} & AddCollectionFormFields;

export type PagesStackProps = {
  Overview: undefined;
  AddWordForm: {
    collectionId: string;
  };
  AddCollectionForm: undefined;
  CollectionLearning: {
    collectionId: string;
  };
};
