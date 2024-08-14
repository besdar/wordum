import {AppSupportedLanguages} from '../../../shared/model/collection';

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
