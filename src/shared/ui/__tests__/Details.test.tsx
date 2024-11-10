import {Text} from 'react-native-paper';
import {Details} from '../Details';
import {render, screen, userEvent} from '@testing-library/react-native';
import React from 'react';

describe('Details Component', () => {
  it('renders with collapsed title by default', () => {
    render(
      <Details>
        <Text>Additional Settings Content</Text>
      </Details>,
    );

    expect(screen.getByText('show_additional_settings')).toBeOnTheScreen();
    expect(
      screen.queryByText('Additional Settings Content'),
    ).not.toBeOnTheScreen();
  });

  it('toggles details visibility when button is pressed', async () => {
    render(
      <Details>
        <Text>Additional Settings Content</Text>
      </Details>,
    );

    expect(
      screen.queryByText('Additional Settings Content'),
    ).not.toBeOnTheScreen();
    expect(screen.getByText('show_additional_settings')).toBeOnTheScreen();

    const button = screen.getByRole('button');

    const user = userEvent.setup();
    await user.press(button);

    expect(screen.getByText('Additional Settings Content')).toBeOnTheScreen();
    expect(screen.getByText('hide_additional_settings')).toBeOnTheScreen();
  });
});
