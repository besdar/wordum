import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {Rating} from 'ts-fsrs';
import {appSettings} from '../../../shared/model/AppSettings';
import {Grid} from '../../../shared/ui/Grid';
import {Statistics} from '../model/types';

const styles = StyleSheet.create({
  again: {
    color: 'red',
  },
  hard: {
    color: 'orange',
  },
  good: {
    color: 'greenyellow',
  },
  easy: {
    color: 'lawngreen',
  },
});

type Props = {
  statistics: Statistics;
};

export const FlashcardHeader = ({statistics}: Props) => {
  if (!appSettings.getSetting('showAdditionalStat')) {
    return null;
  }

  return (
    <Grid justifyContent="space-between">
      <Text style={styles.again}>{statistics[Rating.Again]}</Text>
      <Text style={styles.hard}>{statistics[Rating.Hard]}</Text>
      <Text style={styles.good}>{statistics[Rating.Good]}</Text>
      <Text style={styles.easy}>{statistics[Rating.Easy]}</Text>
    </Grid>
  );
};
