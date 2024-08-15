import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {IconButton} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {addWordToCollection} from '../../shared/api/storage';
import {getTranslation} from './api/translation';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {Grid} from '../../shared/ui/Grid';
import {translate} from '../../shared/lib/i18n';
import {Button} from '../../shared/ui/Button';
import {PagesStackProps} from '../../shared/model/navigator';
import {showToastMessage} from '../../shared/lib/message';

export const AddWordForm = ({
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<PagesStackProps, 'AddWordForm'>) => {
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
    getTranslation(
      getValues('word'),
      collection.sourceLanguage,
      collection.targetLanguage,
      collection.learningLanguage,
    )
      .then(translationResponse => {
        setValue('translation', translationResponse.translation);
        setValue('examples', translationResponse.examples || '');
        setValue('targetVoice', translationResponse.targetVoice || '');
        setValue('sourceVoice', translationResponse.sourceVoice || '');
      })
      .catch(() =>
        showToastMessage(translate('error_retrieving_translation_data')),
      )
      .finally(() => setFlagIsValueSetted(true));
  };

  return (
    <Grid direction="column" rowGap={5} alignItems="stretch">
      <Grid alignItems="stretch">
        <ControlledTextInput
          control={control}
          name="word"
          label={`${translate('word')} (${collection.sourceLanguage})`}
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
        label={`${translate('translation')} (${collection.targetLanguage})`}
        disabled={!isValueSetted}
      />
      <ControlledTextInput
        control={control}
        name="examples"
        label={translate('usage_examples')}
        disabled={!isValueSetted}
      />
      <Button
        mode="outlined"
        onPress={handleSubmit(onValid =>
          addWordToCollection(collection.id, {
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
    </Grid>
  );
};
