import {getResponsiveLayout} from '../responsive';

describe('getResponsiveLayout', () => {
  it('returns phone layout for a narrow phone portrait viewport', () => {
    expect(getResponsiveLayout({width: 390, height: 844})).toMatchObject({
      isTablet: false,
      isLandscape: false,
      screenPadding: 10,
      collectionColumns: 2,
    });
  });

  it('returns tablet portrait layout for a tablet portrait viewport', () => {
    expect(getResponsiveLayout({width: 820, height: 1180})).toMatchObject({
      isTablet: true,
      isLandscape: false,
      screenPadding: 24,
      collectionColumns: 3,
    });
  });

  it('returns wide tablet layout for a tablet landscape viewport', () => {
    expect(getResponsiveLayout({width: 1180, height: 820})).toMatchObject({
      isTablet: true,
      isLandscape: true,
      screenPadding: 24,
      collectionColumns: 4,
    });
  });
});
