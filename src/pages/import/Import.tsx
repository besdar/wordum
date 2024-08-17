import React from 'react';
import {Grid} from '../../shared/ui/Grid';
import {useForm} from 'react-hook-form';
import {
  CollectionFormFields,
  LearningType,
} from '../../shared/model/collection';
import {translate} from '../../shared/lib/i18n';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {Text} from 'react-native-paper';
import {UpdateCollectionForm} from '../update-collection-form/ui/UpdateCollectionForm';
import {importCollection} from './model/storage';
import {parseTextToCollectionWords} from './lib/parsing';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PagesStackProps} from '../../shared/model/navigator';
import {CollectionAdditionalSettings} from '../update-collection-form/ui/CollectionAdditionalSettings';
import {AppSupportedLanguages} from '../../shared/config/lang';

type FormValues = CollectionFormFields & {text: string};

export const Import = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Import'>) => {
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      name: '',
      sourceLanguage: AppSupportedLanguages.ENGLISH,
      targetLanguage: AppSupportedLanguages.RUSSIAN,
      wordsToTrain: 20,
      learningLanguage: 'target',
      text: '',
      words: {},
      typesOfCardsToGenerate: [LearningType.Flascards, LearningType.Writing],
    },
  });

  return (
    <Grid direction="column">
      <UpdateCollectionForm
        handleSubmit={handleSubmit(data =>
          importCollection(
            data,
            parseTextToCollectionWords(
              data.text,
              data.learningLanguage,
              data.typesOfCardsToGenerate,
            ),
          ).then(() => navigation.popToTop()),
        )}
        // @ts-ignore - TODO: extend control values to fix typescript issue
        control={control}
        submitText={translate('import')}>
        <Text>{translate('import_rules')}</Text>
        <ControlledTextInput
          rules={{
            required: true,
            validate: value =>
              value
                .toString()
                .split('\n')
                .filter(Boolean)
                // TODO: provide feedback error message to the user
                .every(line => /^[^;\n]+;[^;\n]+$/.test(line.trim())),
          }}
          placeholder={`${translate('primary_word')}; ${translate(
            'secondary_word',
          )}\n${translate('primary_word')}2; ${translate(
            'secondary_word',
          )}2\n...`}
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
    </Grid>
  );
};
