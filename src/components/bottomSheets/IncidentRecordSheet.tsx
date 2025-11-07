import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { HEIGHT } from '../../themes/AppConst';

interface Incident {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: 'Pending Review' | 'Rejected' | 'New' | 'Edit';
}

const formatDateTime = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `Date: ${formattedDate}   Time: ${formattedTime}`;
};

const IncidentRecordsSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  ({}, ref) => {
    const { userToken } = useSelector((state: RootState) => state.auth);

    const [incidentList, setIncidentList] = useState<Incident[]>([]);
    const [isAssignedTab, setIsAssignedTab] = useState<boolean>(false);

    useEffect(() => {
      const fetchIncidentList = async () => {
        try {
          const resp = await ApiManager.incidentList(userToken);
          if (resp?.data?.success) {
            setIncidentList(resp?.data?.data?.results);
          }
        } catch (err) {
          console.error('Error fetching incident list:', err);
        }
      };

      fetchIncidentList();
    }, [userToken]);

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

    const renderItem = ({ item }: any) => (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.incidentId}>
            Incident ID - {item.incident_id}
          </Text>
          {renderStatus(item.status)}
        </View>
        <Text style={styles.title}>{item.incident_type_name}</Text>
        <Text style={styles.location}>{item.address}</Text>
        <Text style={styles.date}>{formatDateTime(item.created_on)}</Text>
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
              style={[styles.tabButton, !isAssignedTab && styles.tabActive]}
              onPress={() => setIsAssignedTab(false)}
            >
              <Text
                style={[styles.tabText, !isAssignedTab && styles.tabTextActive]}
              >
                My Incident Records
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, isAssignedTab && styles.tabActive]}
              onPress={() => setIsAssignedTab(true)}
            >
              <Text
                style={[styles.tabText, isAssignedTab && styles.tabTextActive]}
              >
                Assigned Incident Records
              </Text>
            </TouchableOpacity>
          </View>

          {/* Incident List */}
          {isAssignedTab ? (
            <FlatList
              data={incidentList}
              renderItem={renderItem}
              contentContainerStyle={{ marginTop: 10 }}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No incident records found</Text>
            </View>
          )}
        </View>
      </RBSheet>
    );
  },
);

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
    marginBottom: 10,
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
    textAlign: 'center',
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
    marginBottom: 5,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: HEIGHT(26),
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 500,
  },
});

export default IncidentRecordsSheet;
