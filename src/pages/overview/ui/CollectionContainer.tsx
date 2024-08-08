import React from 'react';
import {FlexAlignType, FlexStyle, StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {useAppTheme} from '../../../app/ui/Material3ThemeProvider';

const styles = StyleSheet.create({
  surface: {
    flexBasis: '45%',
    minHeight: 100,
    borderRadius: 10,
    borderWidth: 3,
    display: 'flex',
  },
});

type Props = {
  children: React.ReactNode;
  alignItems?: FlexAlignType;
  justifyContent?: FlexStyle['justifyContent'];
  flexDirection?: FlexStyle['flexDirection'];
};

export const CollectionContainer = ({
  children,
  alignItems,
  justifyContent,
  flexDirection,
}: Props) => {
  const theme = useAppTheme();

  return (
    <Surface
      elevation={5}
      style={[
        styles.surface,
        {
          borderColor: theme.colors.secondary,
          alignItems,
          justifyContent,
          flexDirection,
        },
      ]}>
      {children}
    </Surface>
  );
};
