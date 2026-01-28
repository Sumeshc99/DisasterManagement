import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KpiGrid from '../UI/KpiGrid';
import { FONT } from '../../themes/AppConst';
import { COLOR } from '../../themes/Colors';
import MeterSvg from '../../assets/svg/Rectangle 1208.svg';
const SeverityMetrics = () => {
  const data = [
    {
      value: '1',
      label: 'Incident Severity Score',
      icon: MeterSvg, // temporary, will replace later
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Severity Metrics</Text>

      <KpiGrid data={data} variant="wide" />
    </View>
  );
};

export default SeverityMetrics;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT.R_SBD_600,
    marginBottom: 12,
    color: COLOR.lightTextGrey2,
  },
});
