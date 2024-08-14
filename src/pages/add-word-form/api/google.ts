import {translate} from '@vitalets/google-translate-api';
import {GoogleSupportedLanguages} from '../model/googleLanguages';

export const getGoogleTranslation = (
  word: string,
  sourceLanguage: GoogleSupportedLanguages,
  targetLanguage: GoogleSupportedLanguages,
) => translate(word, {to: targetLanguage, from: sourceLanguage});
