import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import DropDownInput from '../../../components/inputs/DropDownInput';
import FormTextInput from '../../../components/inputs/FormTextInput';
import FormMediaPicker from '../../../components/inputs/FormMediaPicker';
import { COLOR } from '../../../themes/Colors';
import { WIDTH } from '../../../themes/AppConst';
import { TEXT } from '../../../i18n/locales/Text';
import { RootState } from '../../../store/RootReducer';
import ApiManager from '../../../apis/ApiManager';
import { useGlobalLoader } from '../../../hooks/GlobalLoaderContext';
import IncidentAdress from '../../../components/bottomSheets/IncidentAddressSheet';

interface MediaAsset {
  uri?: string;
  type?: string;
  fileName?: string;
}

interface IncidentForm {
  incidentType: string;
  customIncidentType?: string;
  address: string;
  mobileNumber: string;
  description: string;
  media: MediaAsset[];
}

const CreateIncidentScreen: React.FC = () => {
  const { showLoader, hideLoader } = useGlobalLoader();
  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const [tahsilList, setTahsilList] = useState([]);

  const addressRef = useRef<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IncidentForm>({
    defaultValues: {
      incidentType: '',
      customIncidentType: '',
      address: '',
      mobileNumber: '',
      description: '',
      media: [],
    },
  });

  const media = watch('media');
  const selectedType = watch('incidentType');

  const incidentTypes = [
    { label: 'Fire', value: 'fire' },
    { label: 'Accident', value: 'accident' },
    { label: 'Medical Emergency', value: 'medical' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    const getTahsil = async () => {
      try {
        // showLoader();
        const resp = await ApiManager.tahsilList();
        if (resp?.data?.success) {
          setTahsilList(
            (resp?.data?.data?.tehsils || []).map((item: any) => ({
              label: item.Tehsil,
              value: item.id,
            })),
          );
        }
      } catch (err: any) {
        console.log('Tahsil Error:', err.response || err);
      } finally {
        hideLoader();
      }
    };

    getTahsil();
  }, []);

  const handleMediaPick = () => {
    launchImageLibrary(
      { mediaType: 'mixed', quality: 0.7, selectionLimit: 0 },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to pick media.',
          );
          return;
        }

        const newAssets =
          response.assets?.map(a => ({
            uri: a.uri,
            type: a.type,
            fileName: a.fileName,
          })) || [];

        const updated = [...(media || []), ...newAssets];
        setValue('media', updated);
      },
    );
  };

  const handleRemoveMedia = (index: number) => {
    const updated = media.filter((_, i) => i !== index);
    setValue('media', updated);
  };

  const onSubmit = async (data: IncidentForm) => {
    try {
      showLoader();

      const finalType =
        data.incidentType === 'other'
          ? data.customIncidentType
          : data.incidentType;

      const formData = new FormData();
      formData.append('user_id', user?.id || '');
      formData.append('tehsil', user?.tehsil || '');
      formData.append('incident_type_id', finalType);
      formData.append('address', data.address);
      formData.append('mobile_number', data.mobileNumber);
      formData.append('description', data.description);
      formData.append('latitude', user?.latitude || '');
      formData.append('longitude', user?.longitude || '');
      formData.append('state_id', user?.state_id || '');
      formData.append('city_id', user?.city_id || '');
      formData.append('district_id', user?.district_id || '');
      formData.append('city_code', user?.city_code || '');

      if (Array.isArray(data.media)) {
        data.media.forEach((file, index) => {
          formData.append('upload_media[]', {
            uri: file.uri,
            type: file.type || 'image/jpeg',
            name: file.fileName || `media_${index}.jpg`,
          });
        });
      }

      const response = await ApiManager.createIncident(formData, userToken);

      if (response?.data?.success) {
        Alert.alert('Success', 'Incident created successfully!');
        reset();
      } else {
        Alert.alert(
          'Error',
          response?.data?.message || 'Failed to create incident.',
        );
      }
    } catch (error: any) {
      console.log('Create Incident Error:', error.response || error);
      Alert.alert('Error', 'Something went wrong while creating the incident.');
    } finally {
      hideLoader();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader />
      <ScrollView
        style={styles.innerContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Create Incident</Text>

        {/* Incident Type */}
        <DropDownInput
          label="Incident Type"
          name="incidentType"
          control={control}
          placeholder="Select Incident Type"
          items={incidentTypes}
          rules={{ required: 'Incident type is required' }}
          errors={errors}
        />

        {/* If "Other" is selected, show free text field */}
        {selectedType === 'other' && (
          <FormTextInput
            label="Specify Other Type"
            name="customIncidentType"
            control={control}
            placeholder="Enter incident type"
            rules={{ required: 'Please specify the incident type' }}
            error={errors.customIncidentType?.message}
          />
        )}

        {/* Address */}
        {/* <FormTextInput
            label="Address"
            name="address"
            control={control}
            multiline
            placeholder="Please enter address"
            rules={{ required: 'Address is required' }}
            error={errors.address?.message}
          /> */}

        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
            Address <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 4,
              borderColor: COLOR.gray,
              padding: 14,
            }}
            onPress={() => addressRef.current.open()}
          >
            <Text style={{ fontSize: 16, color: '#999', marginBottom: 40 }}>
              Address
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mobile Number */}
        <FormTextInput
          label={TEXT.mobile_number()}
          name="mobileNumber"
          control={control}
          placeholder={TEXT.enter_phone_number()}
          keyboardType="phone-pad"
          rules={{
            required: TEXT.phone_number_is_required(),
            pattern: {
              value: /^[0-9]{10}$/,
              message: TEXT.enter_valid_10_digit_number(),
            },
          }}
          error={errors.mobileNumber?.message}
        />

        {/* Description */}
        <FormTextInput
          label="Description"
          name="description"
          control={control}
          multiline
          placeholder="Please enter description"
          rules={{ required: 'Description is required' }}
          error={errors.description?.message}
        />

        {/* Media Picker */}
        <FormMediaPicker
          label="Attach photo/video"
          name="media"
          control={control}
          rules={{ required: 'At least one media file is required' }}
          error={errors.media?.message}
          media={media}
          onPickMedia={handleMediaPick}
          onRemoveMedia={handleRemoveMedia}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.createButton}
          // onPress={handleSubmit(onSubmit)}
          onPress={() => ''}
        >
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>

      <IncidentAdress ref={addressRef} />
    </SafeAreaView>
  );
};

export default CreateIncidentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: WIDTH(4),
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.blue,
    alignSelf: 'center',
    marginVertical: 20,
  },
  createButton: {
    backgroundColor: COLOR.blue,
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
