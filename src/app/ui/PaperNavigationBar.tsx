import {Appbar, Menu} from 'react-native-paper';
import React from 'react';
import {getHeaderTitle} from '@react-navigation/elements';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import packageJson from '../../../package.json';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {useQuery} from '@tanstack/react-query';

export const PaperNavigationBar = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const {t} = useTranslation();
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
          theme={{colors: {primary: 'green'}}}
          onPress={() => {
            setVisible(false);
            Linking.openURL(packageJson.homepage);
          }}
          title={t('update')}
          disabled={!isUpdateReady}
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
          }}
          title={t('settings')}
        />
        <Menu.Item
          onPress={() => {
            setVisible(false);
            navigation.push('About');
          }}
          title={t('about')}
        />
      </Menu>
    </Appbar.Header>
  );
};
