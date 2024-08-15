import {updateCollection} from '../../../shared/api/storage';
import {
  AddCollectionFormFields,
  CollectionItem,
} from '../../../shared/model/collection';

export const importCollection = (
  collection: AddCollectionFormFields,
  words: CollectionItem[],
) => updateCollection({...collection, words});
