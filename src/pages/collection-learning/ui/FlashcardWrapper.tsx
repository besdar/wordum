import React from 'react';
import {StyleSheet} from 'react-native';
import {Grid} from '../../../shared/ui/Grid';
import {useResponsiveLayout} from '../../../shared/ui/responsive';
import {FlashcardContainer} from './FlashcardContainer';

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    width: '100%',
  },
});

type Props = {
  children: React.ReactNode;
  footer: React.ReactNode;
  header: React.ReactNode;
};

export const FlashcardWrapper = ({children, footer, header}: Props) => {
  const {learningMaxWidth} = useResponsiveLayout();

  return (
    <Grid
      direction="column"
      fillAwailableSpace
      rowGap={20}
      style={[styles.wrapper, {maxWidth: learningMaxWidth}]}>
      {header}
      <FlashcardContainer>{children}</FlashcardContainer>
      <Grid alignItems="center" justifyContent="center">
        {footer}
      </Grid>
    </Grid>
  );
};
