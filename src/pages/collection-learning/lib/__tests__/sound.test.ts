import SoundPlayer from 'react-native-sound-player';
import {AppSupportedLanguages} from '../../../../shared/model/lang';
import {playSound, setLearningVoice} from '../sound';
import Tts from 'react-native-tts';
import {showConfirmationAlert} from '../../../../shared/lib/message';

jest.mock('../../../../shared/lib/message', () => ({
  showConfirmationAlert: jest.fn(),
}));

describe('playSound', () => {
  it('should play the sound file with the correct name', () => {
    const filePath = '/path/to/soundfile.mp3';
    playSound(filePath);
    expect(SoundPlayer.playSoundFile).toHaveBeenCalledWith('soundfile', 'mp3');
  });
});

describe('setLearningVoice', () => {
  it('should set the default language if a matching voice is found', async () => {
    const learningLanguage = AppSupportedLanguages.ENGLISH;
    const mockVoices = [{language: 'en-US'}, {language: 'en-GB'}];

    (Tts.voices as jest.Mock).mockResolvedValue(mockVoices);
    (Tts.getInitStatus as jest.Mock).mockResolvedValueOnce(undefined); // Simulate successful init status

    await setLearningVoice(learningLanguage);
    expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('en-US'); // Ensure the correct language is set
  });

  it('should throw an error if no matching voice is found', async () => {
    const learningLanguage = AppSupportedLanguages.SPANISH;
    const mockVoices = [{language: 'en-US'}, {language: 'en-GB'}];

    (Tts.voices as jest.Mock).mockResolvedValue(mockVoices);

    await expect(setLearningVoice(learningLanguage)).rejects.toThrow(); // Expect an error to be thrown
  });

  it('should show a confirmation alert if the voice is not installed', async () => {
    (showConfirmationAlert as jest.Mock).mockResolvedValue(undefined);

    const learningLanguage = AppSupportedLanguages.ENGLISH;
    const mockVoices = [{language: 'en-US', notInstalled: true}];

    (Tts.voices as jest.Mock).mockResolvedValue(mockVoices);
    (Tts.getInitStatus as jest.Mock).mockResolvedValueOnce(undefined); // Simulate successful init status

    await setLearningVoice(learningLanguage);
    expect(showConfirmationAlert).toHaveBeenCalledWith(
      'tts_installation_title',
      'tts_installation_message',
      'proceed',
    );
    expect(Tts.requestInstallData).toHaveBeenCalled(); // Ensure requestInstallData is called
  });

  it('should request the installation engine if getInitStatus fails', async () => {
    const learningLanguage = AppSupportedLanguages.ENGLISH;
    const mockVoices = [{language: 'en-US'}];

    (Tts.voices as jest.Mock).mockResolvedValue(mockVoices);
    (Tts.getInitStatus as jest.Mock).mockRejectedValueOnce(undefined); // Simulate failure in getting init status

    await setLearningVoice(learningLanguage);
    expect(Tts.requestInstallEngine).toHaveBeenCalled(); // Ensure requestInstallEngine is called
  });
});
