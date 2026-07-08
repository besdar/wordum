import React from 'react';
import {FlexAlignType, FlexStyle, StyleSheet} from 'react-native';
import {Surface} from 'react-native-paper';
import {CollectionColumns} from '../../../shared/ui/responsive';
import {useAppTheme} from '../../../shared/ui/theme';

const flexBasisByColumns: Record<CollectionColumns, FlexStyle['flexBasis']> = {
  2: '45%',
  3: '30%',
  4: '22%',
};

const styles = StyleSheet.create({
  surface: {
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
  collectionColumns: CollectionColumns;
};

export const CollectionContainer = ({
  children,
  alignItems,
  justifyContent,
  flexDirection,
  collectionColumns,
}: Props) => {
  const theme = useAppTheme();

  return (
    <Surface
      elevation={5}
      style={[
        styles.surface,
        {
          borderColor: theme.colors.secondary,
          flexBasis: flexBasisByColumns[collectionColumns],
          alignItems,
          justifyContent,
          flexDirection,
        },
      ]}>
      {children}
    </Surface>
  );
};
