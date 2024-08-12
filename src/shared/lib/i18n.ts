import 'intl-pluralrules';
import i18n, {CustomTypeOptions} from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../config/en.json';
import ru from '../config/ru.json';
import {findBestLanguageTag} from 'react-native-localize';

const SupportedLanguagesToI18nMap: Partial<
  Record<SupportedLanguagesType, keyof CustomTypeOptions['resources']>
> = {
  english: 'en',
  russian: 'ru',
};

const languageDetectorPlugin = {
  type: 'languageDetector',
  async: true, // If this is set to true, your detect function receives a callback function that you should call with your language, useful to retrieve your language stored in AsyncStorage for example
  detect: async () => {
    return (
      findBestLanguageTag(Object.values(SupportedLanguagesToI18nMap))
        ?.languageTag || SupportedLanguagesToI18nMap.english
    );
  },
} as const;

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    fallbackLng: 'en',
    resources: {en: {translation: en}, ru: {translation: ru}},
  });

export default i18n;
