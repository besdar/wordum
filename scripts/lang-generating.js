const fs = require('fs');
const translate = require('@vitalets/google-translate-api').translate;
const {exec} = require('child_process');
const {HttpProxyAgent} = require('http-proxy-agent');

const separator = '\n';
const pathToLangMap = 'src/shared/model/lang';
const commandArgs = process.argv.slice(2);

const writeFile = (pathToFile, fileContent) =>
  fs.writeFile(pathToFile, fileContent, console.log);

const translateTextToFile = async (textToTranslate, langKey, langEntries) => {
  const httpProxyUrl = commandArgs.find(arg => arg.startsWith('http')); // http://127.0.0.1:80 <- https://free-proxy-list.net/
  const agent = httpProxyUrl ? new HttpProxyAgent(httpProxyUrl) : undefined;

  const {text: translatedText} = await translate(textToTranslate, {
    from: 'en',
    to: langKey,
    fetchOptions: {agent: httpProxyUrl ? agent : undefined},
  });

  const translatedJSON = translatedText
    .split(separator)
    .reduce((acc, translatedValue, index) => {
      acc[langEntries[index][0]] = translatedValue;

      return acc;
    }, {});

  return translatedJSON;
};

const writeTranslationToFile = (translatedJSON, langKey) => {
  return writeFile(
    `src/shared/config/lang/${langKey}.json`,
    JSON.stringify(translatedJSON),
  );
};

const translateTexts = async langData => {
  const langEntries = Object.entries(langData).filter(
    ([_, value]) => !Array.isArray(value),
  );
  const textToTranslate = langEntries
    .map(([_, value]) => value)
    .join(separator);
  const {SupportedLanguagesToI18nMap, GoogleSupportedLanguages} = require(
    `../${pathToLangMap}.js`,
  );

  const testLanguage = commandArgs
    .find(arg => arg.startsWith('lang='))
    ?.replace('--lang=', '');
  const langKeys = Object.values(SupportedLanguagesToI18nMap).filter(
    value =>
      ![
        GoogleSupportedLanguages.English,
        GoogleSupportedLanguages.Russian,
        GoogleSupportedLanguages.Arabic,
        GoogleSupportedLanguages.Hebrew,
      ].includes(value) &&
      (value === testLanguage || !testLanguage),
  );

  for (const langKey of langKeys) {
    const translatedJSON = await translateTextToFile(
      textToTranslate,
      langKey,
      langEntries,
    );

    const motivationsLines = langData.motivations.flat();
    const motivations = await translateTextToFile(
      motivationsLines.join(separator),
      langKey,
      [...Array(motivationsLines.length).keys()].map(index => [index]),
    );

    translatedJSON.motivations = Object.entries(motivations)
      .sort(([a], [b]) => a - b)
      .reduce((acc, [key, text]) => {
        const index = Math.floor(Number(key) / 5);
        if (!acc[index]) {
          acc[index] = [];
        }

        acc[index].push(text);

        return acc;
      }, []);

    writeTranslationToFile(translatedJSON, langKey);
  }
};

exec(`tsc ${pathToLangMap}.ts`, (error, stdout, stderr) => {
  if (error || stderr) {
    console.error(error.message, stderr);

    return;
  }

  fs.readFile('src/shared/config/lang/en.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err.message);

      return;
    }

    const langData = JSON.parse(data);
    translateTexts(langData);
  });
});
