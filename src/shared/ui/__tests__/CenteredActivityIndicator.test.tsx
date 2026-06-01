import {render} from '@testing-library/react-native';
import React from 'react';
import {CenteredActivityIndicator} from '../CenteredActivityIndicator';

describe('CenteredActivityIndicator', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<CenteredActivityIndicator />);

    expect(toJSON()).toMatchSnapshot();
  });
});
