import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT } from '../../themes/AppConst';
import KpiGrid from '../UI/KpiGrid';
import CitizenIcon from '../../assets/svg/image 3.svg';
import { COLOR } from '../../themes/Colors';

const CitizensMetric = () => {
  const data = [
    {
      value: '1200',
      label: 'Total Registered Citizens',
      icon: CitizenIcon,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Citizens</Text>

      <KpiGrid data={data} variant="wide" />
    </View>
  );
};

export default CitizensMetric;

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
