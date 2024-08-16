import React from 'react';
import {useForm} from 'react-hook-form';
import {AppSupportedLanguages} from '../../shared/model/collection';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AddCollectionFormFields} from '../../shared/model/collection';
import {updateCollection} from '../../shared/model/storage';
import {translate} from '../../shared/lib/i18n';
import {PagesStackProps} from '../../shared/model/navigator';
import {UpdateCollectionForm} from './ui/UpdateCollectionForm';

export const UpdateCollectionFormContainer = ({
  navigation,
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<
  PagesStackProps,
  'UpdateCollectionFormContainer'
>) => {
  const {control, handleSubmit} = useForm<AddCollectionFormFields>({
    defaultValues: {
      name: collection?.name || '',
      sourceLanguage:
        collection?.sourceLanguage || AppSupportedLanguages.ENGLISH,
      targetLanguage:
        collection?.targetLanguage || AppSupportedLanguages.RUSSIAN,
      wordsToTrain: collection?.wordsToTrain || 20,
      learningLanguage: collection?.learningLanguage || 'target',
    },
  });

  return (
    <UpdateCollectionForm
      submitText={collection ? translate('update') : translate('create')}
      control={control}
      handleSubmit={handleSubmit(data =>
        updateCollection({...(collection || {}), ...data}).then(() =>
          navigation.popToTop(),
        ),
      )}
    />
  );
};
