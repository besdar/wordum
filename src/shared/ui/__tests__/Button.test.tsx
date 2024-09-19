import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {Button} from '../Button';

describe('Button', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<Button>Test</Button>);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should not call onPress when disabled', async () => {
    const mockOnPress = jest.fn();

    render(
      <Button onPress={mockOnPress} disabled>
        Press Me
      </Button>,
    );

    const button = screen.getByRole('button');

    const user = userEvent.setup();
    await user.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
