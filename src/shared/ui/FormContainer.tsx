import React from 'react';
import {ScrollView} from 'react-native';
import {Grid} from './Grid';

type Props = {
  children: React.ReactNode;
};

export const FormContainer = ({children}: Props) => (
  <ScrollView>
    <Grid direction="column" rowGap={10} padding={5} alignItems="stretch">
      {children}
    </Grid>
  </ScrollView>
);
