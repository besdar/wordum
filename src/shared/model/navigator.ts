import {Collection} from './collection';

export type PagesStackProps = {
  Overview: undefined;
  AddWordForm: {
    collection: Collection;
  };
  UpdateCollectionForm: {
    collection?: Collection;
  };
  CollectionLearning: {
    collection: Collection;
  };
  About: undefined;
  Settings: undefined;
};
