import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {useForm} from 'react-hook-form';
import {CollectionForm} from '../../features/collection-form';
import {translate} from '../../shared/lib/i18n';
import {
  Collection,
  CollectionFormFields,
  getInitialCollection,
} from '../../shared/model/collection';
import {PagesStackProps} from '../../shared/model/navigator';
import {CollectionAdditionalSettings} from './ui/CollectionAdditionalSettings';

export const UpdateCollectionFormContainer = ({
  navigation,
  route: {
    params: {collection = new Collection()},
  },
}: NativeStackScreenProps<
  PagesStackProps,
  'UpdateCollectionFormContainer'
>) => {
  const {control, handleSubmit} = useForm<CollectionFormFields>({
    defaultValues: {
      ...getInitialCollection(),
      ...JSON.parse(
        JSON.stringify(collection.dangerouslyGetInnerObject() || {}),
      ),
    },
  });

  return (
    <CollectionForm
      submitText={
        collection.isItNew() ? translate('create') : translate('update')
      }
      control={control}
      handleSubmit={handleSubmit(data =>
        collection.saveCollection(data).then(() => navigation.popToTop()),
      )}>
      <CollectionAdditionalSettings control={control} collection={collection} />
    </CollectionForm>
  );
};
