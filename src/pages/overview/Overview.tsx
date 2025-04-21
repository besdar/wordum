import React, {useCallback, useState} from 'react';
import {Grid} from '../../shared/ui/Grid';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {PagesStackProps} from '../../shared/model/navigator';
import {CollectionItems} from './ui/CollectionItems';
import {showConfirmationAlert} from '../../shared/lib/message';
import {translate} from '../../shared/lib/i18n';
import {dataRestructure} from '../../shared/model/restructure';
import {Collection, getCollections} from '../../shared/model/collection';
import {useFocusEffect} from '@react-navigation/native';

export const Overview = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Overview'>) => {
  const [collections, setCollections] = useState<Collection[]>([]);

  const refetchCallBack = useCallback(() => {
    dataRestructure.init().then(getCollections).then(setCollections);
  }, []);

  useFocusEffect(() => {
    refetchCallBack();
  });

  return (
    <Grid gap={20} wrap justifyContent="space-around">
      {collections.map(collection => (
        <CollectionItems
          key={collection.getProperty('id')}
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
              .then(collection.deleteCollection)
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
        onPress={() => navigation.push('UpdateCollectionFormContainer', {})}
      />
    </Grid>
  );
};
