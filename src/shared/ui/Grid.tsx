import React from 'react';
import {View, StyleSheet, FlexAlignType, FlexStyle} from 'react-native';
import {Surface} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
  },
  growed: {
    flexGrow: 1,
  },
});

type Props = {
  children: React.ReactNode;
  fillAwailableSpace?: boolean;
  alignItems?: FlexAlignType;
  justifyContent?: FlexStyle['justifyContent'];
  direction?: FlexStyle['flexDirection'];
  rowGap?: number;
  gap?: number;
  columnGap?: number;
  padding?: number;
  flexBasis?: FlexStyle['flexBasis'];
  wrap?: boolean;
  surfaceProps?: Omit<React.ComponentProps<typeof Surface>, 'children'>;
};

export const Grid = ({
  children,
  fillAwailableSpace,
  alignItems,
  justifyContent = 'flex-start',
  direction = 'row',
  rowGap,
  columnGap,
  gap,
  padding,
  flexBasis,
  wrap,
  surfaceProps,
}: Props) => {
  const Component = surfaceProps ? Surface : View;

  return (
    <Component
      {...(surfaceProps || {})}
      style={[
        surfaceProps?.style,
        styles.container,
        {
          alignItems,
          justifyContent,
          flexDirection: direction,
          rowGap,
          columnGap,
          gap,
          padding,
          flexBasis,
          flexWrap: wrap ? ('wrap' as const) : ('nowrap' as const),
        },
        fillAwailableSpace && styles.growed,
      ].filter(Boolean)}>
      {children}
    </Component>
  );
};
