import {useColorScheme} from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider,
  ProviderProps,
  adaptNavigationTheme,
  useTheme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import React from 'react';

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const fonts = {
  ...NavigationDefaultTheme.fonts,
  // Define all expected variants, falling back to 'regular' or another existing variant
  displayLarge: NavigationDefaultTheme.fonts.regular,
  displayMedium: NavigationDefaultTheme.fonts.regular,
  displaySmall: NavigationDefaultTheme.fonts.regular,
  headlineLarge: NavigationDefaultTheme.fonts.regular,
  headlineMedium: NavigationDefaultTheme.fonts.regular,
  headlineSmall: NavigationDefaultTheme.fonts.regular,
  titleLarge: NavigationDefaultTheme.fonts.regular, // remove this object after closing https://github.com/callstack/react-native-paper/issues/4589
  titleMedium: NavigationDefaultTheme.fonts.medium, // Example using medium for title variants
  titleSmall: NavigationDefaultTheme.fonts.medium,
  labelLarge: NavigationDefaultTheme.fonts.medium,
  labelMedium: NavigationDefaultTheme.fonts.medium,
  labelSmall: NavigationDefaultTheme.fonts.medium,
  bodyLarge: NavigationDefaultTheme.fonts.regular,
  bodyMedium: NavigationDefaultTheme.fonts.regular,
  bodySmall: NavigationDefaultTheme.fonts.regular,
};

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
  fonts,
};
const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
  fonts,
};

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

export const useAppTheme = useTheme<MD3Theme & NavigationTheme>;
