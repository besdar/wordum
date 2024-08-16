import {Card} from 'ts-fsrs';

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
  id: string; // keyof CollectionItems
  value: string;
  fsrsCard: Card;
  learningType: LearningType;
};

export type CollectionItems = Record<string, LearningCard[]>;

export enum AppSupportedLanguages {
  ARABIC = 'arabic',
  GERMAN = 'german',
  SPANISH = 'spanish',
  FRENCH = 'french',
  HEBREW = 'hebrew',
  ITALIAN = 'italian',
  JAPANESE = 'japanese',
  DUTCH = 'dutch',
  POLISH = 'polish',
  PORTUGUESE = 'portuguese',
  ROMANIAN = 'romanian',
  RUSSIAN = 'russian',
  TURKISH = 'turkish',
  CHINESE = 'chinese',
  ENGLISH = 'english',
  UKRAINIAN = 'ukrainian',
}

export type AddCollectionFormFields = {
  name: string;
  sourceLanguage: AppSupportedLanguages;
  targetLanguage: AppSupportedLanguages;
  wordsToTrain: number;
  learningLanguage: 'source' | 'target';
};

export type Collection = {
  id: string;
  words: CollectionItems;
} & AddCollectionFormFields;
