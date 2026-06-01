import React from 'react';
import {ViewStyle} from 'react-native';
import {Grid} from '../../../shared/ui/Grid';

type Props = {
  children: React.ReactNode;
  borderColor?: ViewStyle['borderColor'];
};

export const FlashcardContainer = ({children, borderColor}: Props) => (
  <Grid
    direction="column"
    rowGap={10}
    fillAwailableSpace
    alignItems="center"
    justifyContent="center"
    surfaceProps={{style: {borderRadius: 10, borderColor}}}>
    {children}
  </Grid>
);
