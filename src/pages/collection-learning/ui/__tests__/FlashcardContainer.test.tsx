import {render} from '@testing-library/react-native';
import {FlashcardContainer} from '../FlashcardContainer';
import {View} from 'react-native';
import React from 'react';

describe('FlashcardContainer', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(
      <FlashcardContainer>
        <View />
      </FlashcardContainer>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
