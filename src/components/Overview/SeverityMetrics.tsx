import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KpiCard from '../UI/KpiCard';
import { FONT } from '../../themes/AppConst';
import KpiGrid from '../UI/KpiGrid';

const SeverityMetrics = () => {
  const data = [
    {
      value: '1',
      label: 'Incdient Severity Score',
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
  },
});
