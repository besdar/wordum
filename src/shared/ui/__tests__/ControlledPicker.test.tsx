import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {ControlledPicker} from '../ControlledPicker';
import {
  MockFormProvider,
  MockWrapperProvider,
} from '../../config/mocks/MockWrapperProvider';

jest.mock('../../../app/ui/Material3ThemeProvider', () => ({
  useAppTheme: () => ({colors: {background: 'background'}}),
}));

describe('ControlledPicker', () => {
  const mockItems = [
    {value: '1', label: 'Item 1'},
    {value: '2', label: 'Item 2'},
    {value: '3', label: 'Item 3'},
  ];

  it('renders correctly', () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledPicker name="testPicker" items={mockItems} />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const input = screen.getByTestId('text-input-outlined');
    expect(input).toBeOnTheScreen();
  });

  // TODO: this test fails, but only on ci pipeline
  it.skip('displays selected item label', async () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledPicker name="testPicker" items={mockItems} />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const input = screen.getByTestId('text-input-outlined');
    const button = screen.getAllByRole('button')[0];
    const user = userEvent.setup();
    await user.press(button);

    const item = screen.getByText('Item 1');
    await user.press(item);

    expect(input.props.value).toBe('Item 1');
  });

  it('opens modal when icon is pressed', async () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledPicker name="testPicker" items={mockItems} />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const button = screen.getAllByRole('button')[0];
    const user = userEvent.setup();
    await user.press(button);

    expect(screen.getByText('Item 1')).toBeOnTheScreen();
    expect(screen.getByText('Item 2')).toBeOnTheScreen();
    expect(screen.getByText('Item 3')).toBeOnTheScreen();
  });

  it('calls onChange when an item is selected', async () => {
    render(
      <MockWrapperProvider>
        <MockFormProvider>
          <ControlledPicker name="testPicker" items={mockItems} />
        </MockFormProvider>
      </MockWrapperProvider>,
    );

    const input = screen.getByTestId('text-input-outlined');
    const button = screen.getAllByRole('button')[0];
    const user = userEvent.setup();
    await user.press(button);

    const item = screen.getByText('Item 2');
    await user.press(item);

    expect(input.props.value).toBe('Item 2');
  });
});
