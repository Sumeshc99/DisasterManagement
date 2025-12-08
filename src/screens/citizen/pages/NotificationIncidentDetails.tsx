import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import { COLOR } from '../../../themes/Colors';
import { FONT, WIDTH } from '../../../themes/AppConst';
import ApiManager from '../../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/RootReducer';
import ScreenStateHandler from '../../../components/ScreenStateHandler';
import BackArrow from '../../../assets/svg/backArrow.svg';
import ImageContainer from '../../../components/ImageContainer';
import RNBlobUtil from 'react-native-blob-util';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { TEXT } from '../../../i18n/locales/Text';

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

const ReviewerTable = ({ title, data }: any) => {
  if (!data || data.length === 0) return null;
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.reviewTitle}>{title}</Text>
      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 1 }]}>{TEXT.sr_no()}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {TEXT.full_name()}
          </Text>
          {title === TEXT.responders() && (
            <Text style={[styles.tableCell, { flex: 2 }]}>{TEXT.type()}</Text>
          )}
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {TEXT.contact_details()}
          </Text>
        </View>

        {data.map((item: any, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
            {title === TEXT.responders() && (
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.type}</Text>
            )}
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.number}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const NotificationIncidentDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const snackbar = useSnackbar();
  const { userToken } = useSelector((state: RootState) => state.auth);
  const data = (route as { params?: { data?: any } })?.params?.data;

  const [incidentData, setIncidentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getIncidentDetails();
  }, []);

  const getIncidentDetails = () => {
    setLoading(true);
    ApiManager.incidentDetails(data?.incident_auto_id || data, userToken)
      .then(resp => {
        if (resp?.data?.status) {
          setIncidentData(resp.data.data);
        }
      })
      .catch(err => console.log('err', err.response))
      .finally(() => setLoading(false));
  };

  const downloadPDF = (pdfUrl: string) => {
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
      .then(() => snackbar(TEXT.pdf_downloaded(), 'success'))
      .catch(err => console.log(err));
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
          <BackArrow />
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
            {incidentData && (
              <View style={styles.form}>
                <Text style={styles.label}>{TEXT.incident_id()}</Text>
                <Text style={styles.readOnlyText}>
                  {incidentData.incident_id}
                </Text>

                <Text style={styles.label}>{TEXT.incident_type()}</Text>
                <Text style={styles.readOnlyText}>
                  {incidentData.other_incident_type ||
                    incidentData.incident_type_name}
                </Text>

                <Text style={styles.label}>{TEXT.address()}</Text>
                <Text style={styles.readOnlyText}>{incidentData.address}</Text>

                <Text style={styles.label}>{TEXT.mobile_number()}</Text>
                <Text style={styles.readOnlyText}>
                  {incidentData.mobile_number}
                </Text>

                <Text style={styles.label}>{TEXT.description()}</Text>
                <Text style={styles.readOnlyText}>
                  {incidentData.description}
                </Text>

                {incidentData.media?.length > 0 && (
                  <View style={{ marginVertical: 10 }}>
                    <ImageContainer data={incidentData.media} />
                  </View>
                )}

                <Text style={styles.label}>{TEXT.status()}</Text>
                <Text style={styles.readOnlyText}>{incidentData.status}</Text>

                <Text style={styles.label}>{TEXT.date_time_reporting()}</Text>
                <Text style={styles.readOnlyText}>
                  {formatDateTime(incidentData.date_reporting)}
                </Text>

                {incidentData?.reviewers?.length > 0 && (
                  <ReviewerTable
                    title={TEXT.reviewer()}
                    data={incidentData.reviewers}
                  />
                )}

                {incidentData?.responders?.length > 0 && (
                  <ReviewerTable
                    title={TEXT.responders()}
                    data={incidentData.responders}
                  />
                )}

                {incidentData?.incident_blob_pdf && (
                  <TouchableOpacity
                    style={styles.submitButton1}
                    onPress={() => downloadPDF(incidentData.incident_blob_pdf)}
                  >
                    <Text style={styles.submitButtonText1}>
                      {TEXT.download_pdf()}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </ScreenStateHandler>
      </View>
    </SafeAreaView>
  );
};

export default NotificationIncidentDetails;

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
    marginTop: 10,
  },
  readOnlyText: {
    fontSize: 15,
    color: COLOR.black,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  submitButton1: {
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 24,
    width: 160,
    borderWidth: 2,
    borderColor: COLOR.blue,
    alignSelf: 'center',
  },
  submitButtonText1: {
    color: COLOR.blue,
    fontSize: 16,
    fontWeight: '700',
  },
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
