import {render} from '@testing-library/react-native';
import {FlashcardWrapper} from '../FlashcardWrapper';
import {View} from 'react-native';
import React from 'react';

describe('FlashcardWrapper', () => {
  it('should match the snapshot', () => {
    const {toJSON} = render(
      <FlashcardWrapper header={<View />} footer={<View />}>
        <View />
      </FlashcardWrapper>,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
