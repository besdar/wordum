import {StyleSheet} from 'react-native';
import {TouchableRipple, Badge, Text} from 'react-native-paper';
import {CollectionContainer} from './CollectionContainer';
import {Grid} from '../../../shared/ui/Grid';
import React from 'react';
import {LANGUAGE_FLAGS} from '../../../shared/model/lang';
import {Collection} from '../../../shared/model/collection';
import {IconButton} from '../../../shared/ui/IconButton';

const styles = StyleSheet.create({
  collectionButton: {
    margin: 0,
  },
  badge: {marginTop: -10, marginRight: -10},
});

type Props = {
  collection: Collection;
  onStartLearning: () => void;
  onAddWord: () => void;
  onDelete: () => void;
  onUpdateCollection: () => void;
};

export const CollectionItems = ({
  collection,
  onAddWord,
  onDelete,
  onStartLearning,
  onUpdateCollection,
}: Props) => {
  return (
    <CollectionContainer>
      <Badge style={styles.badge}>{collection.getWordsToLearn().length}</Badge>
      <Grid alignItems="center" justifyContent="center" fillAwailableSpace>
        <TouchableRipple onPress={onStartLearning}>
          <Grid direction="column" alignItems="center">
            <Text>{collection.getProperty('name')}</Text>
            <Grid>
              <Text>
                {LANGUAGE_FLAGS[collection.getProperty('sourceLanguage')]}
              </Text>
              <Text>{' -> '}</Text>
              <Text>
                {LANGUAGE_FLAGS[collection.getProperty('targetLanguage')]}
              </Text>
            </Grid>
          </Grid>
        </TouchableRipple>
      </Grid>
      <Grid justifyContent="space-between">
        <IconButton
          icon="delete"
          onPress={onDelete}
          accessibilityLabel="Delete collection"
          size={15}
          style={styles.collectionButton}
        />
        <IconButton
          icon="cog"
          size={15}
          style={styles.collectionButton}
          onPress={onUpdateCollection}
        />
        <IconButton
          icon="plus-circle"
          onPress={onAddWord}
          accessibilityLabel="Add a word"
          size={15}
          style={styles.collectionButton}
        />
      </Grid>
    </CollectionContainer>
  );
};
