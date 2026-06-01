import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useForm} from 'react-hook-form';
import {Text} from 'react-native-paper';
import {
  CollectionExerciseSettings,
  CollectionForm,
} from '../../../features/collection-form';
import {translate} from '../../../shared/lib/i18n';
import {
  getInitialCollection,
  Collection,
  CollectionFormFields,
} from '../../../shared/model/collection';
import {PagesStackProps} from '../../../shared/model/navigator';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {validateTextForTheImport} from '../lib/form';
import {parseTextToCollectionWords} from '../lib/parsing';
import {ImportTabs} from '../model/navigation';

type Props = MaterialTopTabScreenProps<ImportTabs>;

type FormValues = CollectionFormFields & {text: string};

export const TextToCollectionImportForm = ({navigation}: Props) => {
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {...getInitialCollection(), text: ''},
  });

  return (
    <CollectionForm
      handleSubmit={handleSubmit(({text, ...collectionData}) =>
        new Collection()
          .saveCollection({
            ...collectionData,
            words: parseTextToCollectionWords(
              text,
              collectionData.learningLanguage,
              collectionData.supportedLearningTypes,
            ),
          })
          .then(() =>
            navigation
              .getParent<NativeStackNavigationProp<PagesStackProps>>()
              ?.popToTop(),
          ),
      )}
      control={control}
      submitText={translate('import')}>
      <Text>{translate('import_rules')}</Text>
      <ControlledTextInput
        rules={{
          required: true,
          validate: validateTextForTheImport,
        }}
        placeholder={`${translate('primary_word')}; ${translate(
          'secondary_word',
        )}; ${translate('usage_examples')}\n${translate('primary_word')} 2; ${translate(
          'secondary_word',
        )} 2; ${translate('usage_examples')} 2\n...`}
        control={control}
        name="text"
        multiline
        numberOfLines={10}
        label={translate('text_for_import')}
      />
      <CollectionExerciseSettings control={control} />
    </CollectionForm>
  );
};
