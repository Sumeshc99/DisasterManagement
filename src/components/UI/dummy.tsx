import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface BlinkingSvgProps {
  size?: number;
  color?: string;
}
const BlinkingSvg: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = 'red',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M10 10 L90 10 L50 90 Z" fill={color} />
    </Svg>
  );
};

export default BlinkingSvg;
