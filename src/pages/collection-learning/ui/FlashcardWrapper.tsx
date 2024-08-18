import React from 'react';
import {Grid} from '../../../shared/ui/Grid';
import {FlashcardContainer} from './FlashcardContainer';

type Props = {
  children: React.ReactNode;
  footer: React.ReactNode;
  header: React.ReactNode;
};

export const FlashcardWrapper = ({children, footer, header}: Props) => (
  <Grid direction="column" fillAwailableSpace rowGap={20}>
    {header}
    <FlashcardContainer>{children}</FlashcardContainer>
    <Grid alignItems="center" justifyContent="center">
      {footer}
    </Grid>
  </Grid>
);
