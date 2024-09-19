import {render} from '@testing-library/react-native';
import React from 'react';
import {Grid} from '../Grid';

describe('FormContainer', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<Grid>Test</Grid>);

    expect(toJSON()).toMatchSnapshot();
  });
});
