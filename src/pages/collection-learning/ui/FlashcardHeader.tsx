import {Text} from 'react-native';
import {Rating} from 'ts-fsrs';
import {appSettings} from '../../../shared/model/AppSettings';
import {Grid} from '../../../shared/ui/Grid';
import {Statistics} from '../model/types';
import React from 'react';

type Props = {
  statistics: Statistics;
};

export const FlashcardHeader = ({statistics}: Props) => {
  if (!appSettings.getSetting('showAdditionalStat')) {
    return null;
  }

  return (
    <Grid justifyContent="space-between">
      <Text style={{color: 'red'}}>{statistics[Rating.Again]}</Text>
      <Text style={{color: 'orange'}}>{statistics[Rating.Hard]}</Text>
      <Text style={{color: 'greenyellow'}}>{statistics[Rating.Good]}</Text>
      <Text style={{color: 'lawngreen'}}>{statistics[Rating.Easy]}</Text>
    </Grid>
  );
};
