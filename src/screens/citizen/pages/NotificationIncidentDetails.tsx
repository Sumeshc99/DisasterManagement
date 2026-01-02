import React, { useEffect, useState, useRef } from 'react';
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
import ReuseButton from '../../../components/UI/ReuseButton';
import CommentSheet from '../../../components/bottomSheets/CommentSheet';

import RBSheet from 'react-native-raw-bottom-sheet';

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
  const { incident_id, notification_id } = route.params;

  const [incidentData, setIncidentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const commentRef = useRef<RBSheet>(null);

  useEffect(() => {
    getIncidentDetails();
  }, []);

  const getIncidentDetails = () => {
    setLoading(true);
    ApiManager.getNotificationDetails(incident_id, notification_id, userToken)
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
                <View
                  style={[
                    styles.row,
                    { borderBottomWidth: 2, borderBottomColor: '#D9D9D9' },
                  ]}
                >
                  <Text style={styles.label}>{TEXT.incident_id()}</Text>

                  <Text style={[styles.value, { marginRight: 6 }]}>
                    {incidentData.incident_id}
                  </Text>

                  {incidentData?.status && (
                    <View
                      style={{
                        backgroundColor: '#F2D370',
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: '#AD9547',
                          fontWeight: '700',
                          fontSize: 12,
                        }}
                      >
                        {incidentData.status}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>{TEXT.date_time_reporting()}</Text>
                  <Text style={styles.readOnlyText}>
                    {formatDateTime(incidentData.date_reporting)}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>{TEXT.incident_type()}</Text>
                  <Text style={styles.readOnlyText}>
                    {incidentData.other_incident_type ||
                      incidentData.incident_type_name}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>{TEXT.address()}</Text>
                  <Text style={styles.readOnlyText}>
                    {incidentData.address}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{TEXT.mobile_number()}</Text>
                  <Text style={styles.readOnlyText}>
                    {incidentData.mobile_number}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>{TEXT.description()}</Text>
                  <Text style={styles.readOnlyText}>
                    {incidentData.description}
                  </Text>
                </View>

                {incidentData.media?.length > 0 && (
                  <View style={{ marginVertical: 10 }}>
                    <ImageContainer data={incidentData.media} />
                  </View>
                )}

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

                <Text
                  style={{
                    fontSize: 14,
                    color: '#6E6E6E',
                    textAlign: 'center',
                    marginTop: 18,
                    lineHeight: 18,
                  }}
                >
                  If you have more information to share on this incident, please
                  feel free to post a comment by clicking on "Comment" button
                  below.
                </Text>

                <ReuseButton
                  text="Comment"
                  style={{ width: WIDTH(50), alignSelf: 'center' }}
                  onPress={() => commentRef.current?.open()}
                />
              </View>
            )}
          </ScrollView>
        </ScreenStateHandler>

        <CommentSheet
          ref={commentRef}
          incidentId={incident_id}
          userToken={userToken}
        />
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
    fontSize: 22,
    fontWeight: '700',
    color: COLOR.blue,
  },
  content: { flex: 1, backgroundColor: COLOR.white },
  form: { paddingHorizontal: 16, paddingBottom: 16, gap: 6 },
  readOnlyText: {
    fontSize: 14,
    color: COLOR.lightTextGrey,
    fontFamily: FONT.R_REG_400,
    marginTop: 4,
    paddingBottom: 6,
  },
  submitButton1: {
    paddingVertical: 12,
    borderRadius: 35,
    width: 200,
    borderWidth: 2,
    borderColor: COLOR.blue,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
  },
  submitButtonText1: {
    color: COLOR.blue,
    fontSize: 17,
    fontWeight: '700',
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.textGrey,
    marginBottom: 10,
    marginTop: 10,
  },
  tableContainer: {
    borderWidth: 1.5,
    borderColor: '#C2C2C2',
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
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    width: 130, // FIXED width makes alignment perfect
    fontSize: 14,
    color: COLOR.textGrey,
    fontFamily: FONT.R_MED_500,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: COLOR.lightTextGrey,
    fontFamily: FONT.R_REG_400,
  },
});
