import React from 'react';
import {
  CollectionFormFields,
  LearningType,
} from '../../../shared/model/collection';
import {Details} from '../../../shared/ui/Details';
import {Control, FieldValues} from 'react-hook-form';
import {translate} from '../../../shared/lib/i18n';
import {ControlledSegmentedButtons} from '../../../shared/ui/ControlledSegmentedButtons';

type Props = {
  control: Control<FieldValues & CollectionFormFields>;
};

export const CollectionAdditionalSettings = ({control}: Props) => (
  <Details
    expandedTitle={translate('hide_additional_settings')}
    collapsedTitle={translate('show_additional_settings')}>
    <ControlledSegmentedButtons
      label={translate('types_of_exercises')}
      control={control}
      name="typesOfCardsToGenerate"
      multiSelect
      buttons={[
        {icon: 'cards', value: LearningType.Flascards},
        {icon: 'lead-pencil', value: LearningType.Writing},
        {icon: 'ear-hearing', value: LearningType.Listening},
      ]}
    />
  </Details>
);
