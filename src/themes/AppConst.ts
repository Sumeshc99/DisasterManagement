import { Dimensions } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

//  Responsive Design width & height
export const HEIGHT = responsiveHeight;
export const WIDTH = responsiveWidth;
export const FONTSIZE = responsiveFontSize;

// Dimensions
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

// src/themes/Fonts.ts
export const FONT = {
  R_THIN_100: 'Roboto-Thin',
  R_THIN_I_100: 'Roboto-ThinItalic',
  R_XLIGHT_200: 'Roboto-ExtraLight',
  R_XLIGHT_I_200: 'Roboto-ExtraLightItalic',
  R_LIGHT_300: 'Roboto-Light',
  R_LIGHT_I_300: 'Roboto-LightItalic',
  R_REG_400: 'Roboto-Regular',
  R_REG_I_400: 'Roboto-Italic',
  R_MED_500: 'Roboto-Medium',
  R_MED_I_500: 'Roboto-MediumItalic',
  R_SBD_600: 'Roboto-SemiBold',
  R_SBD_I_600: 'Roboto-SemiBoldItalic',
  R_BOLD_700: 'Roboto-Bold',
  R_BOLD_I_700: 'Roboto-BoldItalic',
  R_XBOLD_800: 'Roboto-ExtraBold',
  R_XBOLD_I_800: 'Roboto-ExtraBoldItalic',
  R_BLK_900: 'Roboto-Black',
  R_BLK_I_900: 'Roboto-BlackItalic',
} as const;

export type FontKeys = keyof typeof FONT;
