import {CollectionFormFields, LearningType} from '../../model/collection';
import {createLearningCardsForCollectionItem, getUUID} from '../collection';

describe('getUUID', () => {
  it('should generate a UUID string', () => {
    const uuid = getUUID();

    expect(uuid).toMatch(/^[0-9a-f]{12,}$/);
  });
});

describe('createLearningCardsForCollectionItem', () => {
  const newItem = {
    wordId: '1',
    value: 'hello',
    translation: 'hola',
    examples: 'example1',
  };

  const learningLanguage: CollectionFormFields['learningLanguage'] = 'source';
  const cardsToGenerate: CollectionFormFields['supportedLearningTypes'] = [
    LearningType.Flascards,
    LearningType.Writing,
    LearningType.Listening,
  ];

  it('should create flashcards correctly', () => {
    const cards = createLearningCardsForCollectionItem(
      newItem,
      learningLanguage,
      cardsToGenerate,
    );

    expect(cards).toHaveLength(4);
    expect(cards[0]).toMatchObject({
      wordId: '1',
      value: 'hello',
      translation: 'hola',
      learningType: LearningType.Flascards,
    });
    expect(cards[1]).toMatchObject({
      wordId: '1',
      value: 'hola',
      translation: 'hello',
      learningType: LearningType.Flascards,
    });
  });

  it('should create writing cards correctly', () => {
    const cards = createLearningCardsForCollectionItem(
      newItem,
      learningLanguage,
      cardsToGenerate,
    );

    expect(cards).toContainEqual(
      expect.objectContaining({
        wordId: '1',
        value: 'hello',
        translation: 'hola',
        learningType: LearningType.Writing,
      }),
    );
  });

  it('should create listening cards correctly', () => {
    const cards = createLearningCardsForCollectionItem(
      newItem,
      learningLanguage,
      cardsToGenerate,
    );

    expect(cards).toContainEqual(
      expect.objectContaining({
        wordId: '1',
        value: 'hello',
        translation: 'hola',
        learningType: LearningType.Listening,
      }),
    );
  });

  it('should handle multiple learning values for listening cards', () => {
    const newItemWithMultipleValues = {
      ...newItem,
      value: 'hello, hi',
    };
    const cards = createLearningCardsForCollectionItem(
      newItemWithMultipleValues,
      learningLanguage,
      cardsToGenerate,
    );

    expect(cards).toHaveLength(4); // 2 flashcards + 1 writing card + 1 listening cards
    expect(
      cards.filter(card => card.learningType === LearningType.Listening),
    ).toHaveLength(1);
  });
});
