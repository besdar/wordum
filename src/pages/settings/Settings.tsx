import React from 'react';
import {ControlledPicker} from '../../shared/ui/ControlledPicker';
import {useForm} from 'react-hook-form';
import {Picker} from '@react-native-picker/picker';
import {translate} from '../../shared/lib/i18n';
import {Grid} from '../../shared/ui/Grid';
import {Button} from '../../shared/ui/Button';
import {APISources} from '../../shared/model/apiSources';
import {appSettings, AppSettingsValues} from '../../shared/config/AppSettings';

export const Settings = () => {
  const {control, handleSubmit} = useForm<AppSettingsValues>({
    defaultValues: {apiSource: appSettings.getSetting('apiSource')},
  });

  return (
    <Grid direction="column" rowGap={10}>
      <ControlledPicker
        control={control}
        name="apiSource"
        label={translate('api_source')}>
        <Picker.Item
          value={APISources.ReversoContextUnofficial}
          label="Reverso Context [Unofficial]"
        />
        <Picker.Item
          value={APISources.GoogleTranslateUnofficial}
          label="Google Translate [Unofficial]"
        />
      </ControlledPicker>
      <Button mode="contained" onPress={handleSubmit(appSettings.setSettings)}>
        {translate('save')}
      </Button>
    </Grid>
  );
};
