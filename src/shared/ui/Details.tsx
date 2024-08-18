import React, {useState} from 'react';
import {View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {Grid} from './Grid';
import {translate} from '../lib/i18n';

type Props = {
  children: React.ReactNode;
  expandedTitle?: string;
  collapsedTitle?: string;
};

export const Details = ({
  children,
  expandedTitle = translate('hide_additional_settings'),
  collapsedTitle = translate('show_additional_settings'),
}: Props) => {
  const [isDetailsShown, setDetailsVisibility] = useState(false);

  return (
    <View>
      <Grid justifyContent="space-between" columnGap={10} alignItems="center">
        <Text variant="bodyMedium">
          {isDetailsShown ? expandedTitle : collapsedTitle}
        </Text>
        <IconButton
          onPress={() => setDetailsVisibility(!isDetailsShown)}
          icon={
            isDetailsShown ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'
          }
        />
      </Grid>
      {isDetailsShown && children}
    </View>
  );
};
