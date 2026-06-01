import type {EmotionalSupportCard} from '../model/types';

const EMOTIONAL_SUPPORT_MIN_ANSWERS = 3;
const EMOTIONAL_SUPPORT_CHANCE = 0.35;

export const emotionalSupportCards: EmotionalSupportCard[] = [
  {
    icon: 'heart-outline',
    titleKey: 'emotional_support_small_wins_title',
    messageKey: 'emotional_support_small_wins_message',
  },
  {
    icon: 'arm-flex-outline',
    titleKey: 'emotional_support_brain_work_title',
    messageKey: 'emotional_support_brain_work_message',
  },
  {
    icon: 'brightness-5',
    titleKey: 'emotional_support_progress_title',
    messageKey: 'emotional_support_progress_message',
  },
  {
    icon: 'emoticon-happy-outline',
    titleKey: 'emotional_support_momentum_title',
    messageKey: 'emotional_support_momentum_message',
  },
];

export const shouldShowEmotionalSupportCard = (
  answeredCardsSinceLastCard: number,
  randomValue = Math.random(),
) =>
  answeredCardsSinceLastCard >= EMOTIONAL_SUPPORT_MIN_ANSWERS &&
  randomValue < EMOTIONAL_SUPPORT_CHANCE;

export const getRandomEmotionalSupportCard = (randomValue = Math.random()) => {
  const cardIndex = Math.min(
    Math.floor(randomValue * emotionalSupportCards.length),
    emotionalSupportCards.length - 1,
  );

  return emotionalSupportCards[cardIndex];
};
