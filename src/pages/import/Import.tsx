import React from 'react';
import {Grid} from '../../shared/ui/Grid';
import {useForm} from 'react-hook-form';
import {
  Collection,
  CollectionFormFields,
  getInitialCollection,
} from '../../shared/model/collection';
import {translate} from '../../shared/lib/i18n';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {Text} from 'react-native-paper';
import {UpdateCollectionForm} from '../update-collection-form/ui/UpdateCollectionForm';
import {parseTextToCollectionWords} from './lib/parsing';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PagesStackProps} from '../../shared/model/navigator';
import {CollectionAdditionalSettings} from '../update-collection-form/ui/CollectionAdditionalSettings';

type FormValues = CollectionFormFields & {text: string};

export const Import = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Import'>) => {
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {...getInitialCollection(), text: ''},
  });

  return (
    <Grid direction="column">
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
            .then(() => navigation.popToTop()),
        )}
        // @ts-ignore - TODO: extend control values to fix typescript issue
        control={control}
        submitText={translate('import')}>
        <Text>{translate('import_rules')}</Text>
        <ControlledTextInput
          rules={{
            required: true,
            validate: value => {
              const lines = value.toString().split('\n').filter(Boolean);

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const isLineOk = /^[^;\n]+;[^;\n]+$/.test(line.trim());

                if (!isLineOk) {
                  return `${translate('import_line_error_message')} ${i + 1}`;
                }
              }

              return true;
            },
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
