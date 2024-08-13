import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Button, IconButton} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {addWordToCollection} from '../../shared/api/async-storage';
import {getTranslations} from '../../shared/api/translations';
import {PagesStackProps} from '../../shared/model/types';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {Grid} from '../../shared/ui/Grid';
import {ToastAndroid} from 'react-native';
import {useTranslation} from 'react-i18next';

export const AddWordForm = ({
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<PagesStackProps, 'AddWordForm'>) => {
  const {t} = useTranslation();
  const [isValueSetted, setFlagIsValueSetted] = useState(false);
  const {control, getValues, setValue, handleSubmit, reset} = useForm({
    defaultValues: {
      word: '',
      translation: '',
      examples: '',
      targetVoice: '',
      sourceVoice: '',
    },
  });

  const onWordSubmit = () => {
    getTranslations(
      getValues('word'),
      collection.sourceLanguage,
      collection.targetLanguage,
    )
      .then(translationResponse => {
        setValue(
          'translation',
          Array.from(new Set(translationResponse.translations))
            .slice(0, 3)
            .join(', '),
        );
        setValue(
          'examples',
          translationResponse.context?.examples
            .slice(0, 3)
            .map(result => result[collection.learningLanguage])
            .join(' ') || '',
        );
        setValue('targetVoice', translationResponse.voice || '');
        setValue('sourceVoice', translationResponse.sourceVoice || '');
      })
      .catch(() =>
        ToastAndroid.show(
          t('error_retrieving_translation_data'),
          ToastAndroid.SHORT,
        ),
      )
      .finally(() => setFlagIsValueSetted(true));
  };

  return (
    <Grid direction="column" rowGap={5} alignItems="stretch">
      <Grid alignItems="stretch">
        <ControlledTextInput
          control={control}
          name="word"
          label={`${t('word')} (${collection.sourceLanguage})`}
          rules={{required: true}}
          onPress={() => setFlagIsValueSetted(false)}
          onSubmitEditing={onWordSubmit}
          viewProps={{style: {flexGrow: 1}}}
        />
        <IconButton icon="check" onPress={onWordSubmit} />
      </Grid>
      <ControlledTextInput
        rules={{required: true}}
        control={control}
        name="translation"
        label={`${t('translation')} (${collection.targetLanguage})`}
        disabled={!isValueSetted}
      />
      <ControlledTextInput
        control={control}
        name="examples"
        label={t('usage_examples')}
        disabled={!isValueSetted}
      />
      <Button
        mode="outlined"
        onPress={handleSubmit(onValid =>
          addWordToCollection(collection.id, {
            value: onValid.word,
            examples: onValid.examples,
            translation: onValid.translation,
            targetVoice: onValid.targetVoice,
            sourceVoice: onValid.sourceVoice,
          })
            .then(() => reset())
            .catch(() =>
              ToastAndroid.show(
                t('error_saving_your_card'),
                ToastAndroid.SHORT,
              ),
            ),
        )}>
        {t('add_word_to_this_collection')}
      </Button>
    </Grid>
  );
};
