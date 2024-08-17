import {GoogleSupportedLanguages} from './googleLanguages';
import en from '../config/en.json';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: 'en';
    // custom resources type
    resources: Record<GoogleSupportedLanguages, typeof en>;
  }
}
