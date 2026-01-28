import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { COLOR } from '../../../themes/Colors';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import BackArrow from '../../../assets/svg/backArrow.svg';
import ReuseButton from '../../../components/UI/ReuseButton';
import ApiManager from '../../../apis/ApiManager';
import { RootState } from '../../../store/RootReducer';
import { FONT, WIDTH } from '../../../themes/AppConst';
import { TEXT } from '../../../i18n/locales/Text';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import ScreenLoader from '../../../components/ScreenLoader';
import SuccessSheet from '../../../components/bottomSheets/SuccessSheet';
import { useFocusEffect } from '@react-navigation/native';

interface InfrastructureItem {
  name_of_village: string;
  type_of_property: string;
  count_of_partial_damaged: string;
  count_of_fully_damaged: string;
}

const getEmptyInfra = (): InfrastructureItem => ({
  name_of_village: '',
  type_of_property: '',
  count_of_partial_damaged: '',
  count_of_fully_damaged: '',
});

const InfrastructureReportScreen = ({ navigation, route }: any) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const { incident_id } = route.params;

  const [logReportId, setLogReportId] = useState<number | null>(null);
  const [infraList, setInfraList] = useState<InfrastructureItem[]>([
    getEmptyInfra(),
  ]);
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successRef = useRef<any>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const snackbar = useSnackbar();

  useFocusEffect(
    useCallback(() => {
      if (incident_id && userToken) {
        getLogReport(); // 🔥 refresh real backend status
      }
    }, [incident_id, userToken]),
  );

  /* ---------------- GET LOG REPORT ---------------- */
  useEffect(() => {
    if (incident_id && userToken) {
      getLogReport();
    }
  }, [incident_id, userToken]);

  const getLogReport = async () => {
    try {
      setLoadingGet(true);
      const res = await ApiManager.getLogReport(incident_id, userToken);
      if (!res?.data?.status) return;

      const data = res.data.data;

      // No log report yet
      setIsSubmitted(data?.is_submitted === true);
      if (
        data?.status === false ||
        data?.infrastructure_damage_report === undefined
      ) {
        setLogReportId(null);
        setInfraList([getEmptyInfra()]);
        return;
      }

      // Log report exists
      setLogReportId(data.id ?? data.log_report_id);

      if (data.infrastructure_damage_report?.length) {
        setInfraList(
          data.infrastructure_damage_report.map((i: any) => ({
            name_of_village: i.name_of_village ?? '',
            type_of_property: i.type_of_property ?? '',
            count_of_partial_damaged: String(i.count_of_partial_damaged ?? ''),
            count_of_fully_damaged: String(i.count_of_fully_damaged ?? ''),
          })),
        );
      } else {
        setInfraList([getEmptyInfra()]);
      }
    } catch (e) {
      console.log('Infra GET error', e);
      snackbar(e?.response?.data?.message, 'error');
    } finally {
      setLoadingGet(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  const updateField = (
    index: number,
    key: keyof InfrastructureItem,
    value: string,
  ) => {
    const updated = [...infraList];
    updated[index][key] = value;
    setInfraList(updated);
  };

  const addInfra = () => setInfraList(prev => [...prev, getEmptyInfra()]);

  const removeInfra = (index: number) => {
    const updated = infraList.filter((_, i) => i !== index);
    setInfraList(updated.length ? updated : [getEmptyInfra()]);
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async (showPopup = true) => {
    if (!incident_id || !user?.id) return;

    const payload = {
      incident_log_report_id: logReportId,
      incident_id,
      user_id: user.id,
      submit_status: 'pending',
      infrastructure_damage_report: infraList.map(i => ({
        name_of_village: i.name_of_village,
        type_of_property: i.type_of_property,
        count_of_partial_damaged: Number(i.count_of_partial_damaged || 0),
        count_of_fully_damaged: Number(i.count_of_fully_damaged || 0),
      })),
    };

    try {
      setLoadingSave(true);
      const res = await ApiManager.createIncidentLogReport(payload, userToken);
      if (res?.data?.status) {
        setLogReportId(res.data.data.id);
        console.log('Infrastructure saved');
        // Show the first message in snackbar
        if (showPopup) {
          const msg = res?.data?.message;

          setSuccessMsg(msg);
          successRef.current?.open();
        }

        await getLogReport();
      }
    } catch (e) {
      console.log('Infra SAVE error', e);
      snackbar(e?.response?.data?.message, 'error');
    } finally {
      setLoadingSave(false);
    }
  };

  const handleNext = async () => {
    if (!isSubmitted) {
      await handleSave(false); // 🔥 silent save
    }
    navigation.navigate('CropDamageReportScreen', { incident_id });
  };

  /* ---------------- UI ---------------- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader drawer={false} setDrawer={() => {}} />

      <View style={styles.titleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
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
            <Text style={styles.sectionTitle}>
              {TEXT.property_damage_report()}
            </Text>

            {infraList.map((item, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <Text style={styles.label}>{TEXT.name_of_village()}</Text>
                <TextInput
                  editable={!isSubmitted}
                  style={[
                    styles.input,
                    isSubmitted && { backgroundColor: COLOR.gray },
                  ]}
                  placeholder={TEXT.enter_name_of_village()}
                  value={item.name_of_village}
                  onChangeText={t => updateField(index, 'name_of_village', t)}
                />

                <Text style={styles.label}>{TEXT.type_of_property()}</Text>
                <TextInput
                  editable={!isSubmitted}
                  style={[
                    styles.input,
                    isSubmitted && { backgroundColor: COLOR.gray },
                  ]}
                  placeholder={TEXT.enter_type_of_infra()}
                  value={item.type_of_property}
                  onChangeText={t => updateField(index, 'type_of_property', t)}
                />
                <Text style={styles.label}>
                  {TEXT.count_of_partial_damage()}
                </Text>
                <TextInput
                  editable={!isSubmitted}
                  style={[
                    styles.input,
                    isSubmitted && { backgroundColor: COLOR.gray },
                  ]}
                  placeholder={TEXT.enter_count_of_partial_damage()}
                  keyboardType="number-pad"
                  value={item.count_of_partial_damaged}
                  onChangeText={t =>
                    updateField(index, 'count_of_partial_damaged', t)
                  }
                />
                <Text style={styles.label}>{TEXT.count_of_fully_damage()}</Text>

                <View style={styles.inlineRow}>
                  <TextInput
                    editable={!isSubmitted}
                    style={[
                      styles.input,
                      styles.flexInput,
                      isSubmitted && { backgroundColor: COLOR.gray },
                    ]}
                    placeholder={TEXT.enter_count_of_fully_damage()}
                    keyboardType="number-pad"
                    value={item.count_of_fully_damaged}
                    onChangeText={t =>
                      updateField(index, 'count_of_fully_damaged', t)
                    }
                  />

                  <View style={{ flexDirection: 'row' }}>
                    {/* Delete */}
                    {!isSubmitted && infraList.length > 1 && (
                      <TouchableOpacity
                        style={[
                          styles.inlineBtn,
                          { backgroundColor: COLOR.red },
                        ]}
                        onPress={() => removeInfra(index)}
                      >
                        <Text style={styles.inlineCross}>×</Text>
                      </TouchableOpacity>
                    )}

                    {/* Add (only on last row) */}
                    {!isSubmitted && index === infraList.length - 1 && (
                      <TouchableOpacity
                        style={[
                          styles.inlineBtn,
                          { backgroundColor: COLOR.blue },
                        ]}
                        onPress={addInfra}
                      >
                        <Text style={styles.inlinePlus}>＋</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.footer}>
              <View style={styles.topButtonRow}>
                <ReuseButton
                  text={TEXT.save()}
                  onPress={() => handleSave(true)}
                  style={styles.half}
                  disabled={loadingSave || isSubmitted}
                />
                <ReuseButton
                  text={TEXT.next()}
                  onPress={handleNext}
                  style={styles.half}
                  disabled={loadingSave}
                />
              </View>

              <View style={styles.closeWrapper}>
                <ReuseButton
                  text={TEXT.close()}
                  bgColor="#E5E7EB"
                  textColor={COLOR.white}
                  onPress={() => navigation.pop(3)}
                  style={styles.closeBtn}
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

export default InfrastructureReportScreen;

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
  half: { width: WIDTH(40) },

  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    height: 45,
  },
  addBtn: {
    backgroundColor: COLOR.blue,
    padding: 10,
    borderRadius: 6,
  },
  removeBtn: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 6,
  },
  icon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  title: { fontSize: 20, fontWeight: '700', color: COLOR.blue },

  topButtonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  halfButton: { width: WIDTH(40), marginTop: 0 },
  closeButton: { width: WIDTH(40), alignSelf: 'center', marginTop: 12 },
  plusIcon: { fontSize: 16, color: COLOR.blue, fontWeight: 'bold' },
  crossIcon: { fontSize: 24, color: 'red', fontWeight: 'bold' },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  flexInput: {
    flex: 1,
    marginBottom: 0, // IMPORTANT
    height: 45,
  },

  inlineBtn: {
    width: 44,
    height: 44,
    marginLeft: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  inlinePlus: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.white,
  },

  inlineCross: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLOR.white,
  },

  closeWrapper: {
    alignItems: 'center',
    // marginTop: 12,
  },

  closeBtn: {
    width: WIDTH(40),
    backgroundColor: COLOR.textGrey,
  },
  label: {
    fontSize: 14,
    color: COLOR.textGrey,
    marginBottom: 6,
    fontFamily: FONT.R_SBD_600,
  },
});
