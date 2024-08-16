import {
  Collection,
  AppSupportedLanguages,
  TranslationResponse,
} from '../../../shared/model/collection';
import {
  convertGoogleTranslateResponse,
  convertReversoResponse,
} from '../lib/convertTranslationResponse';
import {getReversoTranslation} from './reverso';
import {getGoogleTranslation} from './google';
import {appLangToGoogleLangMap} from '../model/appLangToGoogleLangMap';
import {APISources} from '../../../shared/model/apiSources';
import {appSettings} from '../../../shared/config/AppSettings';

export const getTranslation = async (
  word: string,
  sourceLanguage: AppSupportedLanguages,
  targetLanguage: AppSupportedLanguages,
  learningLanguage: Collection['learningLanguage'],
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
      appLangToGoogleLangMap[sourceLanguage],
      appLangToGoogleLangMap[targetLanguage],
    );

    return convertGoogleTranslateResponse(response);
  }

  return {
    translation: '',
  };
};
