import React, {useMemo} from 'react';
import {Control, FieldValues} from 'react-hook-form';
import {CollectionExerciseSettings} from '../../../features/collection-form';
import {
  Collection,
  CollectionFormFields,
} from '../../../shared/model/collection';
import {Details} from '../../../shared/ui/Details';
import {WordsTable} from './WordsTable';

type Props<T extends CollectionFormFields & FieldValues> = {
  control: Control<T>;
  collection?: Collection;
};

export const CollectionAdditionalSettings = <
  T extends CollectionFormFields & FieldValues,
>({
  control,
  collection,
}: Props<T>) => {
  const learningCards = useMemo(
    () => collection?.getLearningCards().flat() || [],
    [collection],
  );

  return (
    <Details>
      <CollectionExerciseSettings control={control} />
      {Boolean(collection) && !collection!.isItNew() && (
        <WordsTable
          onDelete={collectionItem =>
            collection!.setCollectionItemForDeletion(collectionItem)
          }
          learningCards={learningCards}
        />
      )}
    </Details>
  );
};
