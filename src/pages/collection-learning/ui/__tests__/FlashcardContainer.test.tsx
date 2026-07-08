import {render} from '@testing-library/react-native';
import React from 'react';
import {View} from 'react-native';
import {FlashcardContainer} from '../FlashcardContainer';

describe('FlashcardContainer', () => {
  it('should match the snapshot', async () => {
    const {toJSON} = await render(
      <FlashcardContainer>
        <View />
      </FlashcardContainer>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
