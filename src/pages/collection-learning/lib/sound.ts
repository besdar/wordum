import SoundPlayer from 'react-native-sound-player';
import Tts from 'react-native-tts';
import {
  AppSupportedLanguages,
  LANGUAGE_FLAGS,
  SupportedLanguagesToI18nMap,
} from '../../../shared/model/lang';
import {showConfirmationAlert} from '../../../shared/lib/message';
import {translate} from '../../../shared/lib/i18n';

const getFileName = (filePath: string) =>
  filePath.substring(filePath.lastIndexOf('/'), filePath.lastIndexOf('.'));

export const playSound = (filePath: string) =>
  SoundPlayer.playSoundFile(getFileName(filePath), 'mp3');

export const setLearningVoice = async (
  learningLanguage: AppSupportedLanguages,
) => {
  const voices = await Tts.voices();

  const learningVoice = voices.find(voice =>
    voice.language.startsWith(
      SupportedLanguagesToI18nMap[learningLanguage] + '-',
    ),
  );

  if (!learningVoice) {
    throw new Error();
  }

  if (learningVoice.notInstalled) {
    await showConfirmationAlert(
      translate('tts_installation_title'),
      translate('tts_installation_message', {
        i_lng: LANGUAGE_FLAGS[learningLanguage],
      }),
      translate('proceed'),
    ).then(() => Tts.requestInstallData());
  }

  await Tts.getInitStatus().catch(() => Tts.requestInstallEngine());

  return Tts.setDefaultLanguage(learningVoice.language);
};
