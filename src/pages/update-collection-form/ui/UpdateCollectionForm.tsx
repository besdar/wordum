import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {LANGUAGE_FLAGS, LANGUAGE_LIST} from '../../../shared/config/consts';
import {ControlledPicker} from '../../../shared/ui/ControlledPicker';
import {ControlledSegmentedButtons} from '../../../shared/ui/ControlledSegmentedButtons';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {Grid} from '../../../shared/ui/Grid';
import {Control, FieldValues} from 'react-hook-form';
import {CollectionFormFields} from '../../../shared/model/collection';
import {translate} from '../../../shared/lib/i18n';
import {Button} from '../../../shared/ui/Button';
import {ScrollView} from 'react-native';

type Props = {
  control: Control<FieldValues & CollectionFormFields>;
  handleSubmit: () => void;
  submitText: string;
  children?: React.ReactNode;
};

export const UpdateCollectionForm = ({
  control,
  handleSubmit,
  submitText,
  children = null,
}: Props) => {
  return (
    <ScrollView>
      <Grid direction="column" rowGap={5} padding={5} alignItems="stretch">
        <ControlledTextInput
          name="name"
          label={translate('collection_name')}
          control={control}
          rules={{required: true, maxLength: 15}}
          maxLength={15}
        />
        <ControlledPicker
          name="sourceLanguage"
          control={control}
          label={translate('primary_language')}>
          {LANGUAGE_LIST.map(([label, value]) => (
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
          {LANGUAGE_LIST.map(([label, value]) => (
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
        {children}
        <Button mode="contained" onPress={handleSubmit}>
          {submitText}
        </Button>
      </Grid>
    </ScrollView>
  );
};
