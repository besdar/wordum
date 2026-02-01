import {render, screen, fireEvent} from '@testing-library/react-native';
import {Collection, LearningType} from '../../../shared/model/collection';
import {CollectionLearning} from '../CollectionLearning';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PagesStackProps} from '../../../shared/model/navigator';
import {useTrainingWord} from '../model/useTrainingWord';
import {speak} from 'expo-speech';

jest.mock('../model/useTrainingWord', () => ({
  useTrainingWord: jest.fn(),
}));

describe('CollectionLearning', () => {
  const mockGoBack = jest.fn();
  const mockNavigate = jest.fn();
  const mockNavigation = {
    goBack: mockGoBack,
    navigate: mockNavigate,
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('should call navigation.goBack when finish button is pressed on final screen', () => {
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

    fireEvent.press(screen.getByText('finish'));

    expect(mockGoBack).toHaveBeenCalled();
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

  it('should show translation and examples when answer is shown in flashcard view', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: jest.fn(),
      translation: 'testTranslation',
      isItFinal: false,
      examples: 'example sentence',
      learningType: LearningType.Flascards,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Initially translation should not be visible
    expect(screen.queryByText('testTranslation')).not.toBeOnTheScreen();

    // Press show answer button
    fireEvent.press(screen.getByText('show_answer'));

    // Now translation and examples should be visible
    expect(screen.getByText('testTranslation')).toBeOnTheScreen();
    expect(screen.getByText('example sentence')).toBeOnTheScreen();
  });

  it('should call setNextTrainingWord and hide answer when flashcard answer button is pressed', () => {
    const mockSetNextTrainingWord = jest.fn();
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: mockSetNextTrainingWord,
      translation: 'testTranslation',
      isItFinal: false,
      examples: '',
      learningType: LearningType.Flascards,
      learningLanguage: '',
      statistics: {},
      progress: 0,
      sound: '',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Show answer first
    fireEvent.press(screen.getByText('show_answer'));

    // Press one of the answer buttons (e.g., "correct")
    fireEvent.press(screen.getByText('correct'));

    expect(mockSetNextTrainingWord).toHaveBeenCalled();
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

  it('should call speak when volume button is pressed in listening view', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: jest.fn(),
      translation: 'testTranslation',
      isItFinal: false,
      examples: [],
      learningType: LearningType.Listening,
      learningLanguage: 'en-US',
      statistics: {},
      progress: 0,
      sound: 'testSound',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Find and press the volume button (IconButton with icon="volume-high")
    const volumeButton = screen.getByTestId('icon-button-volume-high');
    fireEvent.press(volumeButton);

    expect(speak).toHaveBeenCalledWith('testWord', {language: 'en-US'});
  });

  it('should call setNextTrainingWord with SkipListening when no audio button is pressed', () => {
    const mockSetNextTrainingWord = jest.fn();
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: mockSetNextTrainingWord,
      translation: 'testTranslation',
      isItFinal: false,
      examples: [],
      learningType: LearningType.Listening,
      learningLanguage: 'en-US',
      statistics: {},
      progress: 0,
      sound: 'testSound',
    });

    render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    fireEvent.press(screen.getByText('no_audio_message'));

    expect(mockSetNextTrainingWord).toHaveBeenCalled();
  });

  it('should render loading indicator when no training word and not final', () => {
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: undefined,
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

    // Should render CenteredActivityIndicator
    expect(screen.getByTestId('activity-indicator')).toBeOnTheScreen();
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

  it('should call navigation.goBack when return_back button is pressed on error screen', () => {
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

    fireEvent.press(screen.getByText('return_back'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
