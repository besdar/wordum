import React from 'react';
import {Control, FieldPath, FieldValues} from 'react-hook-form';
import {translate} from '../../../shared/lib/i18n';
import {CollectionFormFields} from '../../../shared/model/collection';
import {LearningType} from '../../../shared/model/learningType';
import {ControlledSegmentedButtons} from '../../../shared/ui/ControlledSegmentedButtons';
import {learningTypeToIconMap} from '../model/learning-type-icons';

type Props<T extends CollectionFormFields & FieldValues> = {
  control: Control<T>;
};

export const CollectionExerciseSettings = <
  T extends CollectionFormFields & FieldValues,
>({
  control,
}: Props<T>) => (
  <ControlledSegmentedButtons
    label={translate('types_of_exercises')}
    control={control}
    name={'supportedLearningTypes' as FieldPath<T>}
    multiSelect
    buttons={[
      {
        icon: learningTypeToIconMap[LearningType.Flascards],
        value: LearningType.Flascards,
      },
      {
        icon: learningTypeToIconMap[LearningType.Writing],
        value: LearningType.Writing,
      },
      {
        icon: learningTypeToIconMap[LearningType.Listening],
        value: LearningType.Listening,
      },
    ]}
  />
);
