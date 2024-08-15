import React from 'react';
import {Grid} from '../../../shared/ui/Grid';
import {ViewStyle} from 'react-native';

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
