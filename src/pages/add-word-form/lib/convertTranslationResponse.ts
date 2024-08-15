import {translate} from '@vitalets/google-translate-api';
import {
  Collection,
  TranslationResponse,
} from '../../../shared/model/collection';

export const convertReversoResponse = (
  translationResponse: ReversoResponse,
  learningLanguage: Collection['learningLanguage'],
): TranslationResponse => ({
  translation: Array.from(new Set(translationResponse.translations))
    .slice(0, 3)
    .join(', '),
  examples: translationResponse.context?.examples
    .slice(0, 3)
    .map(result => result[learningLanguage])
    .join(' '),
  targetVoice: translationResponse.voice,
  sourceVoice: translationResponse.sourceVoice,
});

export const convertGoogleTranslateResponse = (
  translationResponse: Awaited<ReturnType<typeof translate>>,
): TranslationResponse => ({
  translation: translationResponse.text,
});
