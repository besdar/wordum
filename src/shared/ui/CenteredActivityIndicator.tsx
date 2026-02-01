import {ActivityIndicator} from 'react-native-paper';
import {Grid} from './Grid';
import React from 'react';

export const CenteredActivityIndicator = () => (
  <Grid alignItems="center" justifyContent="center" fillAwailableSpace>
    <ActivityIndicator animating size="large" testID="activity-indicator" />
  </Grid>
);
