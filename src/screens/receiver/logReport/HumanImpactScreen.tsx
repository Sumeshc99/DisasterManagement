import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/RootReducer';
import { FONT, WIDTH } from '../../../themes/AppConst';

interface Person {
  name: string;
  age: string;
  gender: string;
  address: string;
}

const emptyPerson: Person = {
  name: '',
  age: '',
  gender: '',
  address: '',
};

const HumanImpactScreen = ({ navigation }: any) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [deceasedCount, setDeceasedCount] = useState('0');
  const [deceasedList, setDeceasedList] = useState<Person[]>([]);

  const [injuredCount, setInjuredCount] = useState('0');
  const [injuredList, setInjuredList] = useState<Person[]>([]);

  const [missingCount, setMissingCount] = useState('0');
  const [missingList, setMissingList] = useState<Person[]>([]);

  type HumanImpactRouteParams = {
    HumanImpactScreen: {
      incidentId: number;
    };
  };
  const route =
    useRoute<RouteProp<HumanImpactRouteParams, 'HumanImpactScreen'>>();

  const incidentId = route.params?.incidentId;
  console.log(incidentId, 'on Humannnnnn');

  const userId = user?.id;
  const token = userToken;

  const [logReportId, setLogReportId] = useState<number | null>(null);

  const getLogReportData = async () => {
    try {
      const res = await ApiManager.getLogReport(incidentId, token);

      if (res?.data?.status === false) {
        console.log('No existing log report, fresh entry');

        // reset everything for fresh entry
        setInjuredList([]);
        setInjuredCount('0');

        setDeceasedList([]);
        setDeceasedCount('0');

        setMissingList([]);
        setMissingCount('0');

        setLogReportId(null);
        return;
      }

      if (res?.data?.status) {
        const data = res.data.data;

        // Injured
        if (data.injured_names?.length) {
          setInjuredList(
            data.injured_names.map((p: any) => ({
              name: p.name ?? '',
              age: p.age ?? '',
              gender: p.gender ?? '',
              address: p.address ?? '',
            })),
          );
          setInjuredCount(String(data.injured_names.length));
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
          setDeceasedCount(String(data.deceased_names.length));
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
          setMissingCount(String(data.missing_names.length));
        }
      }
    } catch (e) {
      console.log('GET log report error', e);
    }
  };

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

  const onCountChange = (
    value: string,
    setCount: Function,
    setList: Function,
    currentList: Person[],
  ) => {
    const num = Number(value);

    // ❌ invalid number
    if (isNaN(num) || num < 0) return;

    // ✅ IMPORTANT: if same length, DO NOTHING
    if (num === currentList.length) {
      setCount(value);
      return;
    }

    setCount(value);

    const newList = Array.from({ length: num }, () => ({
      ...emptyPerson,
    }));

    setList(newList);
  };

  const addPerson = (
    list: Person[],
    setList: Function,
    count: string,
    setCount: Function,
  ) => {
    setList([...list, { ...emptyPerson }]);
    setCount(String(Number(count) + 1));
  };

  const removePerson = (
    list: Person[],
    setList: Function,
    count: string,
    setCount: Function,
    index: number,
  ) => {
    const updated = list.filter((_, i) => i !== index);
    setList(updated);
    setCount(String(updated.length));
  };
  const handleClose = () => {
    navigation.goBack();
  };
  const handleNext = () => {
    navigation.navigate('AnimalImpactScreen', {
      incident_id: incidentId,
      log_report_id: logReportId,
    });
  };
  const handleSave = async () => {
    if (!incidentId || !userId) {
      console.log('Missing incidentId or userId');
      return;
    }

    const payload = {
      incident_log_report_id: logReportId, // null for first time
      incident_id: incidentId,
      user_id: userId,
      submit_status: 'pending',
      type_of_injury: 'injured',

      injured_count: injuredList.length,
      injured_names: injuredList,

      deceased_count: deceasedList.length,
      deceased_names: deceasedList,

      missing_count: missingList.length,
      missing_names: missingList,
    };

    try {
      const res = await ApiManager.createIncidentLogReport(payload, token);

      if (res?.data?.status) {
        console.log('Saved successfully');

        // save returned id for future updates
        setLogReportId(res.data.data.id);
      }
    } catch (e) {
      console.log('Save log report error', e);
    }
  };

  const renderSection = (
    title: string,
    list: Person[],
    setList: Function,
    count: string,
    setCount: Function,
  ) => {
    return (
      <View style={{ marginBottom: 24 }}>
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
            style={styles.countInput}
            keyboardType="number-pad"
            value={count}
            onChangeText={text => onCountChange(text, setCount, setList, list)}
          />
        </View>

        {/* Rows */}
        {list.map((item, index) => {
          const isLast = index === list.length - 1;

          return (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={item.name}
                  onChangeText={text =>
                    updatePerson(list, setList, index, 'name', text)
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={item.address}
                  onChangeText={text =>
                    updatePerson(list, setList, index, 'address', text)
                  }
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Gender"
                  value={item.gender}
                  onChangeText={text =>
                    updatePerson(list, setList, index, 'gender', text)
                  }
                />
                <TextInput
                  style={[styles.input, { width: 60 }]}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={item.age}
                  onChangeText={text =>
                    updatePerson(list, setList, index, 'age', text)
                  }
                />

                {/* Delete */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    removePerson(list, setList, count, setCount, index)
                  }
                >
                  <Text style={styles.iconText}>✕</Text>
                </TouchableOpacity>

                {/* Add (ONLY last row) */}
                {isLast && (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => addPerson(list, setList, count, setCount)}
                  >
                    <Text style={styles.iconText}>＋</Text>
                  </TouchableOpacity>
                )}
              </View>
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

        <Text style={styles.title}>Log Report</Text>

        <View style={styles.backButton} />
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View
            style={{
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={styles.sectionTitle}>Impact on Human Population</Text>
          </View>

          {renderSection(
            'Number of Deceased',
            deceasedList,
            setDeceasedList,
            deceasedCount,
            setDeceasedCount,
          )}

          {renderSection(
            'Number of Injured',
            injuredList,
            setInjuredList,
            injuredCount,
            setInjuredCount,
          )}

          {renderSection(
            'Number of Missing',
            missingList,
            setMissingList,
            missingCount,
            setMissingCount,
          )}
        </ScrollView>

        {/* Footer */}
        {/* Footer */}
        <View style={styles.footer}>
          {/* Save + Next row */}
          <View style={styles.topButtonRow}>
            <ReuseButton
              text="Save"
              onPress={handleSave}
              style={{ width: WIDTH(40), alignSelf: 'center' }}
            />

            <ReuseButton
              text="Next"
              onPress={handleNext}
              style={{ width: WIDTH(40), alignSelf: 'center' }}
            />
          </View>

          {/* Close button center */}
          <ReuseButton
            text="Close"
            bgColor="#E5E7EB"
            textColor={COLOR.white}
            onPress={handleClose}
            style={[
              styles.closeButton,
              {
                width: WIDTH(50),
                alignSelf: 'center',
              },
            ]}
          />
        </View>
      </View>
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
  backText: { color: COLOR.primary },
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
    fontSize: 14,
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
    alignItems: 'center',
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
  },

  addBtn: {
    width: 34,
    height: 34,
    marginLeft: 2,
    backgroundColor: COLOR.blue,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteBtn: {
    width: 34,
    height: 34,
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
    backgroundColor: COLOR.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },

  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.primary,
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
  secondaryText: { color: COLOR.primary, fontWeight: '600' },
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
    width: 64, // 👈 IMPORTANT (small box)
    height: 36,
    borderWidth: 1,
    borderColor: '#D1D5DB', // 👈 Grey border like Figma
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0, // 👈 prevents vertical misalignment
  },

  footer: {
    paddingHorizontal: 16,
    //paddingTop: 12,
    //paddingBottom: 8, // 👈 reduces bottom gap
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
});
