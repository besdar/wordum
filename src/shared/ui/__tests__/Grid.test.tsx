import {render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';
import {Grid} from '../Grid';

describe('FormContainer', () => {
  it('should match the snapshot', async () => {
    const {toJSON} = await render(
      <Grid>
        <Text>Test</Text>
      </Grid>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
