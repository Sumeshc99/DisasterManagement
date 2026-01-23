import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT } from '../../themes/AppConst';
import TimeFilter from '../UI/TimeFilter';
import KpiGrid from '../UI/KpiGrid';
const IncidentsVolumeSection = ({ role }) => {
  const [mode, setMode] = useState('Myself');

  const dataMyself = [
    { value: '100', label: 'Total Incidents Reported by Me' },
    { value: '50', label: 'Pending Action from Reviewer' },
    { value: '5', label: 'Marked as Duplicate' },
    { value: '5', label: 'Marked as Cancelled' },
    { value: '30', label: 'Open or Active' },
    { value: '10', label: 'Closed by Responder' },
  ];

  const showAssignedFilter = role !== 'citizen';

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Incidents Volume</Text>

      <TimeFilter />
      <KpiGrid data={dataMyself} />

      {/* {showAssignedFilter && (
        // Dropdown for Myself / Assigned
      )} */}
      {/* Time filter will come here */}
      {/* KPI Grid will come here */}
    </View>
  );
};

export default IncidentsVolumeSection;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT.R_SBD_600,
    marginBottom: 12,
  },
});
