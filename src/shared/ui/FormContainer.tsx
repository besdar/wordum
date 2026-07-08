import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Grid} from './Grid';
import {useResponsiveLayout} from './responsive';

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
  },
  content: {
    width: '100%',
  },
});

type Props = {
  children: React.ReactNode;
};

export const FormContainer = ({children}: Props) => {
  const {formMaxWidth} = useResponsiveLayout();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled">
      <Grid
        direction="column"
        rowGap={10}
        padding={5}
        alignItems="stretch"
        style={[styles.content, {maxWidth: formMaxWidth}]}>
        {children}
      </Grid>
    </ScrollView>
  );
};
