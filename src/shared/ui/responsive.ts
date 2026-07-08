import {useWindowDimensions} from 'react-native';

export const TABLET_MIN_SHORT_SIDE = 600;
export const WIDE_TABLET_MIN_WIDTH = 900;

export const PHONE_SCREEN_PADDING = 10;
export const TABLET_SCREEN_PADDING = 24;
export const FORM_MAX_WIDTH = 720;
export const LEARNING_MAX_WIDTH = 840;
export const OVERVIEW_MAX_WIDTH = 1120;
export const PICKER_MODAL_MAX_WIDTH = 520;

type ViewportSize = {
  width: number;
  height: number;
};

export type CollectionColumns = 2 | 3 | 4;

export const getResponsiveLayout = ({width, height}: ViewportSize) => {
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= TABLET_MIN_SHORT_SIDE;
  const isLandscape = width > height;
  const isWideTablet =
    isTablet && isLandscape && width >= WIDE_TABLET_MIN_WIDTH;

  let collectionColumns: CollectionColumns = 2;

  if (isWideTablet) {
    collectionColumns = 4;
  } else if (isTablet) {
    collectionColumns = 3;
  }

  return {
    isTablet,
    isLandscape,
    screenPadding: isTablet ? TABLET_SCREEN_PADDING : PHONE_SCREEN_PADDING,
    collectionColumns,
    formMaxWidth: FORM_MAX_WIDTH,
    learningMaxWidth: LEARNING_MAX_WIDTH,
    overviewMaxWidth: OVERVIEW_MAX_WIDTH,
    pickerModalMaxWidth: PICKER_MODAL_MAX_WIDTH,
  };
};

export const useResponsiveLayout = () => {
  const {width, height} = useWindowDimensions();

  return getResponsiveLayout({width, height});
};
