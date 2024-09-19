import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {IconButton} from '../IconButton';
import {View} from 'react-native';

describe('IconButton', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<IconButton icon={() => <View />} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should not call onPress when disabled', async () => {
    const mockOnPress = jest.fn();

    render(<IconButton onPress={mockOnPress} disabled icon={() => <View />} />);

    const button = screen.getByRole('button');

    const user = userEvent.setup();
    await user.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
