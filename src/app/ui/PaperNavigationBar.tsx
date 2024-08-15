import {Appbar, Menu} from 'react-native-paper';
import React from 'react';
import {getHeaderTitle} from '@react-navigation/elements';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import packageJson from '../../../package.json';
import {Linking} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {translate} from '../../shared/lib/i18n';

export const PaperNavigationBar = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const [visible, setVisible] = React.useState(false);

  const {data} = useQuery({
    initialData: packageJson.version,
    queryFn: () =>
      fetch(`${packageJson.homepage}/main/package.json`)
        .then(res => res.json())
        .then(res => res.version || packageJson.version)
        .catch(() => packageJson.version),
    queryKey: ['packageJsonVersion'],
  });

  const isUpdateReady = packageJson.version !== data;

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.popToTop} /> : null}
      <Appbar.Content title={getHeaderTitle(options, route.name)} />
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => setVisible(true)}
            color={isUpdateReady ? 'green' : undefined}
          />
        }>
        <Menu.Item
          leadingIcon="arrow-down-bold-circle"
          theme={{colors: {primary: 'green'}}}
          onPress={() => {
            setVisible(false);
            Linking.openURL(packageJson.homepage);
          }}
          title={translate('update')}
          disabled={!isUpdateReady}
        />
        <Menu.Item
          leadingIcon="tray-arrow-down"
          onPress={() => {
            setVisible(false);
            navigation.push('Import');
          }}
          title={translate('collection_import')}
        />
        <Menu.Item
          leadingIcon="cog"
          onPress={() => {
            setVisible(false);
            navigation.navigate('Settings');
          }}
          title={translate('settings')}
        />
        <Menu.Item
          leadingIcon="information"
          onPress={() => {
            setVisible(false);
            navigation.push('About');
          }}
          title={translate('about')}
        />
      </Menu>
    </Appbar.Header>
  );
};
