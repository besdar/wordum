import React from 'react';
import {Grid} from '../../../shared/ui/Grid';

type Props = {
  children: React.ReactNode;
};

export const FlashcardContainer = ({children}: Props) => (
  <Grid
    direction="column"
    rowGap={10}
    fillAwailableSpace
    alignItems="center"
    justifyContent="center"
    surfaceProps={{style: {borderRadius: 10}}}>
    {children}
  </Grid>
);
