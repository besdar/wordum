import React, {useMemo} from 'react';
import {Button, Text} from 'react-native-paper';
import {Grid} from '../../shared/ui/Grid';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import {PagesStackProps} from '../../shared/model/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SupportedLanguages} from '../../shared/api/translations';
import {ControlledPicker} from '../../shared/ui/ControlledPicker';
import {Picker} from '@react-native-picker/picker';
import {AddCollectionFormFields} from '../../shared/model/types';
import {View} from 'react-native';
import {ControlledSegmentedButtons} from '../../shared/ui/ControlledSegmentedButtons';
import {createCollection} from '../../shared/api/async-storage';

export const AddCollectionForm = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'AddCollectionForm'>) => {
  const languagesList = useMemo(() => Object.entries(SupportedLanguages), []);
  const {control, handleSubmit} = useForm<AddCollectionFormFields>({
    defaultValues: {
      name: '',
      sourceLanguage: SupportedLanguages.ENGLISH,
      targetLanguage: SupportedLanguages.RUSSIAN,
      wordsToTrain: 20,
      learningLanguage: 'target',
    },
  });

  return (
    <Grid direction="column" rowGap={5} padding={5} alignItems="stretch">
      <ControlledTextInput
        name="name"
        label="Collection name"
        control={control}
        rules={{required: true}}
      />
      <View>
        <Text>Primary language</Text>
        <ControlledPicker name="sourceLanguage" control={control}>
          {languagesList.map(([label, value]) => (
            <Picker.Item key={value} value={value} label={label} />
          ))}
        </ControlledPicker>
      </View>
      <View>
        <Text>Seconsary language</Text>
        <ControlledPicker name="targetLanguage" control={control}>
          {languagesList.map(([label, value]) => (
            <Picker.Item key={value} value={value} label={label} />
          ))}
        </ControlledPicker>
      </View>
      <ControlledTextInput
        name="wordsToTrain"
        label="Words to learn in a day"
        control={control}
        rules={{
          required: true,
          validate: value => Number(value) > 0,
        }}
        keyboardType="numeric"
      />
      <Text>Learning language</Text>
      <ControlledSegmentedButtons
        name="learningLanguage"
        control={control}
        buttons={[
          {value: 'source', label: 'primary'},
          {value: 'target', label: 'translation'},
        ]}
      />
      <Button
        mode="outlined"
        onPress={handleSubmit(data =>
          createCollection(data).then(() => navigation.popToTop()),
        )}>
        Create
      </Button>
    </Grid>
  );
};
