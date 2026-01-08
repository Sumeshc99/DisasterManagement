import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { COLOR } from '../../themes/Colors';
import { FONT, WIDTH } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';

interface Props {
  data: any;
}

const ReviewerTable = ({ title, data }: any) => {
  return (
    <View>
      <Text style={styles.reviewTitle}>{title}</Text>

      <View style={styles.tableContainer}>
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

/* ---------------- Common Components ---------------- */
const InfoRow = ({ label, value, rightNode }: any) => (
  <View style={styles.row}>
    <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
    {rightNode}
  </View>
);

const StatusBadge = () => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>Pending Review</Text>
  </View>
);

/* 🔹 ONLY CHANGE: editable input */
const InputBox = ({ label, value, onChangeText }: any) => (
  <View style={styles.inputBox}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      editable
      style={styles.grayInput}
    />
  </View>
);

const AddButton = () => (
  <TouchableOpacity style={styles.addBtn}>
    <Text style={styles.addText}>+</Text>
  </TouchableOpacity>
);

const DetailsAndLog: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'logs'>('details');

  const [logs, setLogs] = useState({
    injuredCount: '1',
    injuredName: 'Ram',
    deceasedCount: '1',
    deceasedName: 'Shyam',
    cow: '1',
    cat: '1',
    buffalo: '1',
    horse: '1',
    goat: '1',
    dog: '1',
    house: '1',
    shop: '1',
    petrolPump: '1',
  });

  const updateLog = (key: string, value: string) => {
    setLogs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'details' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('details')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'details' && styles.activeTabText,
            ]}
          >
            Incident Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'logs' && styles.activeTab]}
          onPress={() => setActiveTab('logs')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'logs' && styles.activeTabText,
            ]}
          >
            Logs Reports
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- Incident Details (UNCHANGED) ---------------- */}
      {activeTab === 'details' ? (
        <>
          <View style={styles.card}>
            <InfoRow
              label="Incident Id"
              value="NAG-060825-CT-970"
              rightNode={<StatusBadge />}
            />

            <View
              style={{
                marginTop: -8,
                marginBottom: 14,
                borderBottomWidth: 0.5,
                borderColor: COLOR.textGrey,
              }}
            />

            <InfoRow label="Date & Time" value="08/04/2025, 05:10 PM" />
            <InfoRow label="Incident Type" value="Fire" />
            <InfoRow
              label="Address"
              value="Civil Lines, Aaravati Road, Nagpur, MH, 440001"
            />
            <InfoRow label="Mobile Number" value="8626054838" />
            <InfoRow
              label="Description"
              value="Please help, there is a fire at my home"
            />

            <Text style={styles.sectionTitle}>Image & Video</Text>
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
                }}
                style={styles.image}
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.overlayText}>Image + 1</Text>
              </View>
            </View>
          </View>

          <View style={{ marginHorizontal: WIDTH(4), gap: 16 }}>
            {data?.reviewers?.length > 0 && (
              <ReviewerTable title={TEXT.reviewer()} data={data.reviewers} />
            )}
            {data?.responders?.length > 0 && (
              <ReviewerTable title={TEXT.responders()} data={data.responders} />
            )}
          </View>
        </>
      ) : (
        /* ---------------- Logs Reports (EDITABLE) ---------------- */
        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Impact on Human Population</Text>

          <View style={styles.rowTwo}>
            <InputBox
              label={TEXT.no_of_injured()}
              value={logs.injuredCount}
              onChangeText={(v: string) => updateLog('injuredCount', v)}
            />
            <InputBox
              label="Name of injured"
              value={logs.injuredName}
              onChangeText={(v: string) => updateLog('injuredName', v)}
            />
            <AddButton />
          </View>

          <View style={styles.rowTwo}>
            <InputBox
              label={TEXT.no_of_deceased()}
              value={logs.deceasedCount}
              onChangeText={(v: string) => updateLog('deceasedCount', v)}
            />
            <InputBox
              label="Name of deceased"
              value={logs.deceasedName}
              onChangeText={(v: string) => updateLog('deceasedName', v)}
            />
            <AddButton />
          </View>

          <Text style={styles.logTitle}>{TEXT.impact_animal_population()}</Text>

          <View style={styles.grid}>
            {['cow', 'cat', 'buffalo', 'horse', 'goat', 'dog'].map(key => (
              <InputBox
                key={key}
                label={key.toUpperCase()}
                value={(logs as any)[key]}
                onChangeText={(v: string) => updateLog(key, v)}
              />
            ))}
          </View>

          <Text style={styles.logTitle}>Damage Report</Text>

          <View style={styles.grid}>
            <InputBox
              label="House"
              value={logs.house}
              onChangeText={(v: string) => updateLog('house', v)}
            />
            <InputBox
              label="Shop"
              value={logs.shop}
              onChangeText={(v: string) => updateLog('shop', v)}
            />
            <InputBox
              label="Petrol Pump"
              value={logs.petrolPump}
              onChangeText={(v: string) => updateLog('petrolPump', v)}
            />
          </View>

          <View style={{ gap: 16 }}>
            {data?.reviewers?.length > 0 && (
              <ReviewerTable title={TEXT.reviewer()} data={data.reviewers} />
            )}
            {data?.responders?.length > 0 && (
              <ReviewerTable title={TEXT.responders()} data={data.responders} />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 20,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity style={[styles.submitButton]} onPress={() => ''}>
              <Text style={styles.submitButtonText}>{TEXT.save()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={() => ''}>
              <Text style={styles.submitButtonText}>{TEXT.submit()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default DetailsAndLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },

  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: WIDTH(4),
    backgroundColor: '#EAECEF',
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: COLOR.blue,
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONT.R_SBD_600,
    color: '#555',
  },
  activeTabText: {
    color: '#FFF',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: WIDTH(4),
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLOR.black,
    marginBottom: 4,
    fontFamily: FONT.R_MED_500,
    width: WIDTH(26),
  },
  value: {
    fontSize: 13,
    color: '#111',
    width: WIDTH(70),
  },

  badge: {
    backgroundColor: '#F1D27A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: '#6B5200',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
  },
  imageOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    top: '40%',
  },
  overlayText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },

  inputContainer: {
    margin: 16,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#DDD',
  },

  reviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.textGrey,
    marginBottom: 10,
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

  /////////
  logContainer: {
    marginHorizontal: WIDTH(4),
    marginTop: 16,
  },

  logTitle: {
    fontSize: 16,
    fontFamily: FONT.R_SBD_600,
    color: COLOR.textGrey,
    marginBottom: 10,
  },

  logSub: {
    fontSize: 13,
    color: COLOR.textGrey,
    marginBottom: 10,
  },

  rowTwo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  inputBox: {
    width: WIDTH(28),
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 13,
    marginBottom: 6,
    fontFamily: FONT.R_MED_500,
    color: COLOR.textGrey,
  },

  grayInput: {
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 0.5,
    borderColor: COLOR.darkGray,
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: COLOR.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 12,
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
});
