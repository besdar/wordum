import {translate} from '@vitalets/google-translate-api';
import {GoogleSupportedLanguages} from '../../../shared/config/lang';

export const getGoogleTranslation = (
  word: string,
  sourceLanguage: GoogleSupportedLanguages,
  targetLanguage: GoogleSupportedLanguages,
) => translate(word, {to: targetLanguage, from: sourceLanguage});
