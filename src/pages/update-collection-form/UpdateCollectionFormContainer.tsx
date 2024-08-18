import React from 'react';
import {useForm} from 'react-hook-form';
import {LearningType} from '../../shared/model/collection';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CollectionFormFields} from '../../shared/model/collection';
import {updateCollection} from '../../shared/model/storage';
import {translate} from '../../shared/lib/i18n';
import {PagesStackProps} from '../../shared/model/navigator';
import {UpdateCollectionForm} from './ui/UpdateCollectionForm';
import {CollectionAdditionalSettings} from './ui/CollectionAdditionalSettings';
import {AppSupportedLanguages} from '../../shared/model/lang';

export const UpdateCollectionFormContainer = ({
  navigation,
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<
  PagesStackProps,
  'UpdateCollectionFormContainer'
>) => {
  const {control, handleSubmit} = useForm<CollectionFormFields>({
    defaultValues: {
      name: collection?.name || '',
      sourceLanguage:
        collection?.sourceLanguage || AppSupportedLanguages.ENGLISH,
      targetLanguage:
        collection?.targetLanguage || AppSupportedLanguages.RUSSIAN,
      wordsToTrain: collection?.wordsToTrain || 20,
      learningLanguage: collection?.learningLanguage || 'target',
      typesOfCardsToGenerate: collection?.typesOfCardsToGenerate || [
        LearningType.Flascards,
        LearningType.Listening,
        LearningType.Writing,
      ],
      words: {},
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
      )}>
      <CollectionAdditionalSettings control={control} />
    </UpdateCollectionForm>
  );
};
