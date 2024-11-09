import React from 'react';
import {useForm} from 'react-hook-form';
import {
  getInitialCollection,
  Collection,
  CollectionFormFields,
} from '../../../shared/model/collection';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {CollectionAdditionalSettings} from '../../update-collection-form/ui/CollectionAdditionalSettings';
import {UpdateCollectionForm} from '../../update-collection-form/ui/UpdateCollectionForm';
import {validateTextForTheImport} from '../lib/form';
import {parseTextToCollectionWords} from '../lib/parsing';
import {translate} from '../../../shared/lib/i18n';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {ImportTabs} from '../model/navigation';
import {Text} from 'react-native-paper';

type Props = MaterialTopTabScreenProps<ImportTabs>;

type FormValues = CollectionFormFields & {text: string};

export const TextToCollectionImportForm = ({navigation}: Props) => {
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {...getInitialCollection(), text: ''},
  });

  return (
    <UpdateCollectionForm
      handleSubmit={handleSubmit(data =>
        new Collection()
          .saveCollection({
            ...data,
            words: parseTextToCollectionWords(
              data.text,
              data.learningLanguage,
              data.supportedLearningTypes,
            ),
          })
          // @ts-expect-error: TODO: add parent navigation types to this nested one
          .then(() => navigation.popToTop()),
      )}
      // @ts-ignore - TODO: extend control values to fix typescript issue
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
      <CollectionAdditionalSettings
        // @ts-ignore - TODO: extend control values to fix typescript issue
        control={control}
      />
    </UpdateCollectionForm>
  );
};
