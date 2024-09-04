import React from 'react';
import {useForm} from 'react-hook-form';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getTranslation} from './api/translation';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {Grid} from '../../shared/ui/Grid';
import {translate} from '../../shared/lib/i18n';
import {Button} from '../../shared/ui/Button';
import {PagesStackProps} from '../../shared/model/navigator';
import {showToastMessage} from '../../shared/lib/message';
import {IconButton} from '../../shared/ui/IconButton';
import {addWordToCollection} from '../collection-learning/model/storage';
import {FormContainer} from '../../shared/ui/FormContainer';
import {LANGUAGE_FLAGS} from '../../shared/model/lang';

export const AddWordForm = ({
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<PagesStackProps, 'AddWordForm'>) => {
  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: {dirtyFields},
  } = useForm({
    defaultValues: {
      word: '',
      translation: '',
      examples: '',
      targetVoice: '',
      sourceVoice: '',
    },
  });

  const onWordSubmit = () =>
    getTranslation(
      getValues('word'),
      collection.getProperty('sourceLanguage'),
      collection.getProperty('targetLanguage'),
      collection.getProperty('learningLanguage'),
    )
      .then(translationResponse => {
        setValue('translation', translationResponse.translation);
        setValue('examples', translationResponse.examples || '');
        setValue('targetVoice', translationResponse.targetVoice || '');
        setValue('sourceVoice', translationResponse.sourceVoice || '');
      })
      .catch(() =>
        showToastMessage(translate('error_retrieving_translation_data')),
      );

  return (
    <FormContainer>
      <Grid alignItems="stretch">
        <ControlledTextInput
          control={control}
          name="word"
          label={`${translate('word')} (${
            LANGUAGE_FLAGS[collection.getProperty('sourceLanguage')]
          })`}
          rules={{required: true}}
          onSubmitEditing={onWordSubmit}
        />
        <IconButton
          icon="translate"
          onPress={onWordSubmit}
          disabled={!dirtyFields.word}
        />
      </Grid>
      <ControlledTextInput
        rules={{required: true}}
        control={control}
        name="translation"
        label={`${translate('translation')} (${
          LANGUAGE_FLAGS[collection.getProperty('targetLanguage')]
        })`}
        disabled={!dirtyFields.word}
        helperText={
          collection.getProperty('learningLanguage') === 'target'
            ? translate('target_learning_language_word_addition_warning')
            : undefined
        }
      />
      <ControlledTextInput
        control={control}
        name="examples"
        label={translate('usage_examples')}
        disabled={!dirtyFields.word}
        multiline
      />
      <Button
        mode="outlined"
        onPress={handleSubmit(onValid =>
          addWordToCollection(collection, {
            value: onValid.word.trim(),
            examples: onValid.examples.trim(),
            translation: onValid.translation.trim(),
            targetVoice: onValid.targetVoice,
            sourceVoice: onValid.sourceVoice,
          })
            .then(() => reset())
            .catch(() => showToastMessage(translate('error_saving_your_card'))),
        )}>
        {translate('add_word_to_this_collection')}
      </Button>
    </FormContainer>
  );
};
