import React from 'react';
import {Button} from 'react-native-paper';
import {Grid} from '../../shared/ui/Grid';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import {AppSupportedLanguages} from '../../shared/model/collection';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ControlledPicker} from '../../shared/ui/ControlledPicker';
import {Picker} from '@react-native-picker/picker';
import {AddCollectionFormFields} from '../../shared/model/collection';
import {ControlledSegmentedButtons} from '../../shared/ui/ControlledSegmentedButtons';
import {updateCollection} from '../../shared/api/storage';
import {LANGUAGE_FLAGS} from '../overview/model/consts';
import {translate} from '../../shared/lib/i18n';
import {PagesStackProps} from '../../shared/model/navigator';

const languagesList = Object.entries(AppSupportedLanguages);

export const UpdateCollectionForm = ({
  navigation,
  route: {
    params: {collection},
  },
}: NativeStackScreenProps<PagesStackProps, 'UpdateCollectionForm'>) => {
  const defaultValues = {
    name: collection?.name || '',
    sourceLanguage: collection?.sourceLanguage || AppSupportedLanguages.ENGLISH,
    targetLanguage: collection?.targetLanguage || AppSupportedLanguages.RUSSIAN,
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
        label={translate('collection_name')}
        control={control}
        rules={{required: true}}
      />
      <ControlledPicker
        name="sourceLanguage"
        control={control}
        label={translate('primary_language')}>
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
        label={translate('secondary_language')}>
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
        label={translate('words_to_learn_in_a_day')}
        control={control}
        rules={{
          required: true,
          validate: value => Number(value) > 0,
        }}
        keyboardType="numeric"
      />
      <ControlledSegmentedButtons
        label={translate('learning_language')}
        name="learningLanguage"
        control={control}
        buttons={[
          {value: 'source', label: translate('primary')},
          {value: 'target', label: translate('secondary')},
        ]}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(data =>
          updateCollection(data).then(() => navigation.popToTop()),
        )}>
        {translate('create')}
      </Button>
    </Grid>
  );
};
