import Reverso from 'reverso-api';
import SupportedLanguagesOriginal from 'reverso-api/src/enums/languages';

const reversoAPI = new Reverso();

export const getSupportedLanguages = () =>
  Object.values(SupportedLanguagesOriginal);

export const getTranslations = (
  word: string,
  sourceLanguage: SupportedLanguagesType,
  targetLanguage: SupportedLanguagesType,
) => {
  return new Promise<ReversoResponse>((resolve, reject) =>
    reversoAPI.getTranslation(
      word,
      sourceLanguage,
      targetLanguage,
      (err: any, response: ReversoResponse | PromiseLike<ReversoResponse>) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      },
    ),
  );
};

export const SupportedLanguages = SupportedLanguagesOriginal;
