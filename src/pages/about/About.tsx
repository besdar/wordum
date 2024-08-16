import {Linking, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import packageJSON from '../../../package.json';
import {useAppTheme} from '../../app/ui/Material3ThemeProvider';
import {appSettings} from '../../shared/config/AppSettings';

export const About = () => {
  const theme = useAppTheme();

  return (
    <View>
      <Text>
        Welcome to Wordum, your go-to app for learning languages and expanding
        your vocabulary! Simply input a word or phrase, and this app will
        automatically fill in translations, audio, and usage examples. With
        engaging listening and writing exercises, Wordum adapts to your learning
        style using the Open Spaced Repetition algorithm, similar to that of the
        Anki app. This is{' '}
        <Text
          style={{color: theme.colors.primary}}
          onPress={() => Linking.openURL(packageJSON.homepage)}>
          an open-source project
        </Text>{' '}
        licensed under GPL-3 license with no tracking included. If you encounter
        any issues or bugs, it would be highly appreciated if you report them by
        creating an issue on the project's GitHub page. Your feedback is
        invaluable in helping to improve Wordum!
      </Text>
      <Text>
        If you appreciate my work and would like to support the project, please
        consider making a donation here. Thank you for your support!
      </Text>
      <Text>
        App version: {packageJSON.version}{' '}
        {appSettings.isUpdateAvailable() && (
          <Text style={{color: theme.colors.primary}}>
            {' '}
            (update available!)
          </Text>
        )}
      </Text>
    </View>
  );
};
