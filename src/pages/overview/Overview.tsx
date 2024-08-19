import React from 'react';
import {Grid} from '../../shared/ui/Grid';
import {deleteCollection, getCollections} from '../../shared/model/storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {useQuery} from '../../shared/lib/useQuery';
import {PagesStackProps} from '../../shared/model/navigator';
import {CollectionItems} from './ui/CollectionItems';
import {showConfirmationAlert} from '../../shared/lib/message';
import {translate} from '../../shared/lib/i18n';

export const Overview = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Overview'>) => {
  const {data, refetch} = useQuery({
    queryFn: getCollections,
    initialData: [],
    queryKey: ['collections'],
  });

  return (
    <Grid gap={20} wrap justifyContent="space-around">
      {data.map(collection => (
        <CollectionItems
          key={collection.id}
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
            )
              .then(() => deleteCollection(collection))
              .finally(() => refetch())
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
