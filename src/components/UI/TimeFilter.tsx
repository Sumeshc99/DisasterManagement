import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';

const filters = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const TimeFilter = () => {
  const [active, setActive] = useState('Daily');

  return (
    <View style={styles.row}>
      {filters.map(item => (
        <TouchableOpacity key={item} onPress={() => setActive(item)}>
          <Text style={[styles.text, active === item && styles.active]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TimeFilter;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  text: {
    marginRight: 16,
    fontFamily: FONT.R_REG_400,
    color: '#6B7280',
  },
  active: {
    color: COLOR.blue,
    textDecorationLine: 'underline',
    fontFamily: FONT.R_SBD_600,
  },
});
