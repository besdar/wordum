import SoundPlayer from 'react-native-sound-player';

const getFileName = (filePath: string) =>
  filePath.substring(filePath.lastIndexOf('/'), filePath.lastIndexOf('.'));

export const playSound = (filePath: string) =>
  SoundPlayer.playSoundFile(getFileName(filePath), 'mp3');
