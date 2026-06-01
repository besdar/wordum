import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useAppTheme} from '../../shared/ui/theme';

export const AppNavigator = ({children}: {children: React.ReactNode}) => {
  const theme = useAppTheme();

  return <NavigationContainer theme={theme}>{children}</NavigationContainer>;
};
