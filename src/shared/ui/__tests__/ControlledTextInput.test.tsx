import React from 'react';
import {
  act,
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import {ControlledTextInput} from '../ControlledTextInput';
import {MockWrapperProvider} from '../../config/mocks/MockWrapperProvider';
import {createFormControl} from 'react-hook-form';

describe('ControlledTextInput', () => {
  it('renders correctly', () => {
    const {register, control} = createFormControl({
      defaultValues: {
        testInput: '',
      },
    });

    render(
      <MockWrapperProvider>
        <ControlledTextInput {...register('testInput')} control={control} />
      </MockWrapperProvider>,
    );

    const input = screen.getByTestId('input_testInput');

    expect(input).toBeOnTheScreen();
  });

  it('displays helper text when provided', () => {
    const {register, control} = createFormControl({
      defaultValues: {
        testInput: '',
      },
    });

    render(
      <MockWrapperProvider>
        <ControlledTextInput
          {...register('testInput')}
          control={control}
          helperText="This is helper text"
        />
      </MockWrapperProvider>,
    );

    expect(screen.getByText('This is helper text')).toBeOnTheScreen();
  });

  it('displays error message when validation fails', async () => {
    const {handleSubmit, register, control} = createFormControl({
      defaultValues: {
        testInput: '',
      },
    });

    render(
      <MockWrapperProvider>
        <ControlledTextInput
          {...register('testInput', {
            required: 'This field is required',
          })}
          control={control}
        />
      </MockWrapperProvider>,
    );

    await act(() => handleSubmit(() => {})());

    const errorMessage = await screen.findByText('This field is required');

    await waitFor(() => expect(errorMessage).toBeOnTheScreen());
  });

  it('calls onChange when input value changes', () => {
    const {register, control} = createFormControl({
      defaultValues: {
        testInput: '',
      },
    });

    render(
      <MockWrapperProvider>
        <ControlledTextInput {...register('testInput')} control={control} />
      </MockWrapperProvider>,
    );

    const user = userEvent.setup();
    const input = screen.getByTestId('input_testInput');

    user.type(input, 'New Value');

    return waitFor(() => expect(input.props.value).toBe('New Value'));
  });
});
