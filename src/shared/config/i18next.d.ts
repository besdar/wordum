import {GoogleSupportedLanguages} from '../model/lang';
import en from '../config/lang/en.json';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom resources type
    resources: Record<GoogleSupportedLanguages, typeof en>;
  }
}
