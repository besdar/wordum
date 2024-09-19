import {downloadFile} from '@dr.pogodin/react-native-fs';
import {CollectionFormFields, LearningType} from '../../model/collection';
import {
  createLearningCardsForCollectionItem,
  downloadVoice,
  getUUID,
} from '../collection';

describe('getUUID', () => {
  it('should generate a UUID string', () => {
    const uuid = getUUID();

    expect(uuid).toMatch(/^[0-9a-f]{12,}$/);
  });
});

describe('downloadVoice', () => {
  it('should return an empty string if no voiceURL is provided', async () => {
    const result = await downloadVoice();

    expect(result).toBe('');
  });

  it('should return an empty string if download fails', async () => {
    (downloadFile as jest.Mock).mockReturnValueOnce({
      promise: Promise.resolve({statusCode: 404}),
    });

    const result = await downloadVoice('http://example.com/voice.mp3');

    expect(result).toBe('');
  });

  it('should return the file path if download is successful', async () => {
    (downloadFile as jest.Mock).mockReturnValueOnce({
      promise: Promise.resolve({statusCode: 200}),
    });

    const result = await downloadVoice('http://example.com/voice.mp3');

    expect(result).toContain('.mp3');
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
    const sourceVoice = 'sourceVoice.mp3';
    const targetVoice = 'targetVoice.mp3';
    const cards = createLearningCardsForCollectionItem(
      newItem,
      learningLanguage,
      cardsToGenerate,
      sourceVoice,
      targetVoice,
    );

    expect(cards).toContainEqual(
      expect.objectContaining({
        wordId: '1',
        value: 'hello',
        translation: 'hola',
        learningType: LearningType.Listening,
        sourceVoice,
        targetVoice,
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
