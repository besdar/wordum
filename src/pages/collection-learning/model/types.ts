import {Rating} from 'ts-fsrs';

export enum Answers {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
  SkipListening = 'SkipListening',
  Delete = 'Delete',
}

export type Statistics = {
  [Rating.Easy]: number;
  [Rating.Hard]: number;
  [Rating.Good]: number;
  [Rating.Again]: number;
};

export type EmotionalSupportCard = {
  icon: string;
  titleKey: string;
  messageKey: string;
};
