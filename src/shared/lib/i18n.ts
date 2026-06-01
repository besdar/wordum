import 'intl-pluralrules';
import {getLocales} from 'expo-localization';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {translations} from '../config/lang';
import {
  GoogleSupportedLanguages,
  SupportedLanguagesToI18nMap,
} from '../model/lang';

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
  detect: async () => {
    const supportedLanguages = Object.values(SupportedLanguagesToI18nMap);

    for (const locale of getLocales()) {
      const languageCode = locale.languageCode as GoogleSupportedLanguages;
      const languageTag = locale.languageTag as GoogleSupportedLanguages;

      if (supportedLanguages.includes(languageTag)) {
        return languageTag;
      }

      if (supportedLanguages.includes(languageCode)) {
        return languageCode;
      }
    }

    return SupportedLanguagesToI18nMap.english;
  },
} as const;

i18n
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    fallbackLng: GoogleSupportedLanguages.English,
    resources: {
      [GoogleSupportedLanguages.English]: {translation: translations.en},
      [GoogleSupportedLanguages.German]: {translation: translations.de},
      [GoogleSupportedLanguages.Spanish]: {translation: translations.es},
      [GoogleSupportedLanguages.French]: {translation: translations.fr},
      [GoogleSupportedLanguages.Italian]: {translation: translations.it},
      [GoogleSupportedLanguages.Japanese]: {translation: translations.ja},
      [GoogleSupportedLanguages.Dutch]: {translation: translations.nl},
      [GoogleSupportedLanguages.Polish]: {translation: translations.pl},
      [GoogleSupportedLanguages.Portuguese]: {translation: translations.pt},
      [GoogleSupportedLanguages.Romanian]: {translation: translations.ro},
      [GoogleSupportedLanguages.Russian]: {translation: translations.ru},
      [GoogleSupportedLanguages.Turkish]: {translation: translations.tr},
      [GoogleSupportedLanguages.Ukrainian]: {translation: translations.uk},
      [GoogleSupportedLanguages.Chinese]: {translation: translations.zh},
    },
  });

export const translate = i18n.t;
