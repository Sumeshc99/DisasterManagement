import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';

interface Props {
  data: any;
  handleSubmit: any;
}

const CompleteProfileSheet = forwardRef<RBSheet, Props>(
  ({ data, handleSubmit }, ref) => {
    const [fullName, setFullName] = useState('');
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyMobile, setEmergencyMobile] = useState('');

    const validateAndSubmit = () => {
      if (!fullName.trim()) {
        Alert.alert('Validation Error', 'Please enter your full name.');
        return;
      }
      if (!emergencyName.trim()) {
        Alert.alert('Validation Error', 'Please enter emergency contact name.');
        return;
      }
      if (!emergencyMobile.trim()) {
        Alert.alert(
          'Validation Error',
          'Please enter emergency mobile number.',
        );
        return;
      }
      if (!/^\d{10}$/.test(emergencyMobile)) {
        Alert.alert(
          'Validation Error',
          'Please enter a valid 10-digit mobile number.',
        );
        return;
      }

      const formData = {
        fullName,
        emergencyName,
        emergencyMobile,
      };

      handleSubmit(formData);
      (ref as any)?.current?.close();
    };

    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={480}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Please complete your profile</Text>
            <TouchableOpacity onPress={() => (ref as any)?.current?.close()}>
              <Image
                source={require('../assets/cancel.png')}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter full name"
            placeholderTextColor="#999"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter full name"
            placeholderTextColor="#999"
            style={styles.input}
            value={emergencyName}
            onChangeText={setEmergencyName}
          />

          <Text style={styles.label}>
            Mobile Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter mobile number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            style={styles.input}
            value={emergencyMobile}
            onChangeText={setEmergencyMobile}
            maxLength={10}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={validateAndSubmit}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.blue,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: COLOR.blue,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 10,
    width: WIDTH(40),
    alignSelf: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CompleteProfileSheet;
