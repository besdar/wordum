import Reverso from 'reverso-api';
import ReversoSupportedLanguages from 'reverso-api/src/enums/languages';

const reversoAPI = new Reverso();

type ReversoSupportedLanguagesType =
  (typeof ReversoSupportedLanguages)[keyof typeof ReversoSupportedLanguages];

export const getReversoTranslation = (
  word: string,
  sourceLanguage: ReversoSupportedLanguagesType,
  targetLanguage: ReversoSupportedLanguagesType,
) =>
  new Promise<ReversoResponse>((resolve, reject) =>
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
