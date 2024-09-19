import {
  Collection,
  CollectionFormFields,
  LearningCard,
  LearningType,
  getCollections,
  getInitialCollection,
} from '../collection';
import {unlink} from '@dr.pogodin/react-native-fs';
import {
  getUUID,
  downloadVoice,
  createLearningCardsForCollectionItem,
} from '../../lib/collection';
import {AppSupportedLanguages} from '../lang';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createEmptyCard} from 'ts-fsrs';

jest.mock('../../lib/collection', () => ({
  getUUID: jest.fn(),
  downloadVoice: jest.fn(),
  createLearningCardsForCollectionItem: jest.fn(),
}));

describe('Collection', () => {
  const uuid = 'mock-uuid';

  beforeEach(() => {
    (getUUID as jest.Mock).mockReturnValue(uuid);
  });

  describe('init', () => {
    it('should initialize with a given id', async () => {
      const collection = new Collection();
      const mockCollectionData = {id: 'mock-id', words: {}};
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockCollectionData),
      );

      await collection.init('mock-id');

      expect(collection.dangerouslyGetInnerObject()).toEqual(
        mockCollectionData,
      );
      expect(collection.isItNew()).toBe(false);
    });

    it('should return itself if no id is provided', async () => {
      const collection = new Collection();
      const result = await collection.init();

      expect(result).toBe(collection);
      expect(collection.isItNew()).toBe(true);
    });
  });

  describe('saveCollection', () => {
    it('should save the collection to AsyncStorage', async () => {
      const collection = new Collection();
      const payload: CollectionFormFields = {
        name: 'Test Collection',
        sourceLanguage: AppSupportedLanguages.ARABIC,
        targetLanguage: AppSupportedLanguages.ENGLISH,
        wordsToTrain: 0,
        learningLanguage: 'source',
        supportedLearningTypes: [],
        words: {},
      };

      await collection.saveCollection(payload);

      expect(collection.dangerouslyGetInnerObject()).toMatchObject(
        expect.objectContaining(payload),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'COLLECTIONS_mock-uuid',
        expect.stringContaining(JSON.stringify(payload).slice(1, -1)),
      );
    });

    it('should delete learning cards if there are any marked for deletion', async () => {
      const collection = new Collection();
      const cardToDelete: LearningCard = {
        wordId: 'wordl',
        value: 'test',
        learningType: LearningType.Flascards,
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        sourceVoice: 'sourceVoice',
        targetVoice: 'targetVoice',
        sound: 'sound',
      };

      collection.dangerouslyGetInnerObject().words = {wordl: [cardToDelete]};
      collection.setCollectionItemForDeletion(cardToDelete);

      await collection.saveCollection();

      expect(unlink).toHaveBeenCalledWith(cardToDelete.sourceVoice);
      expect(unlink).toHaveBeenCalledWith(cardToDelete.targetVoice);
      expect(unlink).toHaveBeenCalledWith(cardToDelete.sound);
      expect(
        collection.dangerouslyGetInnerObject().words.wordl,
      ).toBeUndefined();
    });
  });

  describe('addWord', () => {
    it('should add a new word to the collection', async () => {
      const collection = new Collection();
      const newWord: LearningCard = {
        wordId: 'word1',
        value: 'newWord',
        sourceVoice: 'source.mp3',
        targetVoice: 'target.mp3',
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
      };

      (createLearningCardsForCollectionItem as jest.Mock).mockReturnValueOnce([
        newWord,
      ]);
      (downloadVoice as jest.Mock).mockResolvedValueOnce('mockedVoice');

      await collection.addWord(newWord);

      expect(
        collection.dangerouslyGetInnerObject().words[uuid],
      ).not.toBeUndefined();
      expect(collection.dangerouslyGetInnerObject().words[uuid][0]).toBe(
        newWord,
      );
    });

    it('should not add a word if it already exists', async () => {
      const collection = new Collection();
      const existingWord: LearningCard = {
        value: 'existingWord',
        sourceVoice: 'source.mp3',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
        wordId: 'word1',
        translation: 'translation',
      };
      collection.dangerouslyGetInnerObject().words['mock-uuid'] = [
        existingWord,
      ];

      await collection.addWord(existingWord);

      expect(collection.dangerouslyGetInnerObject().words).toHaveProperty(
        'mock-uuid',
        [existingWord],
      );
    });
  });

  describe('deleteWord', () => {
    it('should delete a word from the collection', async () => {
      const collection = new Collection();
      const wordToDelete: LearningCard = {
        wordId: 'word1',
        value: 'test',
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
        sourceVoice: 'sourceVoice',
        targetVoice: 'targetVoice',
        sound: 'sound',
      };
      collection.dangerouslyGetInnerObject().words = {word1: [wordToDelete]};

      await collection.deleteWord('word1');

      expect(collection.dangerouslyGetInnerObject().words).not.toHaveProperty(
        'word1',
      );
      expect(unlink).toHaveBeenCalledWith(wordToDelete.sourceVoice);
      expect(unlink).toHaveBeenCalledWith(wordToDelete.targetVoice);
      expect(unlink).toHaveBeenCalledWith(wordToDelete.sound);
    });

    it('should not throw an error if the word does not exist', async () => {
      const collection = new Collection();
      await expect(collection.deleteWord('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('setCollectionItemForDeletion', () => {
    it('should add a collection item to the deletion list', () => {
      const collection = new Collection();
      const cardToDelete: LearningCard = {
        wordId: 'word1',
        value: 'test',
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
      };
      collection.dangerouslyGetInnerObject().words = {word1: [cardToDelete]};

      collection.setCollectionItemForDeletion(cardToDelete);

      expect(collection.dangerouslyGetInnerObject().words.word1).toHaveLength(
        1,
      );
    });

    it('should not add a collection item if it does not exist in the collection', () => {
      const collection = new Collection();
      const cardToDelete: LearningCard = {
        wordId: 'nonexistent',
        value: 'test',
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
      };

      collection.setCollectionItemForDeletion(cardToDelete);

      expect(collection.dangerouslyGetInnerObject().words).toEqual({});
    });
  });

  describe('getLearningCards', () => {
    it('should return all learning cards in the collection', () => {
      const collection = new Collection();
      const card1: LearningCard = {
        wordId: 'word1',
        value: 'test',
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
      };
      const card2: LearningCard = {
        wordId: 'word2',
        value: 'test2',
        translation: 'translation',
        fsrsCard: createEmptyCard(),
        learningType: LearningType.Flascards,
      };
      collection.dangerouslyGetInnerObject().words = {
        word1: [card1],
        word2: [card2],
      };

      const learningCards = collection.getLearningCards();

      expect(learningCards).toEqual([[card1], [card2]]);
    });
  });

  describe('getWordsToLearn', () => {
    it('should return words that are supported for learning', () => {
      const collection = new Collection();
      const card1: LearningCard = {
        wordId: 'word1',
        value: 'test',
        learningType: LearningType.Flascards,
        translation: 'translation',
        fsrsCard: {...createEmptyCard(), due: new Date(Date.now() - 1000)},
      };
      const card2: LearningCard = {
        wordId: 'word2',
        value: 'test2',
        learningType: LearningType.Writing,
        translation: 'translation',
        fsrsCard: {...createEmptyCard(), due: new Date(Date.now() - 1000)},
      };
      collection.dangerouslyGetInnerObject().words = {
        word1: [card1],
        word2: [card2],
      };
      collection.dangerouslyGetInnerObject().supportedLearningTypes = [
        LearningType.Flascards,
      ];

      const wordsToLearn = collection.getWordsToLearn();

      expect(wordsToLearn).toEqual([[card1]]);
    });
  });

  describe('getProperty', () => {
    it('should return the specified property from the collection', () => {
      const collection = new Collection({
        id: 'mock-id',
        name: 'Test Collection',
        wordsToTrain: 0,
        words: {},
        supportedLearningTypes: [],
        learningLanguage: 'source',
        sourceLanguage: AppSupportedLanguages.ENGLISH,
        targetLanguage: AppSupportedLanguages.SPANISH,
      });

      const name = collection.getProperty('name');

      expect(name).toBe('Test Collection');
    });
  });

  describe('isWordInCollection', () => {
    it('should return true if the word exists in the collection', () => {
      const collection = new Collection();
      const card: LearningCard = {
        wordId: 'word1',
        value: 'test',
        learningType: LearningType.Writing,
        translation: 'translation',
        fsrsCard: createEmptyCard(),
      };
      collection.dangerouslyGetInnerObject().words = {word1: [card]};

      const exists = collection.isWordInCollection('test');

      expect(exists).toBe(true);
    });

    it('should return false if the word does not exist in the collection', () => {
      const collection = new Collection();
      const exists = collection.isWordInCollection('nonexistent');

      expect(exists).toBe(false);
    });
  });

  describe('getLearningLanguage', () => {
    it('should return the correct learning language based on the collection setting', () => {
      const collection = new Collection({
        learningLanguage: 'source',
        sourceLanguage: AppSupportedLanguages.ENGLISH,
        targetLanguage: AppSupportedLanguages.SPANISH,
        name: 'lala',
        wordsToTrain: 0,
        words: {},
        supportedLearningTypes: [],
      });

      const learningLanguage = collection.getLearningLanguage();

      expect(learningLanguage).toBe(AppSupportedLanguages.ENGLISH);
    });
  });

  describe('isItNew', () => {
    it('should return true if the collection is new', () => {
      const collection = new Collection();
      expect(collection.isItNew()).toBe(true);
    });

    it('should return false if the collection is not new', async () => {
      const collection = new Collection();
      await collection.init('mock-id');
      expect(collection.isItNew()).toBe(false);
    });
  });

  describe('deleteCollection', () => {
    it('should delete the collection and reset it', async () => {
      const collection = new Collection({
        learningLanguage: 'source',
        sourceLanguage: AppSupportedLanguages.ENGLISH,
        targetLanguage: AppSupportedLanguages.SPANISH,
        id: 'mock-id',
        words: {
          word1: [
            {
              value: 'test',
              learningType: LearningType.Writing,
              translation: 'translation',
              fsrsCard: createEmptyCard(),
              wordId: 'word1',
            },
          ],
        },
        name: 'lala',
        wordsToTrain: 0,
        supportedLearningTypes: [],
      });

      await collection.deleteCollection();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        'COLLECTIONS_mock-id',
      );
      expect(collection.dangerouslyGetInnerObject()).toEqual(
        getInitialCollection(),
      );
    });
  });
});

describe('getCollections', () => {
  it('should return initialized collections based on stored keys', async () => {
    const mockKeys = [
      'COLLECTIONS_1',
      'COLLECTIONS_2',
      'OTHER_KEY',
      'COLLECTIONS_3',
    ];

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(mockKeys);
    const spy = jest.spyOn(Collection.prototype, 'init');

    const result = await getCollections();

    expect(result).toHaveLength(3);
    expect(AsyncStorage.getAllKeys).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith('1');
    expect(spy).toHaveBeenCalledWith('2');
    expect(spy).toHaveBeenCalledWith('3');
  });

  it('should return an empty array if no collection keys are found', async () => {
    const mockKeys = ['OTHER_KEY_1', 'OTHER_KEY_2'];

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(mockKeys);

    const result = await getCollections();

    expect(result).toEqual([]);
    expect(AsyncStorage.getAllKeys).toHaveBeenCalledTimes(1);
  });
});
