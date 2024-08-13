import React, {useMemo} from 'react';
import {Button} from 'react-native-paper';
import {Grid} from '../../shared/ui/Grid';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import {PagesStackProps} from '../../shared/model/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SupportedLanguages} from '../../shared/api/translations';
import {ControlledPicker} from '../../shared/ui/ControlledPicker';
import {Picker} from '@react-native-picker/picker';
import {AddCollectionFormFields} from '../../shared/model/types';
import {ControlledSegmentedButtons} from '../../shared/ui/ControlledSegmentedButtons';
import {updateCollection} from '../../shared/api/async-storage';
import {LANGUAGE_FLAGS} from '../overview/model/consts';
import {useTranslation} from 'react-i18next';

export const UpdateCollectionForm = ({
  navigation,
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<PagesStackProps, 'UpdateCollectionForm'>) => {
  const {t} = useTranslation();
  const languagesList = useMemo(() => Object.entries(SupportedLanguages), []);
  const defaultValues = {
    name: collection?.name || '',
    sourceLanguage: collection?.sourceLanguage || SupportedLanguages.ENGLISH,
    targetLanguage: collection?.targetLanguage || SupportedLanguages.RUSSIAN,
    wordsToTrain: collection?.wordsToTrain || 20,
    learningLanguage: collection?.learningLanguage || 'target',
  };
  const {control, handleSubmit} = useForm<AddCollectionFormFields>({
    defaultValues,
  });

  return (
    <Grid direction="column" rowGap={5} padding={5} alignItems="stretch">
      <ControlledTextInput
        name="name"
        label={t('collection_name')}
        control={control}
        rules={{required: true}}
      />
      <ControlledPicker
        name="sourceLanguage"
        control={control}
        label={t('primary_language')}>
        {languagesList.map(([label, value]) => (
          <Picker.Item
            key={value}
            value={value}
            label={`${LANGUAGE_FLAGS[value]} ${label}`}
          />
        ))}
      </ControlledPicker>
      <ControlledPicker
        name="targetLanguage"
        control={control}
        label={t('secondary_language')}>
        {languagesList.map(([label, value]) => (
          <Picker.Item
            key={value}
            value={value}
            label={`${LANGUAGE_FLAGS[value]} ${label}`}
          />
        ))}
      </ControlledPicker>
      <ControlledTextInput
        name="wordsToTrain"
        label={t('words_to_learn_in_a_day')}
        control={control}
        rules={{
          required: true,
          validate: value => Number(value) > 0,
        }}
        keyboardType="numeric"
      />
      <ControlledSegmentedButtons
        label={t('learning_language')}
        name="learningLanguage"
        control={control}
        buttons={[
          {value: 'source', label: t('primary')},
          {value: 'target', label: t('secondary')},
        ]}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(data =>
          updateCollection(data).then(() => navigation.popToTop()),
        )}>
        {t('create')}
      </Button>
    </Grid>
  );
};
