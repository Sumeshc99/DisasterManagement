// BlinkingIcon.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface BlinkingIconProps {
  size?: number;
}

const BlinkingIcon: React.FC<BlinkingIconProps> = ({ size = 60 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.2,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        ),
      ]).start();
    };

    animate();
  }, [opacity]);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <View
        style={[
          styles.outerMost,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <View
          style={[
            styles.outerRing,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: (size * 0.7) / 2,
            },
          ]}
        >
          <View
            style={[
              styles.innerDot,
              {
                width: size * 0.46,
                height: size * 0.46,
                borderRadius: (size * 0.46) / 2,
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerMost: {
    backgroundColor: 'rgba(255, 148, 148, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    backgroundColor: 'rgba(255, 120, 120, 0.70)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    backgroundColor: '#E53935',
  },
});

export default BlinkingIcon;
