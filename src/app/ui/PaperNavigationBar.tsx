import {Appbar, Divider, Menu} from 'react-native-paper';
import React, {useState} from 'react';
import {getHeaderTitle} from '@react-navigation/elements';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import packageJSON from '../../../package.json';
import {Linking} from 'react-native';
import {translate} from '../../shared/lib/i18n';
import {appSettings} from '../../shared/model/AppSettings';
import {exportData} from '../lib/export';

export const PaperNavigationBar = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const [visible, setVisible] = useState(false);
  const isUpdateReady = appSettings.isUpdateAvailable();

  return (
    <Appbar.Header style={{backgroundColor: 'transparent'}}>
      {back ? <Appbar.BackAction onPress={navigation.popToTop} /> : null}
      <Appbar.Content title={getHeaderTitle(options, route.name)} />
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => setVisible(true)}
            // TODO: add an animation here
            color={isUpdateReady ? 'green' : undefined}
          />
        }>
        {isUpdateReady && (
          <Menu.Item
            leadingIcon="arrow-down-bold-circle"
            theme={{colors: {primary: 'green'}}}
            onPress={() => {
              setVisible(false);
              Linking.openURL(`${packageJSON.homepage}/releases/latest`);
            }}
            title={translate('update')}
          />
        )}
        <Menu.Item
          leadingIcon="tray-arrow-down"
          onPress={() => {
            setVisible(false);
            navigation.push('Import');
          }}
          title={translate('collection_import')}
        />
        <Menu.Item
          leadingIcon="tray-arrow-up"
          onPress={() => exportData().finally(() => setVisible(false))}
          title={translate('data_export')}
        />
        <Menu.Item
          leadingIcon="cog"
          onPress={() => {
            setVisible(false);
            navigation.navigate('Settings');
          }}
          title={translate('settings')}
        />
        <Divider />
        <Menu.Item
          leadingIcon="information"
          onPress={() => {
            setVisible(false);
            Linking.openURL(packageJSON.homepage);
          }}
          title={`${translate('app_version')}: ${packageJSON.version}`}
        />
      </Menu>
    </Appbar.Header>
  );
};
