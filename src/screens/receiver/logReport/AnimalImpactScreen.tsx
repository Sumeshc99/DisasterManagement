import React, { useEffect, useState } from 'react';
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
import { useRoute } from '@react-navigation/native';

import { COLOR } from '../../../themes/Colors';
import DashBoardHeader from '../../../components/header/DashBoardHeader';
import BackArrow from '../../../assets/svg/backArrow.svg';
import ReuseButton from '../../../components/UI/ReuseButton';
import ApiManager from '../../../apis/ApiManager';
import { RootState } from '../../../store/RootReducer';
import { TEXT } from '../../../i18n/locales/Text';

interface AnimalItem {
  name_of_village: string;
  type_of_animal: string;
  count_of_injured: string;
  count_of_deceased: string;
  count_of_missing: string;
}

const getEmptyAnimal = (): AnimalItem => ({
  name_of_village: '',
  type_of_animal: '',
  count_of_injured: '',
  count_of_deceased: '',
  count_of_missing: '',
});

const AnimalImpactScreen = ({ navigation }: any) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const route = useRoute<any>();
  const { incident_id } = route.params;

  const [logReportId, setLogReportId] = useState<number | null>(null);
  const [animals, setAnimals] = useState<AnimalItem[]>([getEmptyAnimal()]);

  /* ---------------- GET REPORT ---------------- */
  useEffect(() => {
    if (incident_id && userToken) {
      getLogReport();
    }
  }, [incident_id, userToken]);

  const getLogReport = async () => {
    try {
      const res = await ApiManager.getLogReport(incident_id, userToken);
      if (!res?.data?.status) return;

      const data = res.data.data;

      // CASE: No log report yet
      if (data?.status === false || data?.animal_counts === undefined) {
        setLogReportId(null);
        setAnimals([getEmptyAnimal()]);
        return;
      }

      // CASE: Log report exists
      const logId = data.id ?? data.log_report_id; // handle both API formats
      setLogReportId(logId);

      if (data.animal_counts?.length) {
        setAnimals(
          data.animal_counts.map((a: any) => ({
            name_of_village: a.name_of_village ?? '',
            type_of_animal: a.type_of_animal ?? '',
            count_of_injured: String(a.count_of_injured ?? ''),
            count_of_deceased: String(a.count_of_deceased ?? ''),
            count_of_missing: String(a.count_of_missing ?? ''),
          })),
        );
      } else {
        setAnimals([getEmptyAnimal()]);
      }
    } catch (e) {
      console.log('Animal GET error', e);
    }
  };

  /* ---------------- UPDATE HELPERS ---------------- */
  const updateField = (index: number, key: keyof AnimalItem, value: string) => {
    const updated = [...animals];
    updated[index][key] = value;
    setAnimals(updated);
  };

  const addAnimal = () => setAnimals(prev => [...prev, getEmptyAnimal()]);

  const removeAnimal = (index: number) => {
    const updated = animals.filter((_, i) => i !== index);
    setAnimals(updated.length ? updated : [getEmptyAnimal()]);
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!incident_id || !user?.id) return;

    const payload = {
      incident_log_report_id: logReportId, // null first time
      incident_id,
      user_id: user.id,
      submit_status: 'pending',
      animal_counts: animals.map(a => ({
        name_of_village: a.name_of_village,
        type_of_animal: a.type_of_animal,
        count_of_injured: Number(a.count_of_injured || 0),
        count_of_deceased: Number(a.count_of_deceased || 0),
        count_of_missing: Number(a.count_of_missing || 0),
      })),
    };

    try {
      const res = await ApiManager.createIncidentLogReport(payload, userToken);
      if (res?.data?.status) {
        setLogReportId(res.data.data.id); // IMPORTANT: save returned id
        console.log('Animal data saved!');
      }
    } catch (e) {
      console.log('Animal SAVE error', e);
    }
  };

  const handleNext = async () => {
    await handleSave();
    navigation.navigate('InfrastructureReportScreen', { incident_id });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.blue} />
      <DashBoardHeader drawer={false} setDrawer={() => {}} />

      {/* HEADER */}
      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.title}>{TEXT.log_report()}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>
            {TEXT.impact_animal_population()}
          </Text>

          {animals.map((item, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <TextInput
                style={styles.input}
                placeholder={TEXT.name_of_village()}
                value={item.name_of_village}
                onChangeText={t => updateField(index, 'name_of_village', t)}
              />
              <TextInput
                style={styles.input}
                placeholder={TEXT.type_of_animal()}
                value={item.type_of_animal}
                onChangeText={t => updateField(index, 'type_of_animal', t)}
              />
              <TextInput
                style={styles.input}
                placeholder={TEXT.count_of_injured()}
                keyboardType="number-pad"
                value={item.count_of_injured}
                onChangeText={t => updateField(index, 'count_of_injured', t)}
              />
              <TextInput
                style={styles.input}
                placeholder={TEXT.count_of_deceased()}
                keyboardType="number-pad"
                value={item.count_of_deceased}
                onChangeText={t => updateField(index, 'count_of_deceased', t)}
              />

              {/* Missing + / X */}
              <View style={styles.inlineRow}>
                <TextInput
                  style={[styles.input, styles.flexInput]}
                  placeholder={TEXT.count_of_missing()}
                  keyboardType="number-pad"
                  value={item.count_of_missing}
                  onChangeText={t => updateField(index, 'count_of_missing', t)}
                />

                {index === animals.length - 1 ? (
                  <TouchableOpacity
                    style={[styles.inlineBtn, { backgroundColor: COLOR.blue }]}
                    onPress={addAnimal}
                  >
                    <Text style={styles.inlinePlus}>＋</Text>
                  </TouchableOpacity>
                ) : (
                  animals.length > 1 && (
                    <TouchableOpacity
                      style={[styles.inlineBtn, { backgroundColor: COLOR.red }]}
                      onPress={() => removeAnimal(index)}
                    >
                      <Text style={styles.inlineCross}>×</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.topButtonRow}>
            <ReuseButton
              text={TEXT.save()}
              onPress={handleSave}
              style={styles.half}
            />
            <ReuseButton
              text={TEXT.next()}
              onPress={handleNext}
              style={styles.half}
            />
          </View>
          <View style={styles.closeWrapper}>
            <ReuseButton
              text={TEXT.close()}
              bgColor="#E5E7EB"
              textColor={COLOR.white}
              onPress={() => navigation.goBack()}
              style={styles.closeBtn}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AnimalImpactScreen;

// --- keep your existing styles ---

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

  titleBar: {
    backgroundColor: COLOR.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: COLOR.blue },

  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },

  footer: { padding: 16 },
  topButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: { width: '48%' },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  flexInput: {
    flex: 1,
    marginBottom: 0,
  },

  inlineBtn: {
    width: 44,
    height: 44,
    marginLeft: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 12,
  },
  closeBtn: {
    width: '60%',
    backgroundColor: COLOR.textGrey,
  },
});
