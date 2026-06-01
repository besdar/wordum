import {render} from '@testing-library/react-native';
import React from 'react';
import {FormContainer} from '../FormContainer';

describe('FormContainer', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<FormContainer>Test</FormContainer>);

    expect(toJSON()).toMatchSnapshot();
  });
});
