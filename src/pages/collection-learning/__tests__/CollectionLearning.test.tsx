import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {speak} from 'expo-speech';
import React from 'react';
import {Collection} from '../../../shared/model/collection';
import {LearningType} from '../../../shared/model/learningType';
import {PagesStackProps} from '../../../shared/model/navigator';
import {CollectionLearning} from '../CollectionLearning';
import {useTrainingWord} from '../model/useTrainingWord';

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

  it('should render final screen when isItFinal is true', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('all_for_now')).toBeOnTheScreen();
    expect(screen.getByText('finish')).toBeOnTheScreen();
  });

  it('should call navigation.goBack when finish button is pressed on final screen', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    await fireEvent.press(screen.getByText('finish'));

    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });

  it('should render flashcard view when learning type is flashcards', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('testWord')).toBeOnTheScreen();
    expect(screen.getByText('show_answer')).toBeOnTheScreen(); // Assuming the answer is not shown initially
  });

  it('should show translation and examples when answer is shown in flashcard view', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Initially translation should not be visible
    expect(screen.queryByText('testTranslation')).not.toBeOnTheScreen();

    // Press show answer button
    await fireEvent.press(screen.getByText('show_answer'));

    // Now translation and examples should be visible
    expect(screen.getByText('testTranslation')).toBeOnTheScreen();
    expect(screen.getByText('example sentence')).toBeOnTheScreen();
  });

  it('should call setNextTrainingWord and hide answer when flashcard answer button is pressed', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Show answer first
    await fireEvent.press(screen.getByText('show_answer'));

    // Press one of the answer buttons (e.g., "correct")
    await fireEvent.press(screen.getByText('correct'));

    await waitFor(() => expect(mockSetNextTrainingWord).toHaveBeenCalled());
  });

  it('should render writing view when learning type is writing', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('testTranslation')).toBeOnTheScreen();
  });

  it('should render listening view when learning type is listening', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.queryByText('testWord')).not.toBeOnTheScreen();
    expect(screen.getByText('no_audio_message')).toBeOnTheScreen(); // Assuming this button is rendered
  });

  it('should call speak when volume button is pressed in listening view', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Find and press the volume button (IconButton with icon="volume-high")
    const volumeButton = screen.getByTestId('icon-button-volume-high');
    await fireEvent.press(volumeButton);

    await waitFor(() =>
      expect(speak).toHaveBeenCalledWith('testWord', {language: 'en-US'}),
    );
  });

  it('should call setNextTrainingWord with SkipListening when no audio button is pressed', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    await fireEvent.press(screen.getByText('no_audio_message'));

    await waitFor(() => expect(mockSetNextTrainingWord).toHaveBeenCalled());
  });

  it('should render emotional support card and continue learning', async () => {
    const mockHideEmotionalSupportCard = jest.fn();
    (useTrainingWord as jest.Mock).mockReturnValue({
      trainingWord: 'testWord',
      setNextTrainingWord: jest.fn(),
      translation: 'testTranslation',
      isItFinal: false,
      examples: [],
      learningType: LearningType.Flascards,
      learningLanguage: '',
      statistics: {},
      progress: 0.5,
      emotionalSupportCard: {
        icon: 'heart-outline',
        titleKey: 'emotional_support_small_wins_title',
        messageKey: 'emotional_support_small_wins_message',
      },
      hideEmotionalSupportCard: mockHideEmotionalSupportCard,
    });

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.queryByText('testWord')).not.toBeOnTheScreen();
    expect(
      screen.getByText('emotional_support_small_wins_title'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('emotional_support_small_wins_message'),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('keep_learning'));

    await waitFor(() =>
      expect(mockHideEmotionalSupportCard).toHaveBeenCalled(),
    );
  });

  it('should render loading indicator when no training word and not final', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    // Should render CenteredActivityIndicator
    expect(screen.getByTestId('activity-indicator')).toBeOnTheScreen();
  });

  it('should render error screen when something went wrong', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    expect(screen.getByText('something_went_wrong')).toBeOnTheScreen();
    expect(screen.getByText('return_back')).toBeOnTheScreen();
  });

  it('should call navigation.goBack when return_back button is pressed on error screen', async () => {
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

    await render(
      <CollectionLearning route={mockRoute} navigation={mockNavigation} />,
    );

    await fireEvent.press(screen.getByText('return_back'));

    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});
