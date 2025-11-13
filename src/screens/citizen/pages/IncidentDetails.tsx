import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

import DashBoardHeader from '../../../components/header/DashBoardHeader';
import FormTextInput from '../../../components/inputs/FormTextInput';
import FormMediaPicker from '../../../components/inputs/FormMediaPicker';
import { COLOR } from '../../../themes/Colors';
import { WIDTH } from '../../../themes/AppConst';
import ConfirmationSheet from '../../../components/bottomSheets/ConfirmationSheetProps';
import ApiManager from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/RootReducer';
import { useGlobalLoader } from '../../../hooks/GlobalLoaderContext';

interface IncidentDetailsForm {
  incidentId: string;
  incidentType: string;
  address: string;
  mobileNumber: string;
  description: string;
  media: { uri?: string; name?: string; type?: string }[];
  status: string;
  dateTime: string;
}

const IncidentDetails: React.FC = () => {
  const navigation = useNavigation();
  const sheetRef = useRef<any>(null);

  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const { showLoader, hideLoader } = useGlobalLoader();

  const [incidentData, setincidentData] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IncidentDetailsForm>({
    defaultValues: {
      incidentId: 'NAG-060825-CT-970',
      incidentType: 'Fire',
      address: 'Civil Lines, Amavati Road, Nagpur, MH, 440001',
      mobileNumber: '8626054838',
      description: 'Please help, there is a fire at my home',
      media: [],
      status: 'New',
      dateTime: '08/04/2025, 05:10 PM',
    },
  });

  const media = watch('media');

  // 📸 Handle Media Upload
  const handleImageUpload = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 5 },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick image');
          return;
        }

        const newImages =
          response.assets?.map(asset => ({
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          })) || [];

        setValue('media', [...media, ...newImages]);
      },
    );
  };

  const handleRemoveMedia = (index: number) => {
    const updated = media.filter((_, i) => i !== index);
    setValue('media', updated);
  };

  useEffect(() => {
    const getIncedentDetails = () => {
      showLoader();
      ApiManager.incidentDetails(24, userToken)
        .then(resp => {
          if (resp?.data?.status) {
            const data = resp?.data?.data;
            console.log('data', data);
            setincidentData(data);
            reset({
              incidentId: data?.incident_id,
              incidentType: data?.incident_type,
              address: data?.address,
              mobileNumber: data?.mobile_number,
              description: data?.description,
              media: data?.upload_media,
              status: data?.status,
              dateTime: data?.date_time_reporting,
            });
          } else {
          }
        })
        .catch(err => console.log('err', err.response))
        .finally(() => hideLoader());
    };

    getIncedentDetails();
  }, []);

  const onSubmit = (data: IncidentDetailsForm) => {
    Alert.alert('Success', 'Incident details submitted successfully!');
    console.log('Form Data:', data);

    submitIncident();
    sheetRef.current?.open();
  };

  const submitIncident = () => {
    const body = {
      incident_id: '24',
      button_type: 'Yes',
      cancel_reason: '',
    };
    ApiManager.incidentDetails(body, userToken).then(resp => {
      console.log('12121', resp.data);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader drawer={false} setDrawer={() => ''} />

      <View style={styles.titleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={require('../../../assets/backArrow.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Incident Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.label}>Incident ID</Text>
          <View style={styles.disabledBox}>
            <Text style={styles.disabledText}>{watch('incidentId')}</Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={styles.label}>Incident Type</Text>
            <View style={styles.disabledBox}>
              <Text style={styles.disabledText}>{watch('incidentType')}</Text>
            </View>
          </View>

          <FormTextInput
            label="Address"
            name="address"
            control={control}
            placeholder="Enter address"
            multiline
            rules={{ required: 'Address is required' }}
            error={errors.address?.message}
          />

          <FormTextInput
            label="Mobile Number"
            name="mobileNumber"
            control={control}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Invalid mobile number (10 digits, starts with 6-9)',
              },
            }}
            error={errors.mobileNumber?.message}
          />

          <FormTextInput
            label="Description"
            name="description"
            control={control}
            placeholder="Enter description"
            multiline
            rules={{ required: 'Description is required' }}
            error={errors.description?.message}
          />

          <View style={{ flexDirection: 'row', gap: 14 }}>
            <View style={{ width: WIDTH(30) }}>
              <FormMediaPicker
                label="Images"
                name="media"
                control={control}
                rules={{ required: 'At least one image is required' }}
                error={errors.media?.message}
                media={media}
                onChangeMedia={handleImageUpload}
                onRemoveMedia={handleRemoveMedia}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.disabledBox}>
                <Text style={styles.disabledText}>{watch('status')}</Text>
              </View>

              <Text style={[styles.label, { marginTop: 6 }]}>
                Date & Time of Reporting
              </Text>
              <View style={styles.disabledBox}>
                <Text style={styles.disabledText}>{watch('dateTime')}</Text>
              </View>
            </View>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}
          >
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={styles.submitButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* <AssignResponderSheet ref={sheetRef} /> */}

      <ConfirmationSheet
        ref={sheetRef}
        icon={require('../../../assets/a1.png')}
        iconColor="#FF9800"
        message="Are you sure you want to delete this report?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => console.log('Confirmed')}
        onCancel={() => console.log('Cancelled')}
      />
    </SafeAreaView>
  );
};

export default IncidentDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.blue },
  titleBar: {
    backgroundColor: COLOR.white,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.blue,
  },
  content: { flex: 1, backgroundColor: COLOR.white },
  form: { paddingHorizontal: 16, paddingBottom: 16 },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 4,
  },
  disabledBox: {
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    padding: 12,
  },
  disabledText: {
    fontSize: 15,
    color: '#555',
  },
  submitButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
    alignSelf: 'center',
    width: 160,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
