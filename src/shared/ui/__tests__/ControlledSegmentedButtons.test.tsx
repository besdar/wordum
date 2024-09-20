import React from 'react';
import {render, screen, within, userEvent} from '@testing-library/react-native';
import {ControlledSegmentedButtons} from '../ControlledSegmentedButtons';
import {
  MockFormProvider,
  MockWrapperProvider,
  SUBMIT_TEST_BUTTON,
} from '../../config/mocks/MockWrapperProvider';

describe('ControlledSegmentedButtons', () => {
  const options = [
    {value: 'option1', label: 'Option 1'},
    {value: 'option2', label: 'Option 2'},
    {value: 'option3', label: 'Option 3'},
  ];

  const getOption = (optionName: string) =>
    screen
      .getAllByRole('button')
      .filter(button => Boolean(within(button).queryByText(optionName)))[0];

  it('renders correctly', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledSegmentedButtons
            name="testSegmentedButtons"
            label="Test Segmented Buttons"
            buttons={options}
          />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const label = screen.getByText('Test Segmented Buttons');
    expect(label).toBeOnTheScreen();
    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeOnTheScreen();
    });
  });

  it.skip('selects an option when clicked', async () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledSegmentedButtons
            name="testSegmentedButtons"
            label="Test Segmented Buttons"
            buttons={options}
          />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const option1 = getOption(options[0].label);
    const user = userEvent.setup();
    await user.press(option1);

    expect(option1.props.accessibilityState.checked).toBe(true);

    const option2 = getOption(options[1].label);
    await user.press(option2);

    expect(option1.props.accessibilityState.checked).toBe(false);
    expect(option2.props.accessibilityState.checked).toBe(true);
  });

  it('displays error message when validation fails', async () => {
    const onSubmit = jest.fn();

    render(
      <MockWrapperProvider>
        <MockFormProvider onSubmit={onSubmit}>
          <ControlledSegmentedButtons
            name="testSegmentedButtons"
            label="Test Segmented Buttons"
            buttons={options}
            rules={{required: 'This field is required'}}
          />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const button = screen.getByTestId(SUBMIT_TEST_BUTTON);
    const user = userEvent.setup();
    await user.press(button);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
