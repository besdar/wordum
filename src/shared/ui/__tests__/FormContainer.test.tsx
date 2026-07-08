import {render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';
import {FormContainer} from '../FormContainer';

describe('FormContainer', () => {
  it('should match the snapshot', async () => {
    const {toJSON} = await render(
      <FormContainer>
        <Text>Test</Text>
      </FormContainer>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
