import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon, Text} from 'react-native-paper';
import {translate} from '../../../shared/lib/i18n';
import {Grid} from '../../../shared/ui/Grid';
import {useAppTheme} from '../../../shared/ui/theme';
import type {EmotionalSupportCard as EmotionalSupportCardModel} from '../model/types';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

type Props = {
  card: EmotionalSupportCardModel;
};

export const EmotionalSupportCard = ({card}: Props) => {
  const theme = useAppTheme();

  return (
    <Grid
      direction="column"
      rowGap={12}
      padding={16}
      alignItems="center"
      justifyContent="center">
      <Icon source={card.icon} size={72} color={theme.colors.primary} />
      <Text variant="headlineSmall" style={styles.title}>
        {translate(card.titleKey)}
      </Text>
      <Text
        variant="bodyLarge"
        style={styles.message}
        textBreakStrategy="balanced">
        {translate(card.messageKey)}
      </Text>
    </Grid>
  );
};
