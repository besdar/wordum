import {updateCollection} from '../../../shared/model/storage';
import {
  AddCollectionFormFields,
  CollectionItems,
} from '../../../shared/model/collection';

export const importCollection = (
  collection: AddCollectionFormFields,
  words: CollectionItems,
) => updateCollection({...collection, words});
