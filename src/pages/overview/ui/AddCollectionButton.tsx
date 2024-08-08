import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableRipple, Icon} from 'react-native-paper';
import {CollectionContainer} from './CollectionContainer';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type Props = {
  onPress: () => void;
};

export const AddCollectionButton = ({onPress}: Props) => {
  return (
    <CollectionContainer
      alignItems="stretch"
      justifyContent="center"
      flexDirection="row">
      <TouchableRipple onPress={onPress} style={styles.container} centered>
        <Icon source="plus" size={30} />
      </TouchableRipple>
    </CollectionContainer>
  );
};
