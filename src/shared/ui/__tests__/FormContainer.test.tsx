import {render} from '@testing-library/react-native';
import {FormContainer} from '../FormContainer';
import React from 'react';

describe('FormContainer', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(<FormContainer>Test</FormContainer>);

    expect(toJSON()).toMatchSnapshot();
  });
});
