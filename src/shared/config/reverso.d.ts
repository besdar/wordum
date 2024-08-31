declare module 'reverso-api' {
  global {
    export interface ReversoResponse {
      text: string;
      source: string;
      target: string;
      translations: string[];
      context?: {
        examples: Array<{
          source: string;
          target: string;
          source_phrases: Array<{
            phrase: string;
            offset: Number;
            length: Number;
          }>;
          target_phrases: Array<{
            phrase: string;
            offset: Number;
            length: Number;
          }>;
        }>;
        rude: Boolean;
      };
      detected_language: string;
      voice?: string;
      sourceVoice?: string;
    }

    export interface ReversoErrorResponse {
      ok: boolean;
      message: string;
    }
  }

  type CallbackFunction = (
    error: ReversoErrorResponse,
    response: ReversoResponse,
  ) => void;

  class Reverso {
    constructor({insecureHTTPParser}?: {insecureHTTPParser: boolean});
    getTranslation(
      text: string,
      source: string,
      target: string,
      callback?: CallbackFunction,
    ): Promise<ReversoResponse>;
  }

  export = Reverso;
}

declare module 'reverso-api/src/enums/languages' {
  const ReversoSupportedLanguages = {
    ARABIC: 'arabic',
    GERMAN: 'german',
    SPANISH: 'spanish',
    FRENCH: 'french',
    HEBREW: 'hebrew',
    ITALIAN: 'italian',
    JAPANESE: 'japanese',
    DUTCH: 'dutch',
    POLISH: 'polish',
    PORTUGUESE: 'portuguese',
    ROMANIAN: 'romanian',
    RUSSIAN: 'russian',
    TURKISH: 'turkish',
    CHINESE: 'chinese',
    ENGLISH: 'english',
    UKRAINIAN: 'ukrainian',
  } as const;

  export = ReversoSupportedLanguages;
}
