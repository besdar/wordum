import SupportedLanguagesOriginal from 'reverso-api/src/enums/languages';
import {AppSupportedLanguages} from './lang';

export const ReversoSupportedLanguages = SupportedLanguagesOriginal;
export const LANGUAGE_LIST = Object.entries(SupportedLanguagesOriginal);
export const LANGUAGE_FLAGS: Record<AppSupportedLanguages, string> = {
  english: '🇬🇧',
  spanish: '🇪🇸',
  french: '🇫🇷',
  german: '🇩🇪',
  italian: '🇮🇹',
  portuguese: '🇧🇷',
  russian: '🇷🇺',
  chinese: '🇨🇳',
  japanese: '🇯🇵',
  arabic: '🇸🇦',
  turkish: '🇹🇷',
  dutch: '🇳🇱',
  hebrew: '🇮🇱',
  polish: '🇵🇱',
  romanian: '🇷🇴',
  ukrainian: '🇺🇦',
} as const;
