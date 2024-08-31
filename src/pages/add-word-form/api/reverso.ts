import Reverso from 'reverso-api';
import {ReversoSupportedLanguages} from '../../../shared/model/lang';

const reversoAPI = new Reverso();

type ReversoSupportedLanguagesType =
  (typeof ReversoSupportedLanguages)[keyof typeof ReversoSupportedLanguages];

export const getReversoTranslation = (
  word: string,
  sourceLanguage: ReversoSupportedLanguagesType,
  targetLanguage: ReversoSupportedLanguagesType,
) => reversoAPI.getTranslation(word, sourceLanguage, targetLanguage);
