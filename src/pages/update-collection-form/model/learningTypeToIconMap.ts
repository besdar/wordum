import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';
import {LearningType} from '../../../shared/model/collection';

export const learningTypeToIconMap: Record<LearningType, IconSource> = {
  [LearningType.Flascards]: 'cards',
  [LearningType.Writing]: 'lead-pencil',
  [LearningType.Listening]: 'ear-hearing',
};
