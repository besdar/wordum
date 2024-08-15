import {DocumentDirectoryPath, downloadFile} from '@dr.pogodin/react-native-fs';
import {createEmptyCard} from 'ts-fsrs';
import {CollectionItem, Collection, LearningType} from '../model/collection';

export const getUUID = () => Math.random().toString(16).slice(2);

export const downloadVoice = async (voiceURL?: string) => {
  if (!voiceURL) {
    return '';
  }

  const voiceFileName = `${DocumentDirectoryPath}/${getUUID()}.mp3`;
  const {statusCode} = await downloadFile({
    fromUrl: voiceURL,
    toFile: voiceFileName,
  }).promise;

  if (statusCode !== 200) {
    return '';
  }

  return voiceFileName;
};

export const createLearningCardsForCollectionItem = (
  newItem: Omit<CollectionItem, 'learningType' | 'fsrsCard'>,
  learningLanguage: Collection['learningLanguage'],
  sourceVoice?: string,
  targetVoice?: string,
) => {
  const cards: CollectionItem[] = [];
  const isLearningSourceLanguage = learningLanguage === 'source';

  const learningValue = isLearningSourceLanguage
    ? newItem.value
    : newItem.translation;

  cards.push(
    {
      value: newItem.value,
      translation: newItem.translation,
      targetVoice,
      sourceVoice,
      fsrsCard: createEmptyCard(),
      learningType: LearningType.Flascards,
    },
    {
      value: newItem.translation,
      translation: newItem.value,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Flascards,
      targetVoice: sourceVoice,
      sourceVoice: targetVoice,
    },
    {
      value: learningValue,
      translation: isLearningSourceLanguage
        ? newItem.translation
        : newItem.value,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Writing,
    },
  );

  const audioValue = isLearningSourceLanguage ? sourceVoice : targetVoice;
  if (audioValue) {
    cards.push({
      value: audioValue,
      translation: learningValue,
      fsrsCard: createEmptyCard(),
      examples: newItem.examples,
      learningType: LearningType.Listening,
    });
  }

  return cards;
};
