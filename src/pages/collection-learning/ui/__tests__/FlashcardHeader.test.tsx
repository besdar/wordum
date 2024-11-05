import {Rating} from 'ts-fsrs';
import {appSettings} from '../../../../shared/model/AppSettings';
import {render, screen} from '@testing-library/react-native';
import {FlashcardHeader} from '../FlashcardHeader';
import React from 'react';

jest.mock('../../../../shared/model/AppSettings', () => ({
  appSettings: {
    getSetting: jest.fn(),
  },
}));

describe('FlashcardHeader', () => {
  const mockStatistics = {
    [Rating.Again]: 2,
    [Rating.Hard]: 3,
    [Rating.Good]: 5,
    [Rating.Easy]: 7,
  };

  it('should render statistics when showAdditionalStat is true', () => {
    (appSettings.getSetting as jest.Mock).mockReturnValue(true);

    render(<FlashcardHeader statistics={mockStatistics} />);

    expect(screen.getByText('2')).toBeOnTheScreen(); // Rating.Again
    expect(screen.getByText('3')).toBeOnTheScreen(); // Rating.Hard
    expect(screen.getByText('5')).toBeOnTheScreen(); // Rating.Good
    expect(screen.getByText('7')).toBeOnTheScreen(); // Rating.Easy
  });

  it('should not render anything when showAdditionalStat is false', () => {
    (appSettings.getSetting as jest.Mock).mockReturnValue(false);

    render(<FlashcardHeader statistics={mockStatistics} />);

    expect(screen.queryByText('2')).not.toBeOnTheScreen();
    expect(screen.queryByText('3')).not.toBeOnTheScreen();
    expect(screen.queryByText('5')).not.toBeOnTheScreen();
    expect(screen.queryByText('7')).not.toBeOnTheScreen();
  });
});
