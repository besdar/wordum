import {render, screen, userEvent} from '@testing-library/react-native';
import {About} from '../About';
import React from 'react';
import {Linking} from 'react-native';

jest.mock('../../../../package.json', () => ({
  version: '1.0',
}));

describe('About', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<About />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should not call onPress when button clicked', async () => {
    const spy = jest.spyOn(Linking, 'openURL').mockImplementation();

    render(<About />);

    const button = screen.getByRole('button');

    const user = userEvent.setup();
    await user.press(button);

    expect(spy).toHaveBeenCalled();
  });
});
