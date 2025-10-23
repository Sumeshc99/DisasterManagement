import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';

interface MediaAsset {
  uri?: string;
  type?: string;
  fileName?: string;
}

const CreateIncidentScreen: React.FC = () => {
  const [incidentType, setIncidentType] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Fire', value: 'fire' },
    { label: 'Accident', value: 'accident' },
    { label: 'Medical Emergency', value: 'medical' },
    { label: 'Other', value: 'other' },
  ]);

  const [address, setAddress] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [media, setMedia] = useState<MediaAsset | null>(null);

  const handleMediaPick = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to pick media.',
          );
          return;
        }
        const asset = response.assets?.[0];
        if (asset) setMedia(asset);
      },
    );
  };

  const handleCreate = () => {
    if (!address || !mobileNumber) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
    const payload = { incidentType, address, mobileNumber, description, media };
    console.log('Incident Submitted:', payload);
    Alert.alert('Success', 'Incident created successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader />
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR.white,
          paddingHorizontal: WIDTH(4),
        }}
      >
        <Text style={styles.header}>Create Incident</Text>

        {/* Incident Type */}
        <Text style={styles.label}>Incident Type</Text>
        <DropDownPicker
          open={open}
          value={incidentType}
          items={items}
          setOpen={setOpen}
          setValue={setIncidentType}
          setItems={setItems}
          placeholder="Select Incident Type"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {/* Address */}
        <Text style={styles.label}>
          Address <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />

        {/* Mobile Number */}
        <Text style={styles.label}>
          Mobile Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter description"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Attach photo/video */}
        <Text style={styles.label}>Attach photo/video</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={handleMediaPick}>
          {media?.uri ? (
            <Image source={{ uri: media.uri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.placeholderText}>
              Capture or upload incident images and videos
            </Text>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a4fa3',
    alignSelf: 'center',
    marginVertical: 20,
  },
  label: {
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#1a4fa3',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateIncidentScreen;
