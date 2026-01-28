import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';

const filters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const TimeFilter = () => {
  const [active, setActive] = useState('Daily');
  const [tabWidths, setTabWidths] = useState<number[]>([]);
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const activeIndex = filters.indexOf(active);

  const gap = 24; // space between filters

  const animateUnderline = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += tabWidths[i] + gap;
    }

    Animated.spring(underlineAnim, {
      toValue: offset,
      useNativeDriver: false,
      tension: 150,
      friction: 15,
    }).start();
  };

  const handlePress = (item: string, index: number) => {
    setActive(item);
    animateUnderline(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {filters.map((item, index) => (
          <TouchableOpacity
            key={item}
            onPress={() => handlePress(item, index)}
            style={{ marginRight: index !== filters.length - 1 ? gap : 0 }}
          >
            <Text
              onLayout={e => {
                const w = e.nativeEvent.layout.width;
                setTabWidths(prev => {
                  const newWidths = [...prev];
                  newWidths[index] = w;
                  return newWidths;
                });
              }}
              style={[styles.text, active === item && styles.active]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Only render underline if all tab widths are measured */}
      {tabWidths.length === filters.length && (
        <Animated.View
          style={[
            styles.underline,
            {
              width: tabWidths[activeIndex] + 12,
              transform: [
                {
                  translateX: Animated.subtract(
                    underlineAnim,
                    6, // half of extra width
                  ),
                },
              ],
            },
          ]}
        />
      )}
    </View>
  );
};

export default TimeFilter;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 6,
  },
  row: {
    flexDirection: 'row',
  },
  text: {
    fontFamily: FONT.R_REG_400,
    color: COLOR.lightTextGrey,
    fontSize: 16,
  },
  active: {
    color: COLOR.blue,
    fontFamily: FONT.R_SBD_600,
  },
  underline: {
    height: 3,
    backgroundColor: COLOR.blue,
    borderRadius: 2,
    marginTop: 6,
  },
});
