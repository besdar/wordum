import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {translate} from '../../shared/lib/i18n';
import {showConfirmationAlert} from '../../shared/lib/message';
import {Collection, getCollections} from '../../shared/model/collection';
import {PagesStackProps} from '../../shared/model/navigator';
import {dataRestructure} from '../../shared/model/restructure';
import {Grid} from '../../shared/ui/Grid';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {CollectionItems} from './ui/CollectionItems';

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
        onPress={() => navigation.push('UpdateCollectionFormContainer', {})}
      />
    </Grid>
  );
};
