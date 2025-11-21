import React, { forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Checkbox } from 'react-native-paper';
import { COLOR } from '../../themes/Colors'; // your color constants
import { FONT } from '../../themes/AppConst';

const AssignResponderSheet = forwardRef((props, ref) => {
  const [ambulance, setAmbulance] = useState(false);
  const [police, setPolice] = useState(false);

  const onSave = () => {
    const selected = [];
    if (ambulance) selected.push('Ambulance');
    if (police) selected.push('Police');
    console.log('Selected responders:', selected);
    (ref as any)?.current?.close();
  };

  return (
    <RBSheet
      ref={ref}
      height={380}
      closeOnDragDown={true}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        draggableIcon: { backgroundColor: '#ccc' },
        container: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      }}
    >
      <View style={styles.container}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>
          Assign responders to the incident report
        </Text>

        <Text style={styles.label}>
          Responders <Text style={{ color: COLOR.red }}>*</Text>
        </Text>

        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              status={ambulance ? 'checked' : 'unchecked'}
              onPress={() => setAmbulance(!ambulance)}
              color={COLOR.blue}
            />
            <Text style={styles.checkboxLabel}>Ambulance</Text>
          </View>

          <View style={styles.checkboxRow}>
            <Checkbox
              status={police ? 'checked' : 'unchecked'}
              onPress={() => setPolice(!police)}
              color={COLOR.blue}
            />
            <Text style={styles.checkboxLabel}>Police</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.blue,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONT.R_MED_500,
    color: COLOR.textGrey,
    marginBottom: 8,
  },
  checkboxContainer: {
    backgroundColor: COLOR.gray,
    borderRadius: 8,
    padding: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLOR.black,
  },
  saveBtn: {
    marginTop: 25,
    backgroundColor: COLOR.blue,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AssignResponderSheet;
