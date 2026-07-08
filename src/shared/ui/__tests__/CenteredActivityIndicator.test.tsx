import {render} from '@testing-library/react-native';
import React from 'react';
import {CenteredActivityIndicator} from '../CenteredActivityIndicator';

describe('CenteredActivityIndicator', () => {
  it('should match the snapshot', async () => {
    const {toJSON} = await render(<CenteredActivityIndicator />);

    expect(toJSON()).toMatchSnapshot();
  });
});
