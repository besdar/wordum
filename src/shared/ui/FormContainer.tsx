import React from 'react';
import {Grid} from './Grid';
import {ScrollView} from 'react-native';

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
