import React, { useEffect, useRef, memo } from 'react';
import { Animated, Easing, Image } from 'react-native';
import { WIDTH } from '../../themes/AppConst';

const BlinkingIncidentIcon = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Image
      source={require('../../assets/incedent.png')}
      style={{
        width: WIDTH(10),
        height: WIDTH(10),
        opacity, // blinking effect
        transform: [{ scale }], // zoom in/out effect
      }}
      resizeMode="contain"
    />
  );
};

export default memo(BlinkingIncidentIcon);
