import React, { forwardRef, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { TEXT } from '../../i18n/locales/Text';
import { useNavigation } from '@react-navigation/native';
import { FONT, WIDTH } from '../../themes/AppConst';
import TimelineSheet from './TimelineSheet';

const IncidentRecordsSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  ({}, ref) => {
    const navigation = useNavigation();
    const { user, userToken } = useSelector((state: RootState) => state.auth);

    const [myIncident, setMyIncident] = useState([]);
    const [assignedIncident, setAssignedIncident] = useState([]);
    const [isAssignedTab, setIsAssignedTab] = useState<boolean>(false);

    const [refreshing, setRefreshing] = useState(false);

    const timelineRef = useRef<RBSheet>(null);

    const timelineData = [
      {
        role: 'Guest',
        status: 'Incident Registered',
        incidentType: 'Fire',
        date: '10 April 2025, 5:12 PM',
        location: 'Sitabardi, Nagpur',
      },
      {
        role: 'Reviewer',
        status: 'Incident Accepted',
        incidentType: 'Fire',
        date: '10 April 2025, 5:14 PM',
        location: 'Sitabardi, Nagpur',
        details: [
          { title: 'Disaster Management Officer', name: 'Akshay Shinde' },
        ],
      },
      {
        role: 'Responder',
        status: 'Incident Accepted',
        incidentType: 'Fire',
        date: '10 April 2025, 5:16 PM',
        location: 'Sitabardi, Nagpur',
        details: [
          { title: 'Police officer', name: 'Avinash Kakade, Kiran Kamat' },
          {
            title: 'Ambulance',
            name: 'Vijay Satpute, Government Hospital, Sitabardi',
          },
        ],
      },
      {
        role: 'Responder',
        status: 'Incident Resolved',
        incidentType: 'Fire',
        date: '10 April 2025, 6:20 PM',
        location: 'Sitabardi, Nagpur',
      },
    ];

    // --- Fetch API ---
    const fetchIncidentList = async () => {
      try {
        const resp = await ApiManager.incidentList(userToken);
        if (resp?.data?.success) {
          const results = resp?.data?.data?.results || [];

          setMyIncident(results.filter((i: any) => i.user_id === user?.id));
          setAssignedIncident(
            results.filter((i: any) => i.user_id !== user?.id),
          );
        }
      } catch (err) {
        console.error('Error fetching incident list:', err);
      }
    };

    // useEffect(() => {
    //   fetchIncidentList();
    // }, [userToken]);

    const refreshIncidents = async () => {
      await fetchIncidentList();
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchIncidentList();
      setRefreshing(false);
    };

    const formatDateTime = (isoString: string) => {
      if (!isoString) return '';
      const date = new Date(isoString);

      return (
        'Date: ' +
        date.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }) +
        '   Time: ' +
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };

    const renderStatus = (status: string | undefined) => {
      const statusColors: Record<string, string> = {
        'Pending Review': '#EADCA7',
        Rejected: '#FF4930',
        New: '#A5F3B9',
      };

      const bg = statusColors[status ?? ''] || '#ddd';

      return (
        <View style={[styles.statusBadge, { backgroundColor: bg }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      );
    };

    const renderItem = ({ item }: any) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            (ref as { current: any } | null)?.current?.close();
            navigation.navigate('incidentDetails', {
              data: item.id,
            });
          }}
          style={styles.card}
        >
          <View style={styles.headerRow1}>
            <Text style={styles.incidentId}>
              {TEXT.incident_id()} - {item.incident_id}
            </Text>

            {renderStatus(item.status)}
          </View>

          <Text style={styles.title}>{item.incident_type_name}</Text>
          <Text style={styles.location}>{item.address}</Text>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.date}>{formatDateTime(item.created_on)}</Text>

            {item.status === 'New' && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isAssignedTab ? COLOR.blue : COLOR.blue,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: isAssignedTab ? COLOR.white : COLOR.white },
                  ]}
                >
                  {isAssignedTab ? 'View' : 'Edit'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: COLOR.textGrey,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 3,
              }}
              onPress={() => timelineRef.current?.open()}
            >
              <Text style={{ fontSize: 11, fontFamily: FONT.R_MED_500 }}>
                Timeline
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />
        </TouchableOpacity>
      );
    };

    const listData = isAssignedTab ? assignedIncident : myIncident;

    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={600}
        onOpen={refreshIncidents}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          <View style={styles.headerRow}>
            <Text style={styles.titleHeader}>{TEXT.incident_records()}</Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => (ref as { current: any })?.current?.close()}
            >
              <Image
                source={require('../../assets/cancel.png')}
                style={{ width: WIDTH(8), height: WIDTH(8) }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                !isAssignedTab && styles.tabActive,
                { width: WIDTH(43) },
              ]}
              onPress={() => setIsAssignedTab(false)}
            >
              <Text
                style={[styles.tabText, !isAssignedTab && styles.tabTextActive]}
              >
                {TEXT.my_incident_records()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                isAssignedTab && styles.tabActive,
                { width: WIDTH(49) },
              ]}
              onPress={() => setIsAssignedTab(true)}
            >
              <Text
                style={[styles.tabText, isAssignedTab && styles.tabTextActive]}
              >
                {/* {TEXT.assigned_incident_records()} */}
                {TEXT.other_incident_records()}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item: any, index) =>
              item?.id?.toString() || index.toString()
            }
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, marginTop: 10 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 50,
                }}
              >
                <Text
                  style={{
                    color: COLOR.textGrey,
                    fontSize: 16,
                    fontFamily: FONT.R_SBD_600,
                  }}
                >
                  {TEXT.no_incident_records()}
                </Text>
              </View>
            }
          />
        </View>
        <TimelineSheet ref={timelineRef} timelineData={timelineData} />
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
    paddingHorizontal: WIDTH(4),
    flex: 1,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
    position: 'absolute', // keeps text in center
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F2F5FA',
    borderRadius: 10,
    marginBottom: 10,
  },
  tabButton: {
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

  card: { marginBottom: 10 },

  incidentId: {
    fontSize: 13,
    color: COLOR.textGrey,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  headerRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
  title: {
    color: COLOR.blue,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  location: { color: '#666', fontSize: 14 },
  date: { fontSize: 12, color: '#777', marginTop: 2 },
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
    color: COLOR.textGrey,
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 120,
  },
});

export default IncidentRecordsSheet;
