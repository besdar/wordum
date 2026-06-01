import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {Grid} from './Grid';

export const CenteredActivityIndicator = () => (
  <Grid alignItems="center" justifyContent="center" fillAwailableSpace>
    <ActivityIndicator animating size="large" testID="activity-indicator" />
  </Grid>
);
