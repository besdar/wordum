import React from 'react';
import {ControlledPicker} from '../../shared/ui/ControlledPicker';
import {useForm} from 'react-hook-form';
import {translate} from '../../shared/lib/i18n';
import {Button} from '../../shared/ui/Button';
import {APISources} from '../../shared/model/apiSources';
import {appSettings, AppSettingsValues} from '../../shared/model/AppSettings';
import {ControlledSwitcher} from '../../shared/ui/ControlledSwitcher';
import {FormContainer} from '../../shared/ui/FormContainer';
import {Details} from '../../shared/ui/Details';
import {ControlledTextInput} from '../../shared/ui/ControlledTextInput';
import {showToastMessage} from '../../shared/lib/message';

export const Settings = () => {
  const {control, handleSubmit} = useForm<AppSettingsValues>({
    defaultValues: appSettings.getSettings(),
  });

  return (
    <FormContainer>
      <ControlledPicker
        items={[
          {
            value: APISources.ReversoContextUnofficial,
            label: 'Reverso Context [Unofficial]',
          },
          {
            value: APISources.GoogleTranslateUnofficial,
            label: 'Google Translate [Unofficial]',
          },
        ]}
        control={control}
        name="apiSource"
        label={translate('api_source')}
      />
      <ControlledSwitcher
        control={control}
        name="showAdditionalStat"
        label={translate('show_additional_statistics')}
      />
      <Details>
        <ControlledTextInput
          control={control}
          name="timeTakenPerCharacterInput"
          label={translate('time_per_letter_input')}
          keyboardType="numeric"
          rules={{required: true, validate: value => Number(value) > 0}}
        />
        <ControlledTextInput
          control={control}
          name="timeGradeLimitEasy"
          label={translate('time_easy_grade')}
          keyboardType="numeric"
          rules={{required: true, validate: value => Number(value) > 0}}
        />
        <ControlledTextInput
          control={control}
          name="timeGradeLimitGood"
          label={translate('time_good_grade')}
          keyboardType="numeric"
          rules={{required: true, validate: value => Number(value) > 0}}
        />
      </Details>
      <Button
        mode="contained"
        onPress={handleSubmit(data =>
          appSettings
            .setSettings(data)
            .then(() => showToastMessage(translate('settings_saved'))),
        )}>
        {translate('save')}
      </Button>
    </FormContainer>
  );
};
