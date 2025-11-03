import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import { COLOR } from '../../../themes/Colors';
import { useNavigation } from '@react-navigation/native';
import AssignResponderSheet from '../../../components/bottomSheets/AssignResponderSheet';

interface FormData {
  incidentId: string;
  incidentType: string;
  address: string;
  mobileNumber: string;
  description: string;
  images: Array<{ uri: string; name: string }>;
  status: string;
  dateTime: string;
}

interface FormErrors {
  incidentId?: string;
  incidentType?: string;
  address?: string;
  mobileNumber?: string;
  description?: string;
  images?: string;
}

const IncidentDetails: React.FC = () => {
  const navigation = useNavigation();

  const sheetRef = useRef<any>(null);

  const [formData, setFormData] = useState<FormData>({
    incidentId: 'NAG-060825-CT-970',
    incidentType: 'Fire',
    address: 'Civil Lines, Amavati Road, Nagpur, MH, 440001',
    mobileNumber: '8626054838',
    description: 'Please help, there is a fire at my home',
    images: [],
    status: 'New',
    dateTime: '08/04/2025, 05:10 PM',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.incidentId.trim()) {
      newErrors.incidentId = 'Incident ID is required';
    }

    if (!formData.incidentType.trim()) {
      newErrors.incidentType = 'Incident Type is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(formData.mobileNumber)) {
      newErrors.mobileNumber =
        'Invalid mobile number (10 digits, starting with 6-9)';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 5,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }
        if (response.assets) {
          const newImages = response.assets.map(asset => ({
            uri: asset.uri || '',
            name: asset.fileName || 'incident.jpg',
          }));
          setFormData({
            ...formData,
            images: [...formData.images, ...newImages],
          });
          if (errors.images) {
            setErrors({ ...errors, images: undefined });
          }
        }
      },
    );
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Incident details submitted successfully!');
      console.log('Form Data:', formData);
    }
    sheetRef?.current?.open();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader />

      {/* Title Bar */}
      <View style={{ backgroundColor: COLOR.white }}>
        <View style={styles.titleBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image source={require('../../../assets/backArrow.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>Incident details</Text>
          <View style={styles.backButton} />
        </View>
      </View>

      {/* <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Incident Details</Text>
        <View style={styles.backButton} />
      </View> */}

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Incident ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incident Id</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.incidentId}
              editable={false}
            />
            {errors.incidentId && (
              <Text style={styles.errorText}>{errors.incidentId}</Text>
            )}
          </View>

          {/* Incident Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Incident Type</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.incidentType}
              editable={false}
            />
            {errors.incidentType && (
              <Text style={styles.errorText}>{errors.incidentType}</Text>
            )}
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.address}
              onChangeText={text => {
                setFormData({ ...formData, address: text });
                if (errors.address)
                  setErrors({ ...errors, address: undefined });
              }}
              multiline
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.mobileNumber}
              onChangeText={text => {
                setFormData({ ...formData, mobileNumber: text });
                if (errors.mobileNumber)
                  setErrors({ ...errors, mobileNumber: undefined });
              }}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.mobileNumber && (
              <Text style={styles.errorText}>{errors.mobileNumber}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.editableInput, styles.textArea]}
              value={formData.description}
              onChangeText={text => {
                setFormData({ ...formData, description: text });
                if (errors.description)
                  setErrors({ ...errors, description: undefined });
              }}
              multiline
              numberOfLines={4}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Image Upload and Status Section */}
          <View style={styles.rowSection}>
            {/* Description Images */}
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Description</Text>
              <View style={styles.imageContainer}>
                {formData.images.length > 0 ? (
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{ uri: formData.images[0].uri }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(0)}
                    >
                      <Text style={styles.removeImageIcon}>✕</Text>
                    </TouchableOpacity>
                    {formData.images.length > 1 && (
                      <View style={styles.imageCount}>
                        <Text style={styles.imageCountText}>
                          Image + {formData.images.length - 1}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadPlaceholder}
                    onPress={handleImageUpload}
                  >
                    <Text style={styles.uploadIcon}>📷</Text>
                    <Text style={styles.uploadText}>Upload Image</Text>
                  </TouchableOpacity>
                )}
              </View>
              {errors.images && (
                <Text style={styles.errorText}>{errors.images}</Text>
              )}
            </View>

            {/* Status */}
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusBox}>
                <Text style={styles.statusText}>{formData.status}</Text>
              </View>

              <Text style={styles.label}>Date & Time of Reporting</Text>
              <View style={styles.statusBox}>
                <Text style={styles.dateTimeText}>{formData.dateTime}</Text>
              </View>
            </View>
          </View>

          {/* Reviewer Section */}
          <View style={styles.reviewerSection}>
            <Text style={styles.label}>Reviewer</Text>
            <View style={styles.reviewerTabs}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={styles.tabText}>Sr. No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Full Name</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Contact Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AssignResponderSheet ref={sheetRef} />
    </SafeAreaView>
  );
};

export default IncidentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#0D5FB3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#0D5FB3',
    fontSize: 14,
    fontWeight: '700',
  },
  titleBar: {
    backgroundColor: COLOR.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#0D5FB3',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D5FB3',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  form: {
    padding: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333333',
  },
  disabledInput: {
    backgroundColor: '#E8E8E8',
    color: '#666666',
  },
  editableInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  rowSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 135,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D5FB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  imageCount: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  uploadText: {
    fontSize: 12,
    color: '#666666',
  },
  statusBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 15,
    color: '#333333',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#333333',
  },
  reviewerSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  reviewerTabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
  },
  activeTab: {
    backgroundColor: '#F0F0F0',
  },
  tabText: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#0D5FB3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#0D5FB3',
    fontWeight: '600',
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    borderWidth: 6,
    borderColor: '#FFFFFF',
  },
  sosIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sosText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -4,
  },
});
