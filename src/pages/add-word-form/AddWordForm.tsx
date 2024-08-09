import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {ActivityIndicator, Button, IconButton, Text} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {createEmptyCard} from 'ts-fsrs';
import {
  getCollection,
  addWordToCollection,
} from '../../shared/api/async-storage';
import {getTranslations} from '../../shared/api/translations';
import {useQuery} from '../../shared/lib/useQuery';
import {PagesStackProps} from '../../shared/model/types';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {Grid} from '../../shared/ui/Grid';

export const AddWordForm = ({
  route: {
    params: {collectionId},
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

  const {data: collection, isLoading} = useQuery({
    queryFn: () => getCollection(collectionId),
    initialData: undefined,
  });

  if (isLoading) {
    return <ActivityIndicator animating size="large" />;
  } else if (!collection) {
    return <Text>Something went wrong, sorry, please return back</Text>;
  }

  const onWordSubmit = () => {
    setFlagIsValueSetted(Boolean(getValues('word')));
    getTranslations(
      getValues('word'),
      collection.sourceLanguage,
      collection.targetLanguage,
    ).then(translationResponse => {
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
    });
  };

  return (
    <Grid direction="column" rowGap={5} alignItems="stretch">
      <Grid alignItems="stretch">
        <ControlledTextInput
          control={control}
          name="word"
          label={`Word (${collection.sourceLanguage})`}
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
        label={`Translation (${collection.targetLanguage})`}
        disabled={!isValueSetted}
      />
      <ControlledTextInput
        control={control}
        name="examples"
        label="Usage examples"
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
            fsrsCard: createEmptyCard(),
          }).then(() => reset()),
        )}>
        Add word to this collection
      </Button>
    </Grid>
  );
};
