import {
  Material3Scheme,
  Material3Theme,
  useMaterial3Theme,
} from '@pchmn/expo-material3-theme';
import {createContext} from 'react';
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

type Material3ThemeProviderProps = {
  theme: Material3Theme;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

const {LightTheme, DarkTheme} = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
  },
};
const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
};

const Material3ThemeProviderContext =
  createContext<Material3ThemeProviderProps>({} as Material3ThemeProviderProps);

export function Material3ThemeProvider({
  children,
  sourceColor,
  fallbackSourceColor,
  ...otherProps
}: ProviderProps & {sourceColor?: string; fallbackSourceColor?: string}) {
  const colorScheme = useColorScheme();

  const {theme, updateTheme, resetTheme} = useMaterial3Theme({
    sourceColor,
    fallbackSourceColor,
  });

  const paperTheme =
    colorScheme === 'dark'
      ? {...CombinedDarkTheme, colors: theme.dark}
      : {...CombinedDefaultTheme, colors: theme.light};

  return (
    <Material3ThemeProviderContext.Provider
      value={{theme, updateTheme, resetTheme}}>
      <PaperProvider theme={paperTheme} {...otherProps}>
        {children}
      </PaperProvider>
    </Material3ThemeProviderContext.Provider>
  );
}

export const useAppTheme = useTheme<
  MD3Theme & NavigationTheme & {colors: Material3Scheme}
>;
