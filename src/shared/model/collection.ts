import {Card} from 'ts-fsrs';
import {AppSupportedLanguages} from '../config/lang';

export enum LearningType {
  Flascards = 'Flashcards',
  Writing = 'Writing',
  Listening = 'Listening',
}

export type TranslationResponse = {
  translation: string;
  targetVoice?: string;
  sourceVoice?: string;
  examples?: string;
};

export type LearningCard = TranslationResponse & {
  collectionId: string; // keyof CollectionItems
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
  typesOfCardsToGenerate: LearningType[];
};

export type Collection = {
  id: string;
} & CollectionFormFields;
