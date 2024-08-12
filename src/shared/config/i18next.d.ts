import en from '../config/en.json';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: 'en';
    // custom resources type
    resources: Record<'en' | 'ru', typeof en>;
  }
}
