import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { RadioButton, TextInput } from 'react-native-paper';
import { COLOR } from '../../themes/Colors'; // your color constants

const RejectReasonSheet = forwardRef((props, ref) => {
  const [selectedReason, setSelectedReason] = useState('cancel');
  const [details, setDetails] = useState('');

  const onSave = () => {
    console.log('Selected Reason:', selectedReason);
    console.log('Cancellation Note:', details);
    ref.current?.close();
  };

  return (
    <RBSheet
      ref={ref}
      height={420}
      closeOnDragDown={true}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        draggableIcon: { backgroundColor: '#ccc' },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <View style={styles.container}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Select reason for rejection</Text>

        {/* Radio Button Options */}
        <View style={styles.radioRow}>
          <TouchableOpacity
            style={[
              styles.radioBtn,
              selectedReason === 'duplicate' && styles.radioBtnActiveBlue,
            ]}
            onPress={() => setSelectedReason('duplicate')}
          >
            <RadioButton
              value="duplicate"
              status={selectedReason === 'duplicate' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedReason('duplicate')}
              color={COLOR.white}
              uncheckedColor={COLOR.white}
            />
            <Text
              style={[
                styles.radioText,
                selectedReason === 'duplicate' && { color: COLOR.white },
              ]}
            >
              Duplicate
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.radioBtn,
              selectedReason === 'cancel' && styles.radioBtnActiveBlue,
            ]}
            onPress={() => setSelectedReason('cancel')}
          >
            <RadioButton
              value="cancel"
              status={selectedReason === 'cancel' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedReason('cancel')}
              color={COLOR.white}
              uncheckedColor={COLOR.white}
            />
            <Text
              style={[
                styles.radioText,
                selectedReason === 'cancel' && { color: COLOR.white },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reason Input */}
        <Text style={styles.label}>
          Reason for cancellation <Text style={{ color: COLOR.red }}>*</Text>
        </Text>

        <TextInput
          mode="outlined"
          placeholder="Provide reason for cancellation"
          value={details}
          onChangeText={setDetails}
          outlineColor="#D9D9D9"
          activeOutlineColor={COLOR.blue}
          multiline
          numberOfLines={3}
          style={styles.textInput}
        />

        {/* Save Button */}
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
    paddingVertical: 10,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLOR.blue,
    textAlign: 'center',
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  radioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.gray,
    borderRadius: 8,
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  radioBtnActiveGray: {
    backgroundColor: '#E0E0E0',
  },
  radioBtnActiveBlue: {
    backgroundColor: COLOR.blue,
  },
  radioText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.black,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR.blue,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLOR.white,
    marginBottom: 20,
  },
  saveBtn: {
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

export default RejectReasonSheet;
