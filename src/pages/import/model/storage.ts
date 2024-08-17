import {updateCollection} from '../../../shared/model/storage';
import {Collection, CollectionItems} from '../../../shared/model/collection';

export const importCollection = (
  collection: Omit<Collection, 'id'>,
  words: CollectionItems,
) => updateCollection({...collection, words});
