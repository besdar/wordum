import {createEmptyCard} from 'ts-fsrs';
import {showToastMessage} from '../../../../shared/lib/message';
import {
  Collection,
  LearningCard,
  LearningType,
} from '../../../../shared/model/collection';
import {addWordToCollection} from '../storage';

jest.mock('../../../../shared/lib/message', () => ({
  showToastMessage: jest.fn(),
}));

describe('addWordToCollection', () => {
  const collection = {
    isWordInCollection: jest.fn(),
    addWord: jest.fn(),
  } as unknown as Collection;

  const newItem: Readonly<LearningCard> = {
    value: 'testWord',
    translation: 'testTranslation',
    wordId: '1',
    fsrsCard: createEmptyCard(),
    learningType: LearningType.Flascards,
  };

  it('should show a toast message if the word already exists in the collection', async () => {
    (collection.isWordInCollection as jest.Mock).mockReturnValue(true);

    const result = await addWordToCollection(collection, newItem);

    expect(showToastMessage).toHaveBeenCalledWith('exist_word_message');
    expect(result).toBe(collection);
    expect(collection.addWord).not.toHaveBeenCalled();
  });

  it('should add the word to the collection if it does not exist', async () => {
    (collection.isWordInCollection as jest.Mock).mockReturnValue(false);
    (collection.addWord as jest.Mock).mockReturnValue(collection); // Assuming addWord returns the collection

    const result = await addWordToCollection(collection, newItem);

    expect(collection.isWordInCollection).toHaveBeenCalledWith(newItem.value);
    expect(collection.addWord).toHaveBeenCalledWith(newItem);
    expect(result).toBe(collection);
  });
});
