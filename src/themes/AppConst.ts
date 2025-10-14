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
