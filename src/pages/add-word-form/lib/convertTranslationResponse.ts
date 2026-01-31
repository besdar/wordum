import {translate} from '@vitalets/google-translate-api';
import {
  CollectionFormFields,
  TranslationResponse,
} from '../../../shared/model/collection';

export const convertReversoResponse = (
  translationResponse: ReversoResponse,
  learningLanguage: CollectionFormFields['learningLanguage'],
): TranslationResponse => ({
  translation: Array.from(new Set(translationResponse.translations))
    .slice(0, 3)
    .join(', '),
  examples: translationResponse.context?.examples
    .slice(0, 3)
    .map(result => result[learningLanguage])
    .join(' '),
});

export const convertGoogleTranslateResponse = (
  translationResponse: Awaited<ReturnType<typeof translate>>,
): TranslationResponse => ({
  translation: translationResponse.text,
});
