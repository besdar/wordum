import React from 'react';
import {LANGUAGE_FLAGS, LANGUAGE_LIST} from '../../../shared/model/lang';
import {ControlledPicker} from '../../../shared/ui/ControlledPicker';
import {ControlledSegmentedButtons} from '../../../shared/ui/ControlledSegmentedButtons';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {Control, FieldValues} from 'react-hook-form';
import {CollectionFormFields} from '../../../shared/model/collection';
import {translate} from '../../../shared/lib/i18n';
import {Button} from '../../../shared/ui/Button';
import {FormContainer} from '../../../shared/ui/FormContainer';

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
    <FormContainer>
      <ControlledTextInput
        name="name"
        label={translate('collection_name')}
        control={control}
        rules={{required: true, maxLength: 15}}
        maxLength={15}
      />
      <ControlledPicker
        items={LANGUAGE_LIST.map(([label, value]) => ({
          value,
          label: `${LANGUAGE_FLAGS[value]} ${label}`,
        }))}
        name="sourceLanguage"
        control={control}
        label={translate('primary_language')}
      />
      <ControlledPicker
        items={LANGUAGE_LIST.map(([label, value]) => ({
          value,
          label: `${LANGUAGE_FLAGS[value]} ${label}`,
        }))}
        name="targetLanguage"
        control={control}
        label={translate('secondary_language')}
      />
      <ControlledTextInput
        mode="outlined"
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
    </FormContainer>
  );
};
