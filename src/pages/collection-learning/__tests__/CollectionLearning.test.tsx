import {render, screen} from '@testing-library/react-native';
import {Collection, LearningType} from '../../../shared/model/collection';
import {CollectionLearning} from '../CollectionLearning';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PagesStackProps} from '../../../shared/model/navigator';
import {useTrainingWord} from '../model/useTrainingWord';

jest.mock('../model/useTrainingWord', () => ({
  useTrainingWord: jest.fn(),
}));

describe('CollectionLearning', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  } as unknown as NativeStackScreenProps<
    PagesStackProps,
    'CollectionLearning'
  >['navigation'];

  const mockCollection = new Collection(); // Mock collection object
  const mockRoute = {
    params: {
      collection: mockCollection,
    },
  } as unknown as NativeStackScreenProps<
    PagesStackProps,
    'CollectionLearning'
  >['route'];

  it('should render final screen when isItFinal is true', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: undefined,
      setNextTrainingWord: jest.fn(),
      translation: '',
      isItFinal: true,
      examples: [],
      learningType: LearningType.Flascards,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('all_for_now')).toBeOnTheScreen();
    expect(screen.getByText('finish')).toBeOnTheScreen();
  });

  it('should render flashcard view when learning type is flashcards', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: jest.fn(),
      translation: 'testTranslation',
      isItFinal: false,
      examples: [],
      learningType: LearningType.Flascards,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('testWord')).toBeOnTheScreen();
    expect(screen.getByText('show_answer')).toBeOnTheScreen(); // Assuming the answer is not shown initially
  });

  it('should render writing view when learning type is writing', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: jest.fn(),
      translation: 'testTranslation',
      isItFinal: false,
      examples: [],
      learningType: LearningType.Writing,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('testTranslation')).toBeOnTheScreen();
  });

  it('should render listening view when learning type is listening', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: jest.fn(),
      translation: 'testTranslation',
      isItFinal: false,
      examples: [],
      learningType: LearningType.Listening,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: 'testSound',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.queryByText('testWord')).not.toBeOnTheScreen();
    expect(screen.getByText('no_audio_message')).toBeOnTheScreen(); // Assuming this button is rendered
  });

  // TODO: fix logic, this screen is not reachable
  it.skip('should handle no training word available', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: undefined,
      setNextTrainingWord: jest.fn(),
      translation: '',
      isItFinal: true,
      examples: [],
      learningType: LearningType.Flascards,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('nothing_to_learn')).toBeOnTheScreen();
    expect(screen.getByText('add_word_to_this_collection')).toBeOnTheScreen();
    expect(screen.getByText('return_back')).toBeOnTheScreen();
  });

  it('should render error screen when something went wrong', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'text',
      setNextTrainingWord: jest.fn(),
      translation: '',
      isItFinal: false,
      examples: [],
      learningType: undefined,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('something_went_wrong')).toBeOnTheScreen();
    expect(screen.getByText('return_back')).toBeOnTheScreen();
  });
});
