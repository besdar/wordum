import {Linking, ScrollView} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React from 'react';
import packageJSON from '../../../package.json';
import {translate} from '../../shared/lib/i18n';

export const About = () => {
  return (
    <ScrollView>
      <Text>{translate('about_text')}</Text>
      <Button onPress={() => Linking.openURL(packageJSON.homepage)}>
        {translate('open_project_page')}
      </Button>
      <Text>
        {translate('app_version')}: {`${packageJSON.version} (beta)`}
      </Text>
    </ScrollView>
  );
};
