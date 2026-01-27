import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLOR } from '../../../themes/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import BackArrow from '../../../assets/svg/backArrow.svg';
import ReuseButton from '../../../components/UI/ReuseButton';
import ApiManager from '../../../apis/ApiManager';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/RootReducer';
import { FONT, WIDTH } from '../../../themes/AppConst';
import { TEXT } from '../../../i18n/locales/Text';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import ScreenLoader from '../../../components/ScreenLoader';
import SuccessSheet from '../../../components/bottomSheets/SuccessSheet';
import { useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface Person {
  name: string;
  age: string;
  gender: string;
  address: string;
  type_of_injury: string;
}

const emptyPerson: Person = {
  name: '',
  age: '',
  gender: '',
  address: '',
  type_of_injury: '',
};

const HumanImpactScreen = ({ navigation }: any) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [deceasedCount, setDeceasedCount] = useState('0');
  const [deceasedList, setDeceasedList] = useState<Person[]>([
    { ...emptyPerson },
  ]);

  const [injuredCount, setInjuredCount] = useState('0');
  const [injuredList, setInjuredList] = useState<Person[]>([
    { ...emptyPerson },
  ]);

  const [missingCount, setMissingCount] = useState('0');
  const [missingList, setMissingList] = useState<Person[]>([
    { ...emptyPerson },
  ]);

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successRef = useRef<any>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const toNumber = (value: string) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const snackbar = useSnackbar();

  type HumanImpactRouteParams = {
    HumanImpactScreen: {
      incidentId: number;
    };
  };
  const route =
    useRoute<RouteProp<HumanImpactRouteParams, 'HumanImpactScreen'>>();

  const incidentId = route.params?.incidentId;

  const userId = user?.id;
  const token = userToken;

  const [logReportId, setLogReportId] = useState<number | null>(null);

  const getLogReportData = async () => {
    try {
      setLoading(true);
      const res = await ApiManager.getLogReport(incidentId, token);

      if (res?.data?.status === false) {
        console.log('No existing log report, fresh entry');

        // reset everything for fresh entry
        setInjuredList([{ ...emptyPerson }]);
        setInjuredCount('0');

        setDeceasedList([{ ...emptyPerson }]);
        setDeceasedCount('0');

        setMissingList([{ ...emptyPerson }]);
        setMissingCount('0');

        setLogReportId(null);
        return;
      }

      if (res?.data?.status) {
        const data = res.data.data;
        console.log('111111', data);

        setIsSubmitted(data?.is_submitted === true);

        setLogReportId(data.log_report_id);

        // Injured
        if (data.injured_names?.length) {
          setInjuredList(
            data.injured_names.map((p: any) => ({
              name: p.name ?? '',
              age: p.age ?? '',
              gender: p.gender ?? '',
              address: p.address ?? '',
              type_of_injury: p.type_of_injury ?? '',
            })),
          );
          setInjuredCount(String(data.injured_count ?? 0));
        } else {
          setInjuredList([{ ...emptyPerson }]);
        }

        // Deceased
        if (data.deceased_names?.length) {
          setDeceasedList(
            data.deceased_names.map((p: any) => ({
              name: p.name ?? '',
              age: p.age ?? '',
              gender: p.gender ?? '',
              address: p.address ?? '',
            })),
          );
          setDeceasedCount(String(data.deceased_count ?? 0));
        } else {
          setDeceasedList([{ ...emptyPerson }]);
        }

        // Missing
        if (data.missing_names?.length) {
          setMissingList(
            data.missing_names.map((p: any) => ({
              name: p.name ?? '',
              age: p.age ?? '',
              gender: p.gender ?? '',
              address: p.address ?? '',
            })),
          );
          setMissingCount(String(data.missing_count ?? 0));
        } else {
          setMissingList([{ ...emptyPerson }]);
        }
      }
    } catch (e: any) {
      console.log('GET log report error', e);
      snackbar(e?.response?.data?.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (incidentId && userToken) {
        getLogReportData(); // 🔥 refresh real backend status
      }
    }, [incidentId, userToken]),
  );

  useEffect(() => {
    if (incidentId && token) {
      getLogReportData();
    }
  }, [incidentId, token]);

  const updatePerson = (
    list: Person[],
    setList: Function,
    index: number,
    key: keyof Person,
    value: string,
  ) => {
    const updated = [...list];
    updated[index][key] = value;
    setList(updated);
  };

  const addPerson = (list: Person[], setList: Function) => {
    setList([...list, { ...emptyPerson }]);
  };

  const removePerson = (list: Person[], setList: Function, index: number) => {
    if (list.length === 1) return; // ❌ don't delete last row

    const updated = list.filter((_, i) => i !== index);
    setList(updated);
  };

  const handleNext = async () => {
    if (!isSubmitted) {
      await handleSave(false); // 🔥 wait till save finishes
    }
    navigation.navigate('AnimalImpactScreen', {
      incident_id: incidentId,
      log_report_id: logReportId,
    });
  };

  // const getValidCount = (list: Person[]) => {
  //   return list.filter(
  //     p =>
  //       p.name.trim() ||
  //       p.age.trim() ||
  //       p.gender.trim() ||
  //       p.address.trim() ||
  //       p.type_of_injury.trim(),
  //   ).length;
  // };

  const handleSave = async (showPopup = true) => {
    if (!incidentId || !userId) {
      console.log('Missing incidentId or userId');
      return;
    }

    // const injuredValidCount = getValidCount(injuredList);
    // const deceasedValidCount = getValidCount(deceasedList);
    // const missingValidCount = getValidCount(missingList);

    const filterValid = (list: Person[]) =>
      list.filter(
        p =>
          p.name.trim() || p.age.trim() || p.gender.trim() || p.address.trim(),
      );

    const payload = {
      incident_log_report_id: logReportId, // null for first time
      incident_id: incidentId,
      user_id: userId,
      submit_status: 'pending',

      injured_count: toNumber(injuredCount),
      injured_names: injuredList.filter(
        p => p.name || p.age || p.gender || p.address || p.type_of_injury,
      ),

      deceased_count: toNumber(deceasedCount),
      deceased_names: deceasedList.filter(
        p => p.name || p.age || p.gender || p.address,
      ),

      missing_count: toNumber(missingCount),
      missing_names: missingList.filter(
        p => p.name || p.age || p.gender || p.address,
      ),
    };

    try {
      setLoading(true);
      const res = await ApiManager.createIncidentLogReport(payload, token);

      if (res?.data?.status) {
        console.log(res?.data, 'Saved successfully');

        // Show the first message in snackbar
        if (showPopup) {
          const msg = res?.data?.message;
          setSuccessMsg(msg);
          successRef.current?.open();
        }

        // save returned id for future updates
        setLogReportId(res.data.data.id);

        // setInjuredCount(String(injuredValidCount));
        // setDeceasedCount(String(deceasedValidCount));
        // setMissingCount(String(missingValidCount));
      }
    } catch (e: any) {
      console.log('Save log report error', e.response);
      snackbar(e?.response?.data?.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (
    title: string,
    list: Person[],
    setList: Function,
    count: string,
    setCount: Function,
    isInjured = false,
  ) => {
    return (
      <View style={styles.sectionBox}>
        {/* Title */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <Text style={styles.label}>{title}</Text>

          <TextInput
            editable={!isSubmitted}
            style={[
              styles.countInput,
              isSubmitted && { backgroundColor: COLOR.gray },
            ]}
            keyboardType="number-pad"
            value={count}
            onChangeText={text => {
              if (!isNaN(Number(text))) {
                setCount(text);
              }
            }}
          />
        </View>

        {/* Rows */}
        {list.map((item, index) => {
          const isLast = index === list.length - 1;

          return (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{TEXT.name()}</Text>

                  <TextInput
                    editable={!isSubmitted}
                    style={[
                      styles.input,
                      isSubmitted && { backgroundColor: COLOR.gray },
                    ]}
                    placeholder={TEXT.enter_name()}
                    value={item.name}
                    onChangeText={text =>
                      updatePerson(list, setList, index, 'name', text)
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{TEXT.address()}</Text>
                  <TextInput
                    editable={!isSubmitted}
                    style={[
                      styles.input,
                      isSubmitted && { backgroundColor: COLOR.gray },
                    ]}
                    placeholder={TEXT.enter_address()}
                    value={item.address}
                    onChangeText={text =>
                      updatePerson(list, setList, index, 'address', text)
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
                {/* Gender */}
                <View style={{ flex: 1, marginRight: 4 }}>
                  <Text style={styles.label}>{TEXT.gender()}</Text>
                  <TextInput
                    editable={!isSubmitted}
                    style={[
                      styles.input,
                      isSubmitted && { backgroundColor: COLOR.gray },
                    ]}
                    placeholder={TEXT.enter_gender()}
                    value={item.gender}
                    onChangeText={text =>
                      updatePerson(list, setList, index, 'gender', text)
                    }
                  />
                </View>

                {/* Age */}
                <View style={{ flex: 1, marginLeft: 4 }}>
                  <Text style={styles.label}>{TEXT.age()}</Text>
                  <TextInput
                    editable={!isSubmitted}
                    style={[
                      styles.input,
                      isSubmitted && { backgroundColor: COLOR.gray },
                    ]}
                    placeholder={TEXT.enter_age()}
                    keyboardType="numeric"
                    value={item.age}
                    onChangeText={text =>
                      updatePerson(list, setList, index, 'age', text)
                    }
                  />
                </View>

                {/* Delete */}
                {!isSubmitted && !isInjured && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removePerson(list, setList, index)}
                  >
                    <Text style={styles.iconText}>✕</Text>
                  </TouchableOpacity>
                )}

                {/* Add */}
                {isLast && !isSubmitted && !isInjured && (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addPerson(list, setList)}
                  >
                    <Text style={styles.iconText}>＋</Text>
                  </TouchableOpacity>
                )}
              </View>

              {isInjured && (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{TEXT.type_of_injury()}</Text>
                    <TextInput
                      editable={!isSubmitted}
                      style={[
                        styles.input,
                        isSubmitted && { backgroundColor: COLOR.gray },
                      ]}
                      placeholder={TEXT.enter_type_of_injury()}
                      value={item.type_of_injury}
                      onChangeText={text =>
                        updatePerson(
                          list,
                          setList,
                          index,
                          'type_of_injury',
                          text,
                        )
                      }
                    />
                  </View>

                  {!isSubmitted && (
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removePerson(list, setList, index)}
                    >
                      <Text style={styles.iconText}>✕</Text>
                    </TouchableOpacity>
                  )}

                  {isLast && !isSubmitted && (
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => addPerson(list, setList)}
                    >
                      <Text style={styles.iconText}>＋</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      {/* COMMON APP HEADER */}
      <DashBoardHeader drawer={false} setDrawer={() => {}} />

      {/* TITLE BAR */}
      <View style={styles.titleBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackArrow />
        </TouchableOpacity>

        <Text style={styles.title}>{TEXT.log_report()}</Text>

        <View style={styles.backButton} />
      </View>
      <View style={styles.container}>
        {loading ? (
          <ScreenLoader />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <View
              style={{
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={styles.sectionTitle}>
                {TEXT.impact_human_population()}
              </Text>
            </View>

            {renderSection(
              TEXT.no_of_deceased(),
              deceasedList,
              setDeceasedList,
              deceasedCount,
              setDeceasedCount,
            )}

            {renderSection(
              TEXT.no_of_injured(),
              injuredList,
              setInjuredList,
              injuredCount,
              setInjuredCount,
              true,
            )}

            {renderSection(
              TEXT.no_of_missing(),
              missingList,
              setMissingList,
              missingCount,
              setMissingCount,
            )}

            {/* Footer */}
            <View>
              {/* Save + Next row */}
              <View style={styles.topButtonRow}>
                <ReuseButton
                  text={TEXT.save()}
                  onPress={() => handleSave(true)}
                  disabled={loading || isSubmitted}
                  style={{
                    width: WIDTH(40),
                    alignSelf: 'center',
                    opacity: loading || isSubmitted ? 0.6 : 1,
                  }}
                />

                <ReuseButton
                  text={TEXT.next()}
                  onPress={handleNext}
                  disabled={loading}
                  style={{ width: WIDTH(40), alignSelf: 'center' }}
                />
              </View>

              {/* Close button center */}
              <ReuseButton
                text={TEXT.close()}
                bgColor="#E5E7EB"
                textColor={COLOR.white}
                onPress={() => navigation.pop()}
                style={[
                  styles.closeButton,
                  {
                    width: WIDTH(40),
                    alignSelf: 'center',
                  },
                ]}
              />
            </View>
          </ScrollView>
        )}

        {/* Footer */}
      </View>
      <SuccessSheet ref={successRef} message={successMsg} showOk={false} />
    </SafeAreaView>
  );
};

export default HumanImpactScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: { color: COLOR.blue },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  content: { padding: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: COLOR.textGrey,
    fontFamily: FONT.R_SBD_600,
  },

  label: {
    fontSize: 16,
    marginBottom: 6,
    color: COLOR.textGrey,
    fontFamily: FONT.R_MED_500,
  },

  countBox: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#F2F2F2',
    marginBottom: 12,
  },

  countText: {
    fontSize: 14,
    fontWeight: '600',
  },

  card: {
    // borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    // padding: 10,
    marginBottom: 12,
  },
  closeWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    height: 45,
  },

  addBtn: {
    width: 45,
    height: 45,
    marginLeft: 2,
    backgroundColor: COLOR.blue,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteBtn: {
    width: 45,
    height: 45,
    marginLeft: 8,
    backgroundColor: COLOR.red,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  primaryBtn: {
    flex: 1,
    backgroundColor: COLOR.blue,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },

  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.blue,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.blue,
  },
  closeButton: {
    width: '60%',
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: COLOR.textGrey,
  },

  primaryText: { color: '#fff', fontWeight: '600' },
  secondaryText: { color: COLOR.blue, fontWeight: '600' },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  countLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#374151',
  },

  countInput: {
    width: '50%',
    height: 45,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },

  topButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8, // 👈 controlled spacing
    gap: 10,
  },

  halfButton: {
    width: '48%',
    height: 44, // 👈 fixed height like Figma
  },
  label: {
    fontSize: 14,
    color: COLOR.textGrey,
    marginBottom: 6,
    fontFamily: FONT.R_SBD_600,
  },
  sectionBox: {
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',

    padding: 2,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
});
