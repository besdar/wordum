import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import {FlashcardButtons} from '../FlashcardButtons';
import React from 'react';
import {Answers} from '../../model/types';
import {showConfirmationAlert} from '../../../../shared/lib/message';

jest.mock('../../../../shared/lib/message', () => ({
  showConfirmationAlert: jest.fn(),
}));

describe('FlashcardButtons', () => {
  const mockOnAnswerPress = jest.fn();
  const mockOnAnswerShow = jest.fn();

  it('should render show answer button when isAnswerShown is false', () => {
    render(
      <FlashcardButtons
        onAnswerPress={mockOnAnswerPress}
        onAnswerShow={mockOnAnswerShow}
        isAnswerShown={false}
      />,
    );

    expect(screen.getByText('show_answer')).toBeOnTheScreen(); // Check if the button to show the answer is rendered
  });

  it('should render answer buttons when isAnswerShown is true', () => {
    render(
      <FlashcardButtons
        onAnswerPress={mockOnAnswerPress}
        onAnswerShow={mockOnAnswerShow}
        isAnswerShown={true}
      />,
    );

    expect(screen.getByText('incorrect')).toBeOnTheScreen(); // Check if the "Incorrect" button is rendered
    expect(screen.getByLabelText('card_deletion')).toBeOnTheScreen(); // Check if the "Delete" button is rendered
    expect(screen.getByText('correct')).toBeOnTheScreen(); // Check if the "Correct" button is rendered
  });

  it('should call onAnswerShow when show answer button is pressed', async () => {
    render(
      <FlashcardButtons
        onAnswerPress={mockOnAnswerPress}
        onAnswerShow={mockOnAnswerShow}
        isAnswerShown={false}
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByText('show_answer'));

    expect(mockOnAnswerShow).toHaveBeenCalled(); // Check if onAnswerShow was called
  });

  it('should call onAnswerPress with Answers.Incorrect when incorrect button is pressed', async () => {
    render(
      <FlashcardButtons
        onAnswerPress={mockOnAnswerPress}
        onAnswerShow={mockOnAnswerShow}
        isAnswerShown={true}
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByText('incorrect'));

    expect(mockOnAnswerPress).toHaveBeenCalledWith(Answers.Incorrect); // Check if onAnswerPress was called with Answers.Incorrect
  });

  it('should call showConfirmationAlert when delete button is pressed', async () => {
    render(
      <FlashcardButtons
        onAnswerPress={mockOnAnswerPress}
        onAnswerShow={mockOnAnswerShow}
        isAnswerShown={true}
      />,
    );

    (showConfirmationAlert as jest.Mock).mockResolvedValue(undefined);

    const user = userEvent.setup();
    await user.press(screen.getByLabelText('card_deletion'));

    expect(showConfirmationAlert).toHaveBeenCalledWith(
      'card_deletion',
      'card_deletion_message',
      'yes',
    );

    await waitFor(() =>
      expect(mockOnAnswerPress).toHaveBeenCalledWith(Answers.Delete),
    );
  });

  it('should call onAnswerPress with Answers.Correct when correct button is pressed', async () => {
    render(
      <FlashcardButtons
        onAnswerPress={mockOnAnswerPress}
        onAnswerShow={mockOnAnswerShow}
        isAnswerShown={true}
      />,
    );

    const user = userEvent.setup();
    await user.press(screen.getByText('correct'));

    expect(mockOnAnswerPress).toHaveBeenCalledWith(Answers.Correct); // Check if onAnswerPress was called with Answers.Correct
  });
});
