import 'intl-pluralrules';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../config/lang/en.json';
import de from '../config/lang/de.json';
import es from '../config/lang/es.json';
import fr from '../config/lang/fr.json';
import it from '../config/lang/it.json';
import ja from '../config/lang/ja.json';
import nl from '../config/lang/nl.json';
import pl from '../config/lang/pl.json';
import pt from '../config/lang/pt.json';
import ro from '../config/lang/ro.json';
import ru from '../config/lang/ru.json';
import tr from '../config/lang/tr.json';
import uk from '../config/lang/uk.json';
import zh from '../config/lang/zh.json';
import {findBestLanguageTag} from 'react-native-localize';
import {
  GoogleSupportedLanguages,
  SupportedLanguagesToI18nMap,
} from '../model/lang';

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
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    fallbackLng: GoogleSupportedLanguages.English,
    resources: {
      [GoogleSupportedLanguages.English]: {translation: en},
      [GoogleSupportedLanguages.German]: {translation: de},
      [GoogleSupportedLanguages.Spanish]: {translation: es},
      [GoogleSupportedLanguages.French]: {translation: fr},
      [GoogleSupportedLanguages.Italian]: {translation: it},
      [GoogleSupportedLanguages.Japanese]: {translation: ja},
      [GoogleSupportedLanguages.Dutch]: {translation: nl},
      [GoogleSupportedLanguages.Polish]: {translation: pl},
      [GoogleSupportedLanguages.Portuguese]: {translation: pt},
      [GoogleSupportedLanguages.Romanian]: {translation: ro},
      [GoogleSupportedLanguages.Russian]: {translation: ru},
      [GoogleSupportedLanguages.Turkish]: {translation: tr},
      [GoogleSupportedLanguages.Ukrainian]: {translation: uk},
      [GoogleSupportedLanguages.Chinese]: {translation: zh},
    },
  });

export const translate = i18n.t;
