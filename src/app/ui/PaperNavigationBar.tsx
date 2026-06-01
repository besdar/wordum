import {getHeaderTitle} from '@react-navigation/elements';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Linking, StyleSheet} from 'react-native';
import {Appbar, Divider, Menu} from 'react-native-paper';
import packageJSON from '../../../package.json';
import {translate} from '../../shared/lib/i18n';
import {appSettings} from '../../shared/model/AppSettings';
import {exportData} from '../lib/export';

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});

export const PaperNavigationBar = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const [visible, setVisible] = useState(false);
  const isUpdateReady = appSettings.isUpdateAvailable();
  const updateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isUpdateReady) {
      updateAnimation.stopAnimation();
      updateAnimation.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(updateAnimation, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(updateAnimation, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [isUpdateReady, updateAnimation]);

  const updateReadyAnimationStyle = isUpdateReady
    ? {
        opacity: updateAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.65],
        }),
        transform: [
          {
            scale: updateAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.15],
            }),
          },
        ],
      }
    : undefined;

  return (
    <Appbar.Header style={styles.header}>
      {back ? <Appbar.BackAction onPress={navigation.popToTop} /> : null}
      <Appbar.Content title={getHeaderTitle(options, route.name)} />
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Animated.View style={updateReadyAnimationStyle}>
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setVisible(true)}
              color={isUpdateReady ? 'green' : undefined}
            />
          </Animated.View>
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
