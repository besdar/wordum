import {View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';

export const About = () => (
  <View>
    <Text>
      Welcome to Wordum, your go-to app for learning languages and expanding
      your vocabulary! Simply input a word or phrase, and this app will
      automatically fill in translations, audio, and usage examples. With
      engaging listening and writing exercises, Wordum adapts to your learning
      style using the Open Spaced Repetition algorithm, similar to that of the
      Anki app. This is an open-source project licensed under GPL-3 license with
      no tracking included. If you encounter any issues or bugs, it would be
      highly appreciated if you report them by creating an issue on the
      project's GitHub page. Your feedback is invaluable in helping to improve
      Wordum!
    </Text>
    <Text>
      If you appreciate my work and would like to support the project, please
      consider making a donation here. Thank you for your support!
    </Text>
  </View>
);
