import {StyleSheet, Text} from 'react-native';
import {TouchableRipple, IconButton, Badge} from 'react-native-paper';
import {CollectionContainer} from './CollectionContainer';
import {Grid} from '../../../shared/ui/Grid';
import React from 'react';
import {Collection} from '../../../shared/model/collection';
import {getWordsToLearn} from '../../collection-learning/lib/learning';
import {LANGUAGE_FLAGS} from '../../../shared/config/consts';

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
}: Props) => (
  <CollectionContainer key={collection.id}>
    <Badge style={styles.badge}>
      {getWordsToLearn(collection.words).length}
    </Badge>
    <Grid alignItems="center" justifyContent="center" fillAwailableSpace>
      <TouchableRipple onPress={onStartLearning}>
        <Grid direction="column" alignItems="center">
          <Text>{collection.name}</Text>
          <Text>
            {`${LANGUAGE_FLAGS[collection.sourceLanguage]} -> ${
              LANGUAGE_FLAGS[collection.targetLanguage]
            }`}
          </Text>
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
