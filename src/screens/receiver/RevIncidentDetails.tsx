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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import FormTextInput from '../../components/inputs/FormTextInput';
import FormMediaPicker from '../../components/inputs/FormMediaPicker';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import SuccessScreen from '../../components/bottomSheets/SuccessScreen';
import SelfHelpBottomSheet from '../../components/bottomSheets/SelfHelpOptionsSheet';
import { TEXT } from '../../i18n/locales/Text';
import ScreenStateHandler from '../../components/ScreenStateHandler';
import RejectReasonSheet from '../../components/bottomSheets/RejectReasonSheet';
import AssignResponderSheet from '../../components/bottomSheets/AssignResponderSheet';
import ImageContainer from '../../components/ImageContainer';

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

const ReviewerTable = ({ title, data }: any) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.reviewTitle}>{title}</Text>

      <View style={styles.tableContainer}>
        {/* Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 1 }]}>Sr. No</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>Full Name</Text>
          {title === 'Responder' && (
            <Text style={[styles.tableCell, { flex: 2 }]}>Type</Text>
          )}
          <Text style={[styles.tableCell, { flex: 2 }]}>Contact Details</Text>
        </View>

        {/* Rows */}
        {data.map((item: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
            {title === 'Responder' && (
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.type}</Text>
            )}
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.number}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const RevIncidentDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const rejectRef = useRef<any>(null);
  const assignRef = useRef<any>(null);
  const successRef = useRef<any>(null);
  const cancelRef = useRef<any>(null);
  const acceptRef = useRef<any>(null);

  const { userToken } = useSelector((state: RootState) => state.auth);
  const { showLoader, hideLoader } = useGlobalLoader();

  const data = (route as { params?: { data?: any } })?.params?.data;

  const [incidentData, setIncidentData] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IncidentDetailsForm>({
    defaultValues: {
      incidentId: '',
      incidentType: '',
      address: '',
      mobileNumber: '',
      description: '',
      media: [],
      status: '',
      dateTime: '',
    },
  });

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (hours === 0) hours = 12;
    else if (hours > 12) hours = hours - 12;

    return `${day}/${month}/${year}, ${hours}.${minutes} ${ampm}`;
  };

  const media = watch('media');

  // ==================== LOAD INCIDENT DETAILS =====================
  useEffect(() => {
    const getIncidentDetails = () => {
      setLoading(true);
      ApiManager.incidentDetails(data?.incident_auto_id || data, userToken)
        .then(resp => {
          if (resp?.data?.status) {
            const inc = resp?.data?.data;
            setIncidentData(inc);

            reset({
              incidentId: inc?.incident_id,
              incidentType: inc.other_incident_type || inc?.incident_type_name,
              address: inc?.address,
              mobileNumber: inc?.mobile_number,
              description: inc?.description,
              media: inc?.upload_media,
              status: inc?.status,
              dateTime: formatDateTime(inc?.date_reporting),
            });
          }
        })
        .catch(err => console.log('err', err.response))
        .finally(() => setLoading(false));
    };

    getIncidentDetails();
  }, []);

  // ==================== IMAGE UPLOAD ============================
  const handleImageUpload1 = (item: any) => {
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

  const handleImageUpload = (items: any[]) => {
    const updated = [...media, ...items];
    setValue('media', updated);
  };

  const handleRemoveMedia = (index: number) => {
    const updated = media.filter((_, i) => i !== index);
    setValue('media', updated);
  };

  // ==================== UPDATE INCIDENT ============================
  const updateIncedents = (formData: IncidentDetailsForm) => {
    const body = {
      incident_id: incidentData?.id,
      address: formData.address,
      mobile_number: formData.mobileNumber,
      description: formData.description,
      upload_media: formData.media || [],
    };

    showLoader();
    ApiManager.updateIncident(body, userToken)
      .then(resp => {
        if (resp.data.status) {
          Alert.alert('Success', 'Incident updated successfully.');
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  // ====================== SEND INCIDENT ============================
  const incidentUpdateStatus = () => {
    const body = {
      incident_id: data?.incident_auto_id || data,
      button_type: 'Yes',
      cancel_reason: '',
      duplicate_incident_id: '',
      reason_for_cancellation: '',
    };
    showLoader();
    ApiManager.incidentStatusUpdate(body, userToken)
      .then(resp => {
        if (resp.data.status) {
          successRef.current.close();
          acceptRef.current.open();
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  const onSuccessNo = () => {
    successRef.current.close();
    cancelRef.current.open();
    cancelRef.current.close();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader drawer={false} setDrawer={() => ''} />

      {/* HEADER */}
      <View style={styles.titleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={require('../../assets/backArrow.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Incident Details</Text>
        <View style={styles.backButton} />
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <ScreenStateHandler loading={loading} isEmpty={!incidentData}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              <Text style={styles.label}>Incident ID</Text>
              <View style={styles.disabledBox}>
                <Text style={styles.disabledText}>{watch('incidentId')}</Text>
              </View>

              <View style={{ marginVertical: 10 }}>
                <Text style={styles.label}>Incident Type</Text>
                <View style={styles.disabledBox}>
                  <Text style={styles.disabledText}>
                    {watch('incidentType')}
                  </Text>
                </View>
              </View>

              <FormTextInput
                label={TEXT.address()}
                name="address"
                control={control}
                placeholder="Enter address"
                multiline
                editable={false}
                rules={{ required: 'Address is required' }}
                error={errors.address?.message}
              />

              <FormTextInput
                label="Mobile Number"
                name="mobileNumber"
                control={control}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                editable={false}
                rules={{
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: TEXT.enter_valid_10_digit_number(),
                  },
                }}
                error={errors.mobileNumber?.message}
              />

              <FormTextInput
                label="Description"
                name="description"
                control={control}
                placeholder="Enter description"
                editable={false}
                multiline
                rules={{ required: 'Description is required' }}
                error={errors.description?.message}
              />

              {/* MEDIA + STATUS */}
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ width: WIDTH(30) }}>
                  {/* <FormMediaPicker
                    label="Images"
                    name="media"
                    control={control}
                    rules={{ required: 'At least one image is required' }}
                    error={errors.media?.message}
                    media={media}
                    onChangeMedia={handleImageUpload}
                    onRemoveMedia={handleRemoveMedia}
                  /> */}
                  {media?.length && <ImageContainer data={media} />}
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

              {incidentData?.reviewers?.length > 0 && (
                <ReviewerTable
                  title={'Reviewer'}
                  data={incidentData?.reviewers}
                />
              )}

              {incidentData?.responders?.length > 0 && (
                <ReviewerTable
                  title={'Responder'}
                  data={incidentData?.responders}
                />
              )}

              {/* BUTTONS */}
              {incidentData?.status === 'Pending Review' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: COLOR.darkGray },
                    ]}
                    onPress={() => rejectRef.current.open()}
                  >
                    <Text style={styles.submitButtonText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => assignRef.current.open()}
                  >
                    <Text style={styles.submitButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      { backgroundColor: COLOR.darkGray },
                    ]}
                    onPress={() => ''}
                  >
                    <Text style={styles.submitButtonText}>Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </ScreenStateHandler>
      </View>

      {/* SEND CONFIRMATION */}
      <SuccessScreen
        ref={successRef}
        description={
          'Your disaster report will be sent to the authorities for review and response, and immediate action will be taken. Do you want to proceed?'
        }
        onNo={onSuccessNo}
        onYes={incidentUpdateStatus}
        height={340}
      />

      {/* CANCEL */}
      <SuccessScreen
        ref={cancelRef}
        icon={require('../../assets/cancel1.png')}
        description={'Your report has been successfully cancelled.'}
        height={240}
      />

      {/* ACCEPT */}
      <SelfHelpBottomSheet
        ref={acceptRef}
        onClose={() => console.log('Closed')}
      />

      <RejectReasonSheet ref={rejectRef} data={incidentData} />
      <AssignResponderSheet ref={assignRef} data={incidentData} />
    </SafeAreaView>
  );
};

export default RevIncidentDetails;

// ===================== STYLES ======================
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
  disabledText: { fontSize: 15, color: '#555' },
  submitButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
    width: 160,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // === Reviewer Table Styles ===
  reviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.textGrey,
    marginBottom: 10,
    marginTop: 10,
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  tableHeader: {
    backgroundColor: '#F5F5F5',
  },

  tableCell: {
    padding: 10,
    fontSize: 15,
    textAlign: 'center',
  },
});
