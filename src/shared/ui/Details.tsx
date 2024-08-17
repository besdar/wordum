import React, {useState} from 'react';
import {View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {Grid} from './Grid';

type Props = {
  children: React.ReactNode;
  expandedTitle: string;
  collapsedTitle: string;
};

export const Details = ({children, expandedTitle, collapsedTitle}: Props) => {
  const [isDetailsShown, setDetailsVisibility] = useState(false);

  return (
    <View>
      <Grid justifyContent="space-between" columnGap={10} alignItems="center">
        <Text>{isDetailsShown ? expandedTitle : collapsedTitle}</Text>
        <IconButton
          mode="contained"
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
