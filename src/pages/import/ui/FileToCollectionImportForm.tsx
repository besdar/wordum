import React from 'react';
import {ToastAndroid} from 'react-native';
import {showToastMessage} from '../../../shared/lib/message';
import {Button} from '../../../shared/ui/Button';
import {FormContainer} from '../../../shared/ui/FormContainer';
import {importCollectionFromFile} from '../lib/form';
import {translate} from '../../../shared/lib/i18n';
import {ControlledTextInput} from '../../../shared/ui/ControlledTextInput';
import {useForm} from 'react-hook-form';
import packageJSON from '../../../../package.json';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
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
            // @ts-expect-error: TODO: add parent navigation types to this nested one
            .then(() => navigation.popToTop())
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
