import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import { COLOR } from '../../themes/Colors';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';

interface FormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  district: string;
  city: string;
  tehsil: string;
  block: string;
  dateOfBirth: Date | null;
  primaryContactName: string;
  primaryContactNumber: string;
  relation: string;
  alternateMobileNumber: string;
  secondaryContactName: string;
  documents: Array<{ uri: string; name: string }>;
}

interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  city?: string;
  block?: string;
  primaryContactName?: string;
  primaryContactNumber?: string;
  relation?: string;
  documents?: string;
}

const Profile: React.FC = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  const [activeTab, setActiveTab] = useState<'basic' | 'emergency'>('basic');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBlockDropdown, setShowBlockDropdown] = useState(false);
  const [showRelationDropdown, setShowRelationDropdown] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: 'Ramesh Kakde',
    mobileNumber: '8626054838',
    email: '',
    district: 'Nagpur',
    city: '',
    tehsil: 'Ramtek',
    block: '',
    dateOfBirth: null,
    primaryContactName: 'Rahul Kumar',
    primaryContactNumber: '9876545633',
    relation: '',
    alternateMobileNumber: '7865778787',
    secondaryContactName: '',
    documents: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const blocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'];
  const relations = [
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Spouse',
    'Friend',
    'Other',
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (activeTab === 'basic') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!validateMobile(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Invalid mobile number';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }

      if (!formData.block) {
        newErrors.block = 'Block is required';
      }
    }

    if (activeTab === 'emergency') {
      if (formData.documents.length === 0) {
        newErrors.documents = 'At least one document is required';
      }

      if (!formData.primaryContactName.trim()) {
        newErrors.primaryContactName = 'Primary contact name is required';
      }

      if (!formData.relation) {
        newErrors.relation = 'Relation is required';
      }

      if (!formData.primaryContactNumber.trim()) {
        newErrors.primaryContactNumber = 'Primary contact number is required';
      } else if (!validateMobile(formData.primaryContactNumber)) {
        newErrors.primaryContactNumber = 'Invalid mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => console.log('Form Data:', formData),
        },
      ]);
    } else {
      Alert.alert(
        'Validation Error',
        'Please fill all required fields correctly.',
      );
    }
  };

  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 0,
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
          const newDocuments = response.assets.map(asset => ({
            uri: asset.uri || '',
            name: asset.fileName || 'document.jpg',
          }));
          setFormData({
            ...formData,
            documents: [...formData.documents, ...newDocuments],
          });
          if (errors.documents) {
            setErrors({ ...errors, documents: undefined });
          }
        }
      },
    );
  };

  const removeDocument = (index: number) => {
    const newDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({ ...formData, documents: newDocuments });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select date of birth';
    return date.toLocaleDateString('en-IN');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D5FB3" />

      {/* Header */}
      <DashBoardHeader />

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={require('../../assets/backArrow.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.backButton} />
      </View>

      {/* Tabs with Arrow Design */}
      <View style={styles.tabContainer}>
        {/* Basic Information Tab */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'basic' && styles.activeZ]}
          onPress={() => setActiveTab('basic')}
          activeOpacity={0.8}
        >
          <Image
            source={
              activeTab === 'basic'
                ? require('../../assets/a2.png') // active
                : require('../../assets/a1.png') // inactive
            }
            style={{ width: 150, height: 40 }}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'basic' && styles.activeTabText,
              ]}
            >
              Basic Information
            </Text>
          </View>
        </TouchableOpacity>

        {/* Emergency Contact Information Tab */}
        <TouchableOpacity
          style={[
            styles.tab,
            styles.secondTab,
            activeTab === 'emergency' && styles.activeZ,
          ]}
          onPress={() => setActiveTab('emergency')}
          activeOpacity={0.8}
        >
          <Image
            source={
              activeTab === 'emergency'
                ? require('../../assets/b2.png') // active
                : require('../../assets/b1.png') // inactive
            }
            style={{ width: 230, height: 40 }}
            resizeMode="contain"
          />
          <View style={styles.textWrapper}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'emergency' && styles.activeTabText,
              ]}
            >
              Emergency Contact Information
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'basic' ? (
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.fullName}
                editable={false}
              />
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.mobileNumber}
                editable={false}
                keyboardType="phone-pad"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Email Id <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.editableInput]}
                placeholder="Enter email id"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={text => {
                  setFormData({ ...formData, email: text });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* District */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>District</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.district}
                editable={false}
              />
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                City <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.editableInput]}
                placeholder="Enter city"
                placeholderTextColor="#999"
                value={formData.city}
                onChangeText={text => {
                  setFormData({ ...formData, city: text });
                  if (errors.city) setErrors({ ...errors, city: undefined });
                }}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
            </View>

            {/* Tehsil */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tehsil</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.tehsil}
                editable={false}
              />
            </View>

            {/* Block */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Block <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.editableInput, styles.dropdown]}
                onPress={() => setShowBlockDropdown(!showBlockDropdown)}
              >
                <Text
                  style={
                    formData.block
                      ? styles.dropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {formData.block || 'Select block'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.block && (
                <Text style={styles.errorText}>{errors.block}</Text>
              )}

              {showBlockDropdown && (
                <View style={styles.dropdownMenu}>
                  {blocks.map(block => (
                    <TouchableOpacity
                      key={block}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, block });
                        setShowBlockDropdown(false);
                        if (errors.block)
                          setErrors({ ...errors, block: undefined });
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{block}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={[styles.input, styles.editableInput, styles.dropdown]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={
                    formData.dateOfBirth
                      ? styles.dropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {formatDate(formData.dateOfBirth)}
                </Text>
                <Text style={styles.dropdownIcon}>📅</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dateOfBirth || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            {/* Upload Document */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Upload Document <Text style={styles.required}>*</Text>
              </Text>

              <View style={styles.documentsContainer}>
                {formData.documents.map((doc, index) => (
                  <View key={index} style={styles.documentCard}>
                    <Image
                      source={{ uri: doc.uri }}
                      style={styles.documentImage}
                    />
                    <TouchableOpacity
                      style={styles.removeDocButton}
                      onPress={() => removeDocument(index)}
                    >
                      <Text style={styles.removeDocIcon}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {formData.documents.length < 5 && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleImageUpload}
                  >
                    <Text style={styles.uploadIcon}>📄</Text>
                    <Text style={styles.uploadText}>Add Document</Text>
                  </TouchableOpacity>
                )}
              </View>

              {errors.documents && (
                <Text style={styles.errorText}>{errors.documents}</Text>
              )}
            </View>

            <Text style={styles.sectionTitle}>
              Emergency Contact Information
            </Text>

            {/* Primary Contact Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Primary Contact Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.editableInput]}
                placeholder="Enter contact name"
                placeholderTextColor="#999"
                value={formData.primaryContactName}
                onChangeText={text => {
                  setFormData({ ...formData, primaryContactName: text });
                  if (errors.primaryContactName) {
                    setErrors({ ...errors, primaryContactName: undefined });
                  }
                }}
              />
              {errors.primaryContactName && (
                <Text style={styles.errorText}>
                  {errors.primaryContactName}
                </Text>
              )}
            </View>

            {/* Relation */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Relation <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.editableInput, styles.dropdown]}
                onPress={() => setShowRelationDropdown(!showRelationDropdown)}
              >
                <Text
                  style={
                    formData.relation
                      ? styles.dropdownText
                      : styles.dropdownPlaceholder
                  }
                >
                  {formData.relation || 'Select relation'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.relation && (
                <Text style={styles.errorText}>{errors.relation}</Text>
              )}

              {showRelationDropdown && (
                <View style={styles.dropdownMenu}>
                  {relations.map(relation => (
                    <TouchableOpacity
                      key={relation}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, relation });
                        setShowRelationDropdown(false);
                        if (errors.relation)
                          setErrors({ ...errors, relation: undefined });
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{relation}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Primary Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Primary Mobile Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.editableInput]}
                placeholder="Enter mobile number"
                placeholderTextColor="#999"
                value={formData.primaryContactNumber}
                onChangeText={text => {
                  setFormData({ ...formData, primaryContactNumber: text });
                  if (errors.primaryContactNumber) {
                    setErrors({ ...errors, primaryContactNumber: undefined });
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.primaryContactNumber && (
                <Text style={styles.errorText}>
                  {errors.primaryContactNumber}
                </Text>
              )}
            </View>

            {/* Alternate Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alternate Mobile Number</Text>
              <TextInput
                style={[styles.input, styles.editableInput]}
                placeholder="Enter alternate number"
                placeholderTextColor="#999"
                value={formData.alternateMobileNumber}
                onChangeText={text =>
                  setFormData({ ...formData, alternateMobileNumber: text })
                }
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Secondary Contact Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secondary Contact Name</Text>
              <TextInput
                style={[styles.input, styles.editableInput]}
                placeholder="Enter secondary contact name"
                placeholderTextColor="#999"
                value={formData.secondaryContactName}
                onChangeText={text =>
                  setFormData({ ...formData, secondaryContactName: text })
                }
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  header: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 24,
    paddingBottom: 10,
  },
  tab: {
    height: 40,
    position: 'relative',
  },
  secondTab: {
    marginLeft: -20,
  },
  textWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#4F4F4F',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  activeZ: {
    zIndex: 2,
  },

  content: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  required: {
    color: '#FF0000',
  },
  input: {
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333333',
  },
  disabledInput: {
    backgroundColor: '#D8D8D8',
    color: '#666666',
  },
  editableInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333333',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#999999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666666',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333333',
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  documentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  documentCard: {
    width: 100,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0D5FB3',
    position: 'relative',
    overflow: 'hidden',
  },
  documentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeDocButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0D5FB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeDocIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  uploadButton: {
    width: 100,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D5FB3',
    marginBottom: 16,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#0D5FB3',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
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
  spacer: {
    height: 80,
  },
});
