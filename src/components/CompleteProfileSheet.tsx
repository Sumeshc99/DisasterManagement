import React, { forwardRef, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';

const { width } = Dimensions.get('window');

const CompleteProfileSheet = forwardRef((props, ref) => {
  return (
    <RBSheet
      ref={ref}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={480}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Please complete your profile</Text>
          <TouchableOpacity onPress={() => ref?.current?.close()}>
            <Image
              source={require('../assets/cancel.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Main Full Name */}
        <Text style={styles.label}>
          Full Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* Emergency Contact Section */}
        <Text style={styles.sectionTitle}>Emergency Contact Details</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter full name"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          placeholder="Enter mobile number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
});

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
