import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import {WritingFooter} from '../WritingFooter';
import {showConfirmationAlert} from '../../../../shared/lib/message';
import {Answers} from '../../model/types';
import {AppSupportedLanguages} from '../../../../shared/model/lang';
import React from 'react';

jest.mock('../../../../shared/lib/message', () => ({
  showConfirmationAlert: jest.fn(),
}));

describe('WritingFooter', () => {
  const mockOnAnswerPress = jest.fn();
  const learningWord = 'apple,banana';
  const learningLanguage = AppSupportedLanguages.ENGLISH;

  it('renders correctly', () => {
    render(
      <WritingFooter
        onAnswerPress={mockOnAnswerPress}
        learningWord={learningWord}
        learningLanguage={learningLanguage}
      />,
    );

    expect(screen.getByTestId(`input_answer`)).toBeOnTheScreen(); // Check if the input label is rendered
    expect(screen.getByLabelText('card_deletion')).toBeOnTheScreen(); // Check if the delete button is rendered
    expect(screen.getByLabelText('skip')).toBeOnTheScreen(); // Check if the skip button is rendered
  });

  it('submits the correct answer', async () => {
    render(
      <WritingFooter
        onAnswerPress={mockOnAnswerPress}
        learningWord={learningWord}
        learningLanguage={learningLanguage}
      />,
    );

    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

    const input = screen.getByTestId(`input_answer`);
    await user.type(input, 'apple');
    await user.press(screen.getByLabelText('proceed'));

    await waitFor(() => {
      expect(mockOnAnswerPress).toHaveBeenCalledWith(Answers.Correct);
    });
  });

  it('shows the correct answer when the answer is incorrect', async () => {
    render(
      <WritingFooter
        onAnswerPress={mockOnAnswerPress}
        learningWord={learningWord}
        learningLanguage={learningLanguage}
      />,
    );

    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

    const input = screen.getByTestId(`input_answer`);
    await user.type(input, 'orange');
    await act(() => user.press(screen.getByLabelText('proceed')));

    expect(screen.getByText('correct_answer: apple,banana')).toBeOnTheScreen();
  });

  it('calls onAnswerPress with Answers.Delete when delete button is pressed', async () => {
    (showConfirmationAlert as jest.Mock).mockResolvedValue(undefined);

    render(
      <WritingFooter
        onAnswerPress={mockOnAnswerPress}
        learningWord={learningWord}
        learningLanguage={learningLanguage}
      />,
    );

    const user = userEvent.setup();

    await user.press(screen.getByLabelText('card_deletion'));

    expect(showConfirmationAlert).toHaveBeenCalled();

    expect(mockOnAnswerPress).toHaveBeenCalledWith(Answers.Delete);
  });

  it('calls onAnswerPress with Answers.Incorrect when skip button is pressed after an incorrect answer', async () => {
    render(
      <WritingFooter
        onAnswerPress={mockOnAnswerPress}
        learningWord={learningWord}
        learningLanguage={learningLanguage}
      />,
    );

    const user = userEvent.setup();

    const input = screen.getByTestId(`input_answer`);
    await user.type(input, 'orange');
    await user.press(screen.getByLabelText('proceed'));

    const skipButton = await screen.findByLabelText('skip');
    await user.press(skipButton);

    expect(mockOnAnswerPress).toHaveBeenCalledWith(Answers.Incorrect);
  });
});
