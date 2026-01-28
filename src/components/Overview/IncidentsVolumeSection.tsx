import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TimeFilter from '../UI/TimeFilter';
import KpiGrid from '../UI/KpiGrid';
import { FONT } from '../../themes/AppConst';
import { COLOR } from '../../themes/Colors';
import DropDownPicker from 'react-native-dropdown-picker';

const IncidentsVolumeSection = ({ role }) => {
  const [viewType, setViewType] = useState('myself');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Myself', value: 'myself' },
    { label: 'Assigned', value: 'assigned' },
  ]);

  const dataMyself = [
    { value: '100', label: 'Total Incidents Reported by Me' },
    { value: '50', label: 'Pending Action from Reviewer' },
    { value: '5', label: 'Marked as Duplicate' },
    { value: '5', label: 'Marked as Cancelled' },
    { value: '30', label: 'Open or Active' },
    { value: '10', label: 'Closed by Responder' },
  ];

  const dataAssigned = [
    { value: '40', label: 'Total Incidents Assigned to Me' },
    { value: '15', label: 'Pending Action from Me' },
    { value: '3', label: 'Marked as Duplicate' },
    { value: '2', label: 'Marked as Cancelled' },
    { value: '18', label: 'Open or Active' },
    { value: '8', label: 'Closed by Me' },
  ];

  const kpiData = viewType === 'assigned' ? dataAssigned : dataMyself;
  const showAssignedFilter = role !== 'citizen';

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.sectionTitle}>Incidents Volume</Text>

        {showAssignedFilter && (
          <View style={styles.dropdownCard}>
            <DropDownPicker
              open={open}
              value={viewType}
              items={items}
              setOpen={setOpen}
              setItems={setItems}
              onChangeValue={value => setViewType(value)}
              containerStyle={{ width: 120 }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              listMode="SCROLLVIEW"
            />
          </View>
        )}
      </View>

      <View style={styles.filterRow}>
        {/* Left: TimeFilter */}
        <View style={styles.timeFilterWrapper}>
          <TimeFilter />
        </View>
      </View>

      <KpiGrid data={kpiData} />
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
    color: COLOR.lightTextGrey2,
  },
  dropdownCard: {
    backgroundColor: COLOR.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    // ✅ EXACT KPI SHADOW
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1.5,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // left/right
    alignItems: 'center', // vertical center
  },
  timeFilterWrapper: {
    flex: 1,
  },
  dropdownWrapper: {},
  dropdown: {
    height: 32,
    minHeight: 32,

    backgroundColor: COLOR.white,
    borderWidth: 0, // 👈 shadow already on wrapper
    borderRadius: 4,
  },

  dropdownContainer: {
    borderWidth: 0,
    borderRadius: 4,
    backgroundColor: COLOR.white,
  },

  dropdownText: {
    fontSize: 13,
    color: COLOR.textGrey,
    lineHeight: 16, // 👈 keeps text vertically centered
  },
  arrowIconStyle: {
    tintColor: COLOR.lightTextGrey,
  },
});
