import React from 'react';
import {Grid} from '../../../shared/ui/Grid';
import {FlashcardContainer} from './FlashcardContainer';
import {Statistics} from '../model/types';
import {Text} from 'react-native-paper';
import {Rating} from 'ts-fsrs';

type Props = {
  children: React.ReactNode;
  footer: React.ReactNode;
  statistics: Statistics;
};

export const FlashcardWrapper = ({children, footer, statistics}: Props) => (
  <Grid direction="column" fillAwailableSpace rowGap={20}>
    <Grid justifyContent="space-between">
      <Text style={{color: 'red'}}>{statistics[Rating.Again]}</Text>
      <Text style={{color: 'orange'}}>{statistics[Rating.Hard]}</Text>
      <Text style={{color: 'greenyellow'}}>{statistics[Rating.Good]}</Text>
      <Text style={{color: 'lawngreen'}}>{statistics[Rating.Easy]}</Text>
    </Grid>
    <FlashcardContainer>{children}</FlashcardContainer>
    <Grid alignItems="center" justifyContent="center">
      {footer}
    </Grid>
  </Grid>
);
