import React from 'react';
import {useAppTheme} from './Material3ThemeProvider';
import {NavigationContainer} from '@react-navigation/native';

export const AppNavigator = ({children}: {children: React.ReactNode}) => {
  const theme = useAppTheme();

  return <NavigationContainer theme={theme}>{children}</NavigationContainer>;
};
