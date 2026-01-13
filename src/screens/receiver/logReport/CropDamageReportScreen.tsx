import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { COLOR } from '../../../themes/Colors';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import BackArrow from '../../../assets/svg/backArrow.svg';
import ReuseButton from '../../../components/UI/ReuseButton';
import ApiManager from '../../../apis/ApiManager';
import { RootState } from '../../../store/RootReducer';
import { FONT } from '../../../themes/AppConst';
import RevResTable from '../../../components/UI/RevResTable';
import { TEXT } from '../../../i18n/locales/Text';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import ScreenLoader from '../../../components/ScreenLoader';
import SuccessSheet from '../../../components/bottomSheets/SuccessSheet';

/* ---------------- TYPES ---------------- */
interface CropDamageItem {
  name_of_village: string;
  no_of_affected_farmers: string;
  area_of_damage_hecter: string;
}

const getEmptyCrop = (): CropDamageItem => ({
  name_of_village: '',
  no_of_affected_farmers: '',
  area_of_damage_hecter: '',
});

const CropDamageReportScreen = ({ navigation, route }: any) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const { incident_id } = route.params;

  const [logReportId, setLogReportId] = useState<number | null>(null);
  const [cropList, setCropList] = useState<CropDamageItem[]>([getEmptyCrop()]);
  const [incidentDetails, setIncidentDetails] = useState<any>(null);
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const successRef = useRef<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const snackbar = useSnackbar();

  const getIncidentDetails = async () => {
    try {
      const res = await ApiManager.incidentDetails(incident_id, userToken);
      if (res?.data?.status) {
        setIncidentDetails(res.data.data);
      }
    } catch (e) {
      console.log('Incident details error', e);
    }
  };

  /* ---------------- GET LOG REPORT ---------------- */
  useEffect(() => {
    if (incident_id && userToken) {
      getLogReport();
      getIncidentDetails();
    }
  }, [incident_id, userToken]);

  const getLogReport = async () => {
    try {
      setLoadingGet(true);
      const res = await ApiManager.getLogReport(incident_id, userToken);
      if (!res?.data?.status) return;

      const data = res.data.data;

      setLogReportId(data?.log_report_id ?? data?.id ?? null);
      setIsSubmitted(data?.is_submitted === true);

      if (data?.crop_damage_report?.length) {
        setCropList(
          data.crop_damage_report.map((c: any) => ({
            name_of_village: c.name_of_village ?? '',
            no_of_affected_farmers: String(c.no_of_affected_farmers ?? ''),
            area_of_damage_hecter: String(c.area_of_damage_hecter ?? ''),
          })),
        );
      } else {
        setCropList([getEmptyCrop()]);
      }
    } catch (e) {
      console.log('Crop GET error', e);
    } finally {
      setLoadingGet(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const updateField = (
    index: number,
    key: keyof CropDamageItem,
    value: string,
  ) => {
    const updated = [...cropList];
    updated[index][key] = value;
    setCropList(updated);
  };

  const addCrop = () => setCropList(prev => [...prev, getEmptyCrop()]);

  const removeCrop = (index: number) => {
    const updated = cropList.filter((_, i) => i !== index);
    setCropList(updated.length ? updated : [getEmptyCrop()]);
  };

  /* ---------------- SAVE / SUBMIT ---------------- */
  const saveReport = async (status: 'pending' | 'submitted') => {
    if (!incident_id || !user?.id) return;

    const payload = {
      incident_log_report_id: logReportId,
      incident_id,
      user_id: user.id,
      submit_status: status,
      crop_damage_report: cropList.map(item => ({
        name_of_village: item.name_of_village,
        no_of_affected_farmers: item.no_of_affected_farmers,
        area_of_damage_hecter: item.area_of_damage_hecter,
      })),
    };

    try {
      setLoadingSave(true);
      const res = await ApiManager.createIncidentLogReport(payload, userToken);
      if (res?.data?.status) {
        setLogReportId(res.data.data.id);

        if (status === 'submitted') {
          setSuccessMsg(
            'Report has been successfully submitted for Admin closure. The report is no longer available for updates.',
          );
        } else {
          setSuccessMsg(
            'The report has been saved successfully. Until it is submitted, the report is open for revisions.',
          );
        }

        successRef.current?.open();

        await getLogReport();
      }
    } catch (e) {
      console.log('Crop SAVE error', e);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSuccessClose = () => {
    if (successMsg.includes('submitted')) {
      navigation.goBack(); // go to Incident Details
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader drawer={false} setDrawer={() => {}} />

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.title}>{TEXT.log_report()}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {loadingGet || loadingSave ? (
          <ScreenLoader />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>{TEXT.crop_damage_report()}</Text>

            {cropList.map((item, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <Text style={styles.label}>{TEXT.name_of_village()}</Text>
                <TextInput
                  editable={!isSubmitted}
                  style={[
                    styles.input,
                    isSubmitted && { backgroundColor: COLOR.gray },
                  ]}
                  placeholder={TEXT.name_of_village()}
                  value={item.name_of_village}
                  onChangeText={t => updateField(index, 'name_of_village', t)}
                />

                <Text style={styles.label}>
                  {TEXT.no_of_affected_farmers()}
                </Text>

                <TextInput
                  editable={!isSubmitted}
                  style={[
                    styles.input,
                    isSubmitted && { backgroundColor: COLOR.gray },
                  ]}
                  placeholder={TEXT.no_of_affected_farmers()}
                  keyboardType="number-pad"
                  value={item.no_of_affected_farmers}
                  onChangeText={t =>
                    updateField(index, 'no_of_affected_farmers', t)
                  }
                />

                <Text style={styles.label}>
                  {TEXT.area_of_agricultural_damage()}
                </Text>

                <View style={styles.row}>
                  <TextInput
                    editable={!isSubmitted}
                    style={[
                      styles.input,
                      isSubmitted && { backgroundColor: COLOR.gray },
                      { flex: 1 },
                    ]}
                    placeholder={TEXT.area_of_agricultural_damage()}
                    keyboardType="number-pad"
                    value={item.area_of_damage_hecter}
                    onChangeText={t =>
                      updateField(index, 'area_of_damage_hecter', t)
                    }
                  />

                  {/* REMOVE button (always visible if more than one item) */}
                  {!isSubmitted && cropList.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeCrop(index)}
                    >
                      <Text style={styles.icon}>×</Text>
                    </TouchableOpacity>
                  )}

                  {/* ADD button (only on last item) */}
                  {!isSubmitted && index === cropList.length - 1 && (
                    <TouchableOpacity style={styles.addBtn} onPress={addCrop}>
                      <Text style={styles.icon}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {incidentDetails?.reviewers?.length > 0 && (
              <RevResTable title="Reviewer" data={incidentDetails.reviewers} />
            )}

            {incidentDetails?.responders?.length > 0 && (
              <RevResTable
                title="Responder"
                data={incidentDetails.responders}
              />
            )}

            {/* Footer */}
            <View style={styles.footer}>
              {/* Save + Submit */}
              <View style={styles.topButtonRow}>
                <ReuseButton
                  text={TEXT.save()}
                  style={styles.half}
                  disabled={isSubmitted}
                  onPress={() => saveReport('pending')}
                />
                <ReuseButton
                  text={TEXT.submit()}
                  style={styles.half}
                  disabled={isSubmitted}
                  onPress={() => saveReport('submitted')}
                />
              </View>

              {/* Close button */}
              <View style={styles.closeBtnWrapper}>
                <ReuseButton
                  text={TEXT.close()}
                  style={styles.closeBtn}
                  onPress={() => navigation.goBack()}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      <SuccessSheet ref={successRef} message={successMsg} showOk={false} />
    </SafeAreaView>
  );
};

export default CropDamageReportScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: COLOR.textGrey,
  },
  label: {
    fontSize: 14,
    color: COLOR.textGrey,
    marginBottom: 6,
    fontFamily: FONT.R_SBD_600,
  },

  titleBar: {
    backgroundColor: COLOR.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.blue,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: COLOR.textGrey,
    fontFamily: FONT.R_REG_400,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  addBtn: {
    width: 44,
    height: 44,
    marginLeft: 8,
    backgroundColor: COLOR.blue,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeBtn: {
    width: 44,
    height: 44,
    marginLeft: 8,
    backgroundColor: COLOR.red,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  footer: {
    marginTop: 15,
    backgroundColor: '#fff',
  },

  topButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  half: {
    width: '48%',
  },
  closeBtnWrapper: {
    marginTop: 0,
    alignItems: 'center',
  },

  closeBtn: {
    width: '50%',
    backgroundColor: COLOR.textGrey,
  },
});
