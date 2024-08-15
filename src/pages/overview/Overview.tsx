import React from 'react';
import {Grid} from '../../shared/ui/Grid';
import {deleteCollection, getCollections} from '../../shared/api/storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {CollectionItem} from './ui/CollectionItem';
import {useQuery} from '../../shared/lib/useQuery';
import {showDeleteConfirmationAlert} from './ui/showDeleteConfirmationAlert';
import {PagesStackProps} from '../../shared/model/navigator';

export const Overview = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Overview'>) => {
  const {data, refetch} = useQuery({
    queryFn: getCollections,
    initialData: [],
    queryKey: ['collections'],
  });

  return (
    <Grid gap={15} wrap justifyContent="space-between">
      {data.map(collection => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          onAddWord={() =>
            navigation.push('AddWordForm', {
              collection,
            })
          }
          onDelete={() =>
            showDeleteConfirmationAlert()
              .then(() => deleteCollection(collection.id))
              .then(() => refetch())
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
