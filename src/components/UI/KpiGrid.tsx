import React from 'react';
import { View, StyleSheet } from 'react-native';
import KpiCard from '../UI/KpiCard';

const KpiGrid = ({ data, variant = 'grid' }) => {
  return (
    <View style={[styles.grid, variant === 'wide' && styles.wideGrid]}>
      {data.map((item, index) => (
        <View
          key={index}
          style={[styles.item, variant === 'wide' && styles.wideItem]}
        >
          <KpiCard value={item.value} label={item.label} />
        </View>
      ))}
    </View>
  );
};

export default KpiGrid;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    width: '48%',
  },
  wideGrid: {
    justifyContent: 'center',
  },

  wideItem: {
    width: '60%', // citizen / severity / resolution
  },
});
