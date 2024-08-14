import {AppSupportedLanguages} from '../../../shared/model/collection';
import {GoogleSupportedLanguages} from './googleLanguages';

export const appLangToGoogleLangMap: Record<
  AppSupportedLanguages,
  GoogleSupportedLanguages
> = {
  arabic: GoogleSupportedLanguages.Arabic,
  german: GoogleSupportedLanguages.German,
  spanish: GoogleSupportedLanguages.Spanish,
  french: GoogleSupportedLanguages.French,
  hebrew: GoogleSupportedLanguages.Hebrew,
  italian: GoogleSupportedLanguages.Italian,
  japanese: GoogleSupportedLanguages.Japanese,
  dutch: GoogleSupportedLanguages.Dutch,
  polish: GoogleSupportedLanguages.Polish,
  portuguese: GoogleSupportedLanguages.Portuguese,
  romanian: GoogleSupportedLanguages.Romanian,
  russian: GoogleSupportedLanguages.Russian,
  turkish: GoogleSupportedLanguages.Turkish,
  chinese: GoogleSupportedLanguages.Chinese,
  english: GoogleSupportedLanguages.English,
  ukrainian: GoogleSupportedLanguages.Ukrainian,
};
