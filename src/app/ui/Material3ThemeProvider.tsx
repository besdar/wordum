import React from 'react';
import {useColorScheme} from 'react-native';
import {Provider as PaperProvider, ProviderProps} from 'react-native-paper';
import {CombinedDarkTheme, CombinedDefaultTheme} from '../../shared/ui/theme';

export function Material3ThemeProvider({
  children,
  ...otherProps
}: ProviderProps) {
  const colorScheme = useColorScheme();

  const paperTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <PaperProvider theme={paperTheme} {...otherProps}>
      {children}
    </PaperProvider>
  );
}
