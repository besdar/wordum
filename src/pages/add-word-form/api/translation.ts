import {APISources} from '../../../shared/model/apiSources';
import {appSettings} from '../../../shared/model/AppSettings';
import {
  CollectionFormFields,
  TranslationResponse,
} from '../../../shared/model/collection';
import {
  AppSupportedLanguages,
  SupportedLanguagesToI18nMap,
} from '../../../shared/model/lang';
import {
  convertGoogleTranslateResponse,
  convertReversoResponse,
} from '../lib/convertTranslationResponse';
import {getGoogleTranslation} from './google';
import {getReversoTranslation} from './reverso';

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
