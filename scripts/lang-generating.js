const fs = require('fs');
const translate = require('@vitalets/google-translate-api').translate;
const {exec} = require('child_process');
const {HttpProxyAgent} = require('http-proxy-agent');

const separator = '\n';
const pathToLangMap = 'src/shared/config/lang';

const writeFile = (pathToFile, fileContent) =>
  fs.writeFile(pathToFile, fileContent, console.log);

const translateTextToFile = async (textToTranslate, langKey, langEntries) => {
  const httpProxyUrl = process.argv[2]; // http://127.0.0.1:80 <- https://free-proxy-list.net/
  const agent = new HttpProxyAgent(httpProxyUrl);

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

  return writeFile(
    `src/shared/config/lang/${langKey}.json`,
    JSON.stringify(translatedJSON),
  );
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
    const langEntries = Object.entries(langData);
    const textToTranslate = langEntries
      .map(([_, value]) => value)
      .join(separator);
    const {SupportedLanguagesToI18nMap} = require(`../${pathToLangMap}.js`);

    Object.values(SupportedLanguagesToI18nMap)
      .filter(value => !['en', 'ru'].includes(value))
      .forEach((langKey, index) => {
        setTimeout(
          () => translateTextToFile(textToTranslate, langKey, langEntries),
          index * 1000,
        );
      });
  });
});
