import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KpiGrid from '../UI/KpiGrid';
import { FONT } from '../../themes/AppConst';
import { COLOR } from '../../themes/Colors';

import MeterSvg from '../../assets/svg/Rectangle 1210.svg';
const ResolutionMetrics = () => {
  const data = [
    {
      value: '1 hour',
      label: 'Mean Time to Resolve Incident',
      icon: MeterSvg, // temporary icon
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Resolution and Closure Metrics</Text>

      <KpiGrid data={data} variant="wide" />
    </View>
  );
};

export default ResolutionMetrics;

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT.R_SBD_600,
    marginBottom: 12,
    color: COLOR.lightTextGrey2,
  },
});
