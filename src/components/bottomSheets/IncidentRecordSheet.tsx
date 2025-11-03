import React, { forwardRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';

interface Incident {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: 'Pending Review' | 'Rejected' | 'New' | 'Edit';
}

interface Props {}

const incidents: Incident[] = [
  {
    id: 'NAG-060825-CT-780',
    title: 'Fire',
    location: 'Sitabardi, Nagpur',
    date: '08 April 2025',
    time: '5:10 PM',
    status: 'Pending Review',
  },
  {
    id: 'NAG-060825-CT-643',
    title: 'Landslide',
    location: 'Reshim Bagh, Nagpur',
    date: '08 April 2025',
    time: '5:10 PM',
    status: 'Rejected',
  },
  {
    id: 'NAG-060825-CT-970',
    title: 'Accident',
    location: 'MIDC, Nagpur',
    date: '10 April 2025',
    time: '6:20 PM',
    status: 'Edit',
  },
  {
    id: 'NAG-060825-CT-435',
    title: 'Flood',
    location: 'Manish Nagar, Nagpur',
    date: '17 May 2024',
    time: '2:20 PM',
    status: 'Pending Review',
  },
];

const IncidentRecordsSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  Props
>(({}, ref) => {
  const [tab, setTab] = useState<'my' | 'assigned'>('my');

  const renderStatus = (status: Incident['status']) => {
    const bgColor =
      status === 'Pending Review'
        ? '#EADCA7'
        : status === 'Rejected'
        ? '#FF4930'
        : status === 'New'
        ? '#A5F3B9'
        : status === 'Edit'
        ? '#105AAA'
        : '#ddd';

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Incident }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.incidentId}>Incident ID - {item.id}</Text>
        {renderStatus(item.status)}
      </View>
      <TouchableOpacity>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.date}>
        Date: {item.date} Time: {item.time}
      </Text>
      <View style={styles.divider} />
    </View>
  );

  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={600}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        <View style={styles.dragIndicator} />

        <Text style={styles.titleHeader}>Incident Records</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'my' && styles.tabActive]}
            onPress={() => setTab('my')}
          >
            <Text
              style={[styles.tabText, tab === 'my' && styles.tabTextActive]}
            >
              My Incident Records
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'assigned' && styles.tabActive]}
            onPress={() => setTab('assigned')}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'assigned' && styles.tabTextActive,
              ]}
            >
              Assigned Incident Records
            </Text>
          </TouchableOpacity>
        </View>

        {/* Incident List */}
        <FlatList
          data={incidents}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
    textAlign: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F2F5FA',
    borderRadius: 10,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLOR.blue,
    borderRadius: 8,
  },
  tabText: {
    color: COLOR.blue,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  card: {
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  incidentId: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  title: {
    color: COLOR.blue,
    fontSize: 16,
    fontWeight: '700',
  },
  location: {
    color: '#666',
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default IncidentRecordsSheet;
