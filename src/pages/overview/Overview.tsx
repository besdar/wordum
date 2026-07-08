import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import {translate} from '../../shared/lib/i18n';
import {showConfirmationAlert} from '../../shared/lib/message';
import {Collection, getCollections} from '../../shared/model/collection';
import {PagesStackProps} from '../../shared/model/navigator';
import {dataRestructure} from '../../shared/model/restructure';
import {Grid} from '../../shared/ui/Grid';
import {useResponsiveLayout} from '../../shared/ui/responsive';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {CollectionItems} from './ui/CollectionItems';

const styles = StyleSheet.create({
  collections: {
    alignSelf: 'center',
    width: '100%',
  },
});

export const Overview = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Overview'>) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const {collectionColumns, overviewMaxWidth} = useResponsiveLayout();

  const refetchCallBack = useCallback(() => {
    dataRestructure.init().then(getCollections).then(setCollections);
  }, []);

  useFocusEffect(() => {
    refetchCallBack();
  });

  return (
    <Grid
      gap={20}
      wrap
      justifyContent="space-around"
      style={[styles.collections, {maxWidth: overviewMaxWidth}]}>
      {collections.map(collection => (
        <CollectionItems
          key={collection.getProperty('id')}
          collectionColumns={collectionColumns}
          collection={collection}
          onAddWord={() =>
            navigation.push('AddWordForm', {
              collection,
            })
          }
          onDelete={() =>
            showConfirmationAlert(
              translate('collection_deletion'),
              translate('collection_deletion_message'),
              translate('yes'),
            )
              .then(() => collection.deleteCollection())
              .finally(refetchCallBack)
          }
          onStartLearning={() =>
            navigation.push('CollectionLearning', {
              collection,
            })
          }
          onUpdateCollection={() =>
            navigation.push('UpdateCollectionFormContainer', {
              collection,
            })
          }
        />
      ))}
      <AddCollectionButton
        collectionColumns={collectionColumns}
        onPress={() => navigation.push('UpdateCollectionFormContainer', {})}
      />
    </Grid>
  );
};
