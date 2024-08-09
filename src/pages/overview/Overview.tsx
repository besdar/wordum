import React from 'react';
import {Grid} from '../../shared/ui/Grid';
import {deleteCollection, getCollections} from '../../shared/api/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PagesStackProps} from '../../shared/model/types';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {CollectionItem} from './ui/CollectionItem';
import {useQuery} from '../../shared/lib/useQuery';
import {showDeleteConfirmationAlert} from './ui/showDeleteConfirmationAlert';

export const Overview = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Overview'>) => {
  const {data, refetch} = useQuery({
    queryFn: getCollections,
    initialData: [],
  });

  return (
    <Grid gap={15} wrap justifyContent="space-between">
      {data.map(collection => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          onAddWord={() =>
            navigation.navigate('AddWordForm', {
              collectionId: collection.id,
            })
          }
          onDelete={() =>
            showDeleteConfirmationAlert()
              .then(() => deleteCollection(collection.id))
              .then(() => refetch())
          }
          onStartLearning={() =>
            navigation.navigate('CollectionLearning', {
              collectionId: collection.id,
            })
          }
        />
      ))}
      <AddCollectionButton
        onPress={() => navigation.navigate('AddCollectionForm')}
      />
    </Grid>
  );
};
