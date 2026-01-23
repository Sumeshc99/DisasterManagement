import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import KpiCard from '../UI/KpiCard';
import { FONT } from '../../themes/AppConst';
import KpiGrid from '../UI/KpiGrid';

const ResolutionMetrics = () => {
  const data = [{ value: '1 hour', label: 'Mean Time to Resolve Incident' }];
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
  },
});
