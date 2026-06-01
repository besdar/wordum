import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useForm} from 'react-hook-form';
import {ToastAndroid} from 'react-native';
import packageJSON from '../../../../package.json';
import {translate} from '../../../shared/lib/i18n';
import {showToastMessage} from '../../../shared/lib/message';
import {PagesStackProps} from '../../../shared/model/navigator';
import {Button} from '../../../shared/ui/Button';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {FormContainer} from '../../../shared/ui/FormContainer';
import {importCollectionFromFile} from '../lib/form';
import {ImportTabs} from '../model/navigation';

type Props = MaterialTopTabScreenProps<ImportTabs>;

export const FileToCollectionImportForm = ({navigation}: Props) => {
  const {control, handleSubmit} = useForm({
    defaultValues: {version: ''},
  });

  return (
    <FormContainer>
      <ControlledTextInput
        control={control}
        name="version"
        rules={{required: true, pattern: /\d\.\d\.\d/}}
        label={translate('app_version')}
        placeholder={packageJSON.version}
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        onPress={handleSubmit(({version}) =>
          importCollectionFromFile(version)
            .then(() =>
              navigation
                .getParent<NativeStackNavigationProp<PagesStackProps>>()
                ?.popToTop(),
            )
            .catch(() =>
              showToastMessage(
                translate('something_went_wrong'),
                ToastAndroid.LONG,
              ),
            ),
        )}>
        {translate('import')}
      </Button>
    </FormContainer>
  );
};
