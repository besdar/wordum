import React from 'react';
import {Grid} from '../../shared/ui/Grid';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AddCollectionButton} from './ui/AddCollectionButton';
import {useQuery} from '../../shared/lib/useQuery';
import {PagesStackProps} from '../../shared/model/navigator';
import {CollectionItems} from './ui/CollectionItems';
import {showConfirmationAlert} from '../../shared/lib/message';
import {translate} from '../../shared/lib/i18n';
import {dataRestructure} from '../../shared/model/restructure';
import {getCollections} from '../../shared/model/collection';

export const Overview = ({
  navigation,
}: NativeStackScreenProps<PagesStackProps, 'Overview'>) => {
  const {data, refetch} = useQuery({
    queryFn: () => dataRestructure.init().then(getCollections),
    initialData: [],
    queryKey: ['collections'],
  });

  return (
    <Grid gap={20} wrap justifyContent="space-around">
      {data.map(collection => (
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
