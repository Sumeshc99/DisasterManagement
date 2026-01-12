import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import FormTextInput from '../../components/inputs/FormTextInput';
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
import RejectReasonSheet1 from '../../components/bottomSheets/RejectReasonSheet1';
import ImageContainer from '../../components/ImageContainer';
import { downloadPDF } from '../../Utils/downloadPDF';

interface IncidentDetailsForm {
  incidentId: string;
  incidentType: string;
  address: string;
  tehsil: string;
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
            {' '}
            {TEXT.full_name()}
          </Text>
          {title === 'Responder' && (
            <Text style={[styles.tableCell, { flex: 2 }]}> {TEXT.type()}</Text>
          )}
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {' '}
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

const ResIncidentDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const rejectRef = useRef<any>(null);
  const assignRef = useRef<any>(null);
  const successRef = useRef<any>(null);
  const cancelRef = useRef<any>(null);
  const acceptRef = useRef<any>(null);

  const { user, userToken } = useSelector((state: RootState) => state.auth);
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
  } = useForm<IncidentDetailsForm>({
    defaultValues: {
      incidentId: '',
      incidentType: '',
      address: '',
      tehsil: '',
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
              incidentType: inc?.incident_type_name,
              address: inc?.address,
              tehsil: inc?.tehsil_name,
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
            dateTime: inc?.date_reporting,
          });
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => setLoading(false));
  };

  // ====================== SEND INCIDENT ============================
  const incidentUpdateStatus = (item: any) => {
    const body = {
      user_id: user?.id,
      incident_id: data?.incident_auto_id || data,
      button_type: item,
      cancel_reason: '',
      duplicate_incident_id: '',
      reason_for_cancellation: '',
    };

    showLoader();
    ApiManager.incidentStatusUpdate(body, userToken)
      .then(resp => {
        if (resp.data.status) {
          console.log('updated ');
          getIncidentDetails();
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => hideLoader());
  };

  const showActionBtns = () => {
    const data = incidentData?.pending_closure?.find(
      (i: any) => i.user_id === user?.id,
    );

    if (!data?.pending_closure) {
      return (
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}
        >
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: COLOR.darkGray }]}
            onPress={() => rejectRef.current.open()}
          >
            <Text style={styles.submitButtonText}>{TEXT.reject()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => incidentUpdateStatus('ResponderAccept')}
          >
            <Text style={styles.submitButtonText}>{TEXT.accept()}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (data.pending_closure === 'accept') {
      return (
        <View
          style={{ flexDirection: 'row', justifyContent: 'center', gap: 20 }}
        >
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => incidentUpdateStatus('Complete')}
          >
            <Text style={styles.submitButtonText}>{TEXT.complete()}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (data.pending_closure === 'complete') {
      return (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.submitButton1}
            onPress={() => downloadPDF(incidentData?.incident_blob_pdf)}
          >
            <Text style={styles.submitButtonText1}>{TEXT.download_pdf()}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const getPdf = () => {
    setLoading(true);
    ApiManager.downloadPdf(data?.incident_auto_id || data, userToken)
      .then(resp => {
        // console.log('downloadPdf', resp?.data?.data?.pdfUrl);
        downloadPDF(resp?.data?.data?.pdfUrl);
      })
      .catch(err => console.log('err', err.response))
      .finally(() => setLoading(false));
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
        <Text style={styles.title}>{TEXT.incident_details()}</Text>
        <View style={styles.backButton} />
      </View>

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
                multiline
                editable={false}
                rules={{ required: TEXT.address_required() }}
                error={errors.address?.message}
              />

              <View style={{ marginBottom: 10, marginTop: -4 }}>
                <Text style={styles.label}>{TEXT.tehsil()}</Text>
                <View style={styles.disabledBox}>
                  <Text style={styles.disabledText}>{watch('tehsil')}</Text>
                </View>
              </View>

              <FormTextInput
                label={TEXT.mobile_number()}
                name="mobileNumber"
                control={control}
                placeholder={TEXT.enter_mobile_number()}
                keyboardType="phone-pad"
                editable={false}
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
                placeholder="Enter description"
                editable={false}
                multiline
                rules={{ required: TEXT.description_required() }}
                error={errors.description?.message}
              />
              {/* MEDIA + STATUS */}
              <View style={{ flexDirection: 'row', gap: 14 }}>
                <View style={{ width: WIDTH(30) }}>
                  <ImageContainer data={media} />
                </View>

                <View style={{ flex: 1 }}>
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
              {incidentData?.status === 'Pending Response by Responder' ||
              incidentData?.status === 'Pending closure by Responder'
                ? showActionBtns()
                : (incidentData?.status === 'Pending closure by Admin' ||
                    incidentData?.status === 'Closed' ||
                    incidentData?.status === 'Admin Cancelled' ||
                    incidentData?.status === 'Reviewer Duplicate') && (
                    <View style={{ alignItems: 'center' }}>
                      <TouchableOpacity
                        style={styles.submitButton1}
                        onPress={() => getPdf()}
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

      {/* CANCEL */}
      <SuccessScreen
        ref={cancelRef}
        icon={require('../../assets/cancel1.png')}
        description={TEXT.report_cancelled()}
        height={240}
      />

      {/* ACCEPT */}
      <SelfHelpBottomSheet
        ref={acceptRef}
        onClose={() => console.log('Closed')}
      />

      <RejectReasonSheet1
        ref={rejectRef}
        data={incidentData}
        getIncidentDetails={getIncidentDetails}
      />
    </SafeAreaView>
  );
};

export default ResIncidentDetails;

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
    fontSize: 12,
    textAlign: 'center',
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
  submitButtonText1: {
    color: COLOR.blue,
    fontSize: 16,
    fontWeight: '700',
  },
});
