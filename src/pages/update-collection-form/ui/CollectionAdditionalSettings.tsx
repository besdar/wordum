import React, {useMemo} from 'react';
import {
  Collection,
  CollectionFormFields,
  LearningType,
} from '../../../shared/model/collection';
import {Details} from '../../../shared/ui/Details';
import {Control, FieldValues} from 'react-hook-form';
import {translate} from '../../../shared/lib/i18n';
import {ControlledSegmentedButtons} from '../../../shared/ui/ControlledSegmentedButtons';
import {WordsTable} from './WordsTable';
import {learningTypeToIconMap} from '../model/learningTypeToIconMap';

type Props = {
  control: Control<FieldValues & CollectionFormFields>;
  collection: Collection;
};

export const CollectionAdditionalSettings = ({control, collection}: Props) => {
  const learningCards = useMemo(
    () => collection.getLearningCards().flat() || [],
    [collection],
  );

  return (
    <Details>
      <ControlledSegmentedButtons
        label={translate('types_of_exercises')}
        control={control}
        name="supportedLearningTypes"
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
      {!collection.isItNew() && (
        <WordsTable
          onDelete={collection.setCollectionItemForDeletion}
          learningCards={learningCards}
        />
      )}
    </Details>
  );
};
