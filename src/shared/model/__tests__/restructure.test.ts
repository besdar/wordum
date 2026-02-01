import AsyncStorage from '@react-native-async-storage/async-storage';
import {createEmptyCard, Card} from 'ts-fsrs';
import {restructureOldCollection, dataRestructure} from '../restructure';
import {
  CollectionFormFields,
  LearningType,
  getCollections,
  LearningCard,
} from '../collection';
import {StorageKeys} from '../storage';

jest.mock('../collection', () => ({
  ...jest.requireActual('../collection'),
  getCollections: jest.fn(),
}));

// Type representing the old data structure before migration
interface OldLearningCard {
  collectionId: string;
  value: string;
  translation: string;
  learningType: LearningType;
  fsrsCard: Card;
}

interface OldCollectionFormFields {
  words: Record<string, (LearningCard | OldLearningCard)[]>;
  supportedLearningTypes?: LearningType[];
  typesOfCardsToGenerate?: LearningType[];
}

// Type for accessing dataRestructure internals in tests
interface DataRestructureTestable {
  promise: Promise<void> | undefined;
  appPreviousVersion: string | undefined | null;
  init(): Promise<void>;
}

describe('restructureOldCollection', () => {
  it('should return undefined if version middle is >= 2', () => {
    const data = {} as CollectionFormFields;
    const result = restructureOldCollection(data, {
      major: 0,
      middle: 2,
      minor: 0,
    });

    expect(result).toBeUndefined();
  });

  it('should return false if collection already has supportedLearningTypes', () => {
    const data = {
      supportedLearningTypes: [LearningType.Flascards],
      words: {},
    } as CollectionFormFields;

    const result = restructureOldCollection(data, {
      major: 0,
      middle: 1,
      minor: 0,
    });

    expect(result).toBe(false);
  });

  it('should migrate typesOfCardsToGenerate to supportedLearningTypes', () => {
    const data: OldCollectionFormFields = {
      words: {},
      typesOfCardsToGenerate: [LearningType.Writing],
    };

    const result = restructureOldCollection(data as CollectionFormFields, {
      major: 0,
      middle: 1,
      minor: 0,
    });

    expect(result).toBe(true);
    expect((data as CollectionFormFields).supportedLearningTypes).toEqual([
      LearningType.Writing,
    ]);
  });

  it('should migrate collectionId to wordId in learning cards', () => {
    const data: OldCollectionFormFields = {
      words: {
        word1: [
          {
            collectionId: 'old-id',
            value: 'test',
            translation: 'prueba',
            learningType: LearningType.Flascards,
            fsrsCard: createEmptyCard(),
          },
        ],
      },
      typesOfCardsToGenerate: [LearningType.Flascards],
    };

    restructureOldCollection(data as CollectionFormFields, {
      major: 0,
      middle: 1,
      minor: 0,
    });

    expect((data.words.word1[0] as LearningCard).wordId).toBe('old-id');
  });

  it('should delete word if it has listening card but no writing card', () => {
    const data: OldCollectionFormFields = {
      words: {
        word1: [
          {
            wordId: 'word1',
            value: 'test',
            translation: 'prueba',
            learningType: LearningType.Listening,
            fsrsCard: createEmptyCard(),
          } as LearningCard,
        ],
      },
      typesOfCardsToGenerate: [LearningType.Listening],
    };

    restructureOldCollection(data as CollectionFormFields, {
      major: 0,
      middle: 1,
      minor: 0,
    });

    expect(data.words.word1).toBeUndefined();
  });

  it('should update listening card values when both listening and writing cards exist', () => {
    const data: OldCollectionFormFields = {
      words: {
        word1: [
          {
            wordId: 'word1',
            value: 'test',
            translation: 'old-translation',
            learningType: LearningType.Listening,
            fsrsCard: createEmptyCard(),
          } as LearningCard,
          {
            wordId: 'word1',
            value: 'test',
            translation: 'writing-translation',
            learningType: LearningType.Writing,
            fsrsCard: createEmptyCard(),
          } as LearningCard,
        ],
      },
      typesOfCardsToGenerate: [LearningType.Listening, LearningType.Writing],
    };

    restructureOldCollection(data as CollectionFormFields, {
      major: 0,
      middle: 1,
      minor: 0,
    });

    const listeningCard = (data as CollectionFormFields).words.word1.find(
      card => card.learningType === LearningType.Listening,
    );
    expect(listeningCard?.value).toBe('old-translation');
    expect(listeningCard?.translation).toBe('writing-translation');
  });

  it('should skip words without listening card', () => {
    const data: OldCollectionFormFields = {
      words: {
        word1: [
          {
            wordId: 'word1',
            value: 'test',
            translation: 'prueba',
            learningType: LearningType.Flascards,
            fsrsCard: createEmptyCard(),
          } as LearningCard,
        ],
      },
      typesOfCardsToGenerate: [LearningType.Flascards],
    };

    restructureOldCollection(data as CollectionFormFields, {
      major: 0,
      middle: 1,
      minor: 0,
    });

    expect(data.words.word1).toBeDefined();
    expect(data.words.word1).toHaveLength(1);
  });
});

describe('DataRestructure', () => {
  const testableDataRestructure =
    dataRestructure as unknown as DataRestructureTestable;

  beforeEach(() => {
    // Reset the singleton state
    testableDataRestructure.promise = undefined;
    testableDataRestructure.appPreviousVersion = undefined;
  });

  describe('init', () => {
    it('should set previous version in AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0.5.0');
      (getCollections as jest.Mock).mockResolvedValue([]);

      await dataRestructure.init();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.PREVIOUS_VERSION,
        expect.any(String),
      );
    });

    it('should return existing promise if already initialized', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0.5.0');
      (getCollections as jest.Mock).mockResolvedValue([]);

      const promise1 = dataRestructure.init();
      const promise2 = dataRestructure.init();

      await Promise.all([promise1, promise2]);

      // getItem should only be called once for version check
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should skip restructuring if previous version exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('0.5.0');
      (getCollections as jest.Mock).mockResolvedValue([]);

      await dataRestructure.init();

      expect(getCollections).not.toHaveBeenCalled();
    });

    it('should run restructuring on collections if no previous version', async () => {
      const mockCollection = {
        dangerouslyGetInnerObject: jest.fn().mockReturnValue({
          supportedLearningTypes: [LearningType.Flascards],
          words: {},
        }),
        saveCollection: jest.fn().mockResolvedValue(undefined),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (getCollections as jest.Mock).mockResolvedValue([mockCollection]);

      // Call init and wait for the internal promise to complete
      const initPromise = dataRestructure.init();
      await testableDataRestructure.promise;
      await initPromise;

      expect(getCollections).toHaveBeenCalled();
      // Should not save because supportedLearningTypes already exists
      expect(mockCollection.saveCollection).not.toHaveBeenCalled();
    });

    it('should save collection after restructuring if changes were made', async () => {
      const innerObject: OldCollectionFormFields = {
        words: {},
        typesOfCardsToGenerate: [LearningType.Flascards],
      };

      const mockCollection = {
        dangerouslyGetInnerObject: jest.fn().mockReturnValue(innerObject),
        saveCollection: jest.fn().mockResolvedValue(undefined),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (getCollections as jest.Mock).mockResolvedValue([mockCollection]);

      // Call init and wait for the internal promise to complete
      const initPromise = dataRestructure.init();
      await testableDataRestructure.promise;
      await initPromise;

      expect(mockCollection.saveCollection).toHaveBeenCalled();
    });
  });
});
