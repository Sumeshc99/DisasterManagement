import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import FormTextInput from '../../../components/inputs/FormTextInput';
import { COLOR } from '../../../themes/Colors';
import { FONT, WIDTH, HEIGHT } from '../../../themes/AppConst';
import ApiManager from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/RootReducer';
import { useGlobalLoader } from '../../../hooks/GlobalLoaderContext';
import SuccessScreen from '../../../components/bottomSheets/SuccessScreen';
import SelfHelpBottomSheet from '../../../components/bottomSheets/SelfHelpOptionsSheet';
import { TEXT } from '../../../i18n/locales/Text';
import ScreenStateHandler from '../../../components/ScreenStateHandler';
import BackArrow from '../../../assets/svg/backArrow.svg';
import ImageContainer from '../../../components/ImageContainer';
import RNBlobUtil from 'react-native-blob-util';
import { useSnackbar } from '../../../hooks/SnackbarProvider';

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
          <Text style={[styles.tableCell, { flex: 1 }]}>{TEXT.sr_no()}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {TEXT.full_name()}
          </Text>
          {title === 'Responder' && (
            <Text style={[styles.tableCell, { flex: 2 }]}>{TEXT.type()}</Text>
          )}
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {TEXT.contact_details()}
          </Text>
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

const IncidentDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const snackbar = useSnackbar();

  const successRef = useRef<any>(null);
  const cancelRef = useRef<any>(null);
  const acceptRef = useRef<any>(null);

  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const { showLoader, hideLoader } = useGlobalLoader();

  const data = (route as { params?: { data?: any } })?.params?.data;

  const [incidentData, setIncidentData] = useState<any>('');
  const [loading, setLoading] = useState(false);

  const [tapCount, setTapCount] = useState(0);
  const tapTimeout = useRef<number | null>(null);

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

  const media = watch('media');

  useEffect(() => {
    getIncidentDetails();
  }, []);

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
            media: inc?.media,
            status: inc?.status,
            dateTime: formatDateTime(inc?.date_reporting),
          });
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => setLoading(false));
  };

  // ==================== IMAGE UPLOAD ============================
  const handleImageUpload1 = (item: any) => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 5 },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || TEXT.failed_to_pick());
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
          Alert.alert(TEXT.success(), TEXT.incident_update());
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  // ====================== SEND INCIDENT ============================
  const incidentUpdateStatus = () => {
    const body = {
      incident_id: data?.incident_auto_id || data,
      button_type: TEXT.yes(),
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
          assignToReviewer();
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  const assignToReviewer = () => {
    ApiManager.assignToReviewer(data?.incident_auto_id || data, userToken)
      .then(resp => {
        if (resp.data.status) {
          console.log(TEXT.assigned_reviewer_success());
        }
      })
      .catch(err => console.log('err', err.response));
  };

  const handleTripleTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;

      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
      }

      // If tapped 3 times
      if (newCount >= 3) {
        setTapCount(0);
        cancelIncident();
        return 0;
      }

      // Reset counter if too slow (1.5 sec)
      tapTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 1500);

      return newCount;
    });
  };

  const cancelIncident = async () => {
    const body = {
      incident_id: data?.incident_auto_id || data,
      button_type: 'Cancel',
      cancel_reason: '',
      duplicate_incident_id: '',
      reason_for_cancellation: '',
    };
    showLoader();
    ApiManager.incidentStatusUpdate(body, userToken)
      .then(resp => {
        if (resp.data.status) {
          cancelRef.current.open();
          getIncidentDetails();
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  const downloadPDF = (item: any) => {
    const pdfUrl = item;
    if (!pdfUrl) {
      snackbar(TEXT.pdf_url_notavailable(), 'error');
      return;
    }
    const { dirs } = RNBlobUtil.fs;
    const downloadPath =
      Platform.OS === 'android'
        ? `${dirs.DownloadDir}/myfile_${Date.now()}.pdf`
        : `${dirs.DocumentDir}/myfile_${Date.now()}.pdf`;

    RNBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: downloadPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Downloading PDF',
        description: 'Downloading PDF...',
        path: downloadPath,
        mime: 'application/pdf',
        mediaScannable: true,
      },
    })
      .fetch('GET', pdfUrl)
      .then(res => {
        console.log('Saved to:', downloadPath);
      })
      .catch(err => console.log(err));
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
          onPress={() => navigation.navigate('mainAppSelector')}
          style={styles.backButton}
        >
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.title}>{TEXT.incident_details()}</Text>
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
              <Text style={styles.label}>{TEXT.incident_id()}</Text>
              <View style={styles.disabledBox}>
                <Text style={styles.disabledText}>{watch('incidentId')}</Text>
              </View>

              <View style={{ marginVertical: 10 }}>
                <Text style={styles.label}>{TEXT.incident_type()}</Text>
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
                placeholder={TEXT.enter_address()}
                editable={
                  incidentData.status === 'New' &&
                  incidentData.user_id == user?.id
                }
                multiline
                rules={{ required: TEXT.address_required() }}
                error={errors.address?.message}
              />

              <FormTextInput
                label={TEXT.mobile_number()}
                name="mobileNumber"
                control={control}
                placeholder={TEXT.enter_mobile_number()}
                keyboardType="phone-pad"
                editable={
                  incidentData.status === 'New' &&
                  incidentData.user_id == user?.id
                }
                rules={{
                  required: TEXT.mobile_required(),
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: TEXT.enter_valid_10_digit_number(),
                  },
                }}
                error={errors.mobileNumber?.message}
              />

              <FormTextInput
                label={TEXT.description()}
                name="description"
                control={control}
                placeholder={TEXT.enter_description()}
                multiline
                editable={
                  incidentData.status === 'New' &&
                  incidentData.user_id == user?.id
                }
                error={errors.description?.message}
              />

              <View style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ width: WIDTH(30) }}>
                  {media?.length && <ImageContainer data={media} />}
                </View>

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <Text style={styles.label}>{TEXT.status()}</Text>
                  <View style={styles.disabledBox}>
                    <Text style={styles.disabledText}>{watch('status')}</Text>
                  </View>

                  <Text style={[styles.label, { marginTop: 6 }]}>
                    {TEXT.date_time_reporting()}
                  </Text>
                  <View style={styles.disabledBox}>
                    <Text style={styles.disabledText}>{watch('dateTime')}</Text>
                  </View>
                </View>
              </View>

              {incidentData?.reviewers?.length > 0 && (
                <ReviewerTable
                  title={TEXT.reviewer()}
                  data={incidentData?.reviewers}
                />
              )}

              {incidentData?.responders?.length > 0 && (
                <ReviewerTable
                  title={TEXT.responders()}
                  data={incidentData?.responders}
                />
              )}

              {/* BUTTONS */}
              {incidentData.status === 'New' ? (
                incidentData.user_id == user?.id && (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 20,
                      }}
                    >
                      <TouchableOpacity
                        style={[styles.submitButton]}
                        onPress={handleSubmit(updateIncedents)}
                      >
                        <Text style={styles.submitButtonText}>
                          {TEXT.update()}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit(() => successRef.current.open())}
                      >
                        <Text style={styles.submitButtonText}>
                          {TEXT.send()}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleTripleTap()}
                      style={{ marginTop: 20, alignSelf: 'center' }}
                    >
                      <Image
                        source={require('../../../assets/cancelBig.png')}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        textAlign: 'center',
                        fontFamily: FONT.R_MED_500,
                      }}
                    >
                      {TEXT.tap_to_cancel()}
                    </Text>
                  </View>
                )
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    style={[styles.submitButton1]}
                    onPress={() => downloadPDF(incidentData?.incident_blob_pdf)}
                  >
                    <Text style={styles.submitButtonText1}>
                      {TEXT.download_pdf()}
                    </Text>
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
        description={TEXT.confirm_submission()}
        onNo={onSuccessNo}
        onYes={incidentUpdateStatus}
        height={340}
        type="success"
      />

      {/* CANCEL */}
      <SuccessScreen
        ref={cancelRef}
        icon={require('../../../assets/cancel1.png')}
        description={TEXT.report_cancelled()}
        height={240}
      />

      {/* ACCEPT */}
      <SelfHelpBottomSheet
        ref={acceptRef}
        onClose={() => console.log('Closed')}
      />
    </SafeAreaView>
  );
};

export default IncidentDetails;

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
    color: COLOR.textGrey,
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
  disabledText: { fontSize: 15, color: COLOR.textGrey },
  submitButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
    width: 160,
  },
  submitButton1: {
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
    width: 160,
    borderWidth: 2,
    borderColor: COLOR.blue,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonText1: {
    color: COLOR.blue,
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
    fontSize: 12,
    textAlign: 'center',
  },
});
