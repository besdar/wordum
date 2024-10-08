import {
  CollectionFormFields,
  TranslationResponse,
} from '../../../shared/model/collection';
import {
  convertGoogleTranslateResponse,
  convertReversoResponse,
} from '../lib/convertTranslationResponse';
import {getReversoTranslation} from './reverso';
import {getGoogleTranslation} from './google';
import {APISources} from '../../../shared/model/apiSources';
import {appSettings} from '../../../shared/model/AppSettings';
import {
  AppSupportedLanguages,
  SupportedLanguagesToI18nMap,
} from '../../../shared/model/lang';

export const getTranslation = async (
  word: string,
  sourceLanguage: AppSupportedLanguages,
  targetLanguage: AppSupportedLanguages,
  learningLanguage: CollectionFormFields['learningLanguage'],
): Promise<TranslationResponse> => {
  const sourceAPI = appSettings.getSetting('apiSource');

  if (sourceAPI === APISources.ReversoContextUnofficial) {
    const response = await getReversoTranslation(
      word,
      sourceLanguage,
      targetLanguage,
    );

    return convertReversoResponse(response, learningLanguage);
  } else if (sourceAPI === APISources.GoogleTranslateUnofficial) {
    const response = await getGoogleTranslation(
      word,
      SupportedLanguagesToI18nMap[sourceLanguage],
      SupportedLanguagesToI18nMap[targetLanguage],
    );

    return convertGoogleTranslateResponse(response);
  }

  return {
    translation: '',
  };
};
