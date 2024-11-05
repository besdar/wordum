import React from 'react';
import {
  render,
  fireEvent,
  screen,
  userEvent,
} from '@testing-library/react-native';
import {ControlledTextInput} from '../ControlledTextInput';
import {
  MockFormProvider,
  MockWrapperProvider,
  SUBMIT_TEST_BUTTON,
} from '../../config/mocks/MockWrapperProvider';

describe('ControlledTextInput', () => {
  it('renders correctly', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledTextInput name="testInput" />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const input = screen.getByTestId('input_testInput');

    expect(input).toBeOnTheScreen();
  });

  it('displays helper text when provided', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledTextInput
            name="testInput"
            helperText="This is helper text"
          />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    expect(screen.getByText('This is helper text')).toBeOnTheScreen();
  });

  it('displays error message when validation fails', async () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledTextInput
            name="testInput"
            rules={{required: 'This field is required'}}
          />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const button = screen.getByTestId(SUBMIT_TEST_BUTTON);
    const user = userEvent.setup();
    await user.press(button);

    const errorMessage = await screen.findByText('This field is required');
    expect(errorMessage).toBeOnTheScreen();
  });

  it('calls onChange when input value changes', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledTextInput name="testInput" />
        </MockFormProvider>
      </MockWrapperProvider>,
    );
    const input = screen.getByTestId('input_testInput');

    fireEvent.changeText(input, 'New Value');
    expect(input.props.value).toBe('New Value');
  });
});
