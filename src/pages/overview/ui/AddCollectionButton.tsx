import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableRipple, Icon} from 'react-native-paper';
import {CollectionColumns} from '../../../shared/ui/responsive';
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
  collectionColumns: CollectionColumns;
};

export const AddCollectionButton = ({collectionColumns, onPress}: Props) => {
  return (
    <CollectionContainer
      collectionColumns={collectionColumns}
      alignItems="stretch"
      justifyContent="center"
      flexDirection="row">
      <TouchableRipple onPress={onPress} style={styles.container} centered>
        <Icon source="plus" size={30} />
      </TouchableRipple>
    </CollectionContainer>
  );
};
