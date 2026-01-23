import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';

const KpiCard = ({ value, label }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default KpiCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLOR.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',

    // 👇 Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    // 👇 Shadow (Android)
    elevation: 1.5,
  },
  value: {
    fontSize: 20,
    fontFamily: FONT.R_BOLD_700,
    color: COLOR.blue,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: FONT.R_REG_400,
    color: '#6B7280',
    textAlign: 'center',
  },
});
