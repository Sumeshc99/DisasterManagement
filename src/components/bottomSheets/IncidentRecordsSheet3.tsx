import React, { forwardRef, useEffect, useState } from 'react';
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
import Filter from '../../assets/filter.svg';

const IncidentRecordsSheet3 = forwardRef<React.ComponentRef<typeof RBSheet>>(
  ({}, ref) => {
    const navigation = useNavigation();

    const { user, userToken } = useSelector((state: RootState) => state.auth);

    const [myIncident, setMyIncident] = useState([]);
    const [assignedIncident, setAssignedIncident] = useState([]);
    const [assignedInc, setAssignedInc] = useState([]);
    const [isAssignedTab, setIsAssignedTab] = useState<boolean>(false);

    const [showFilter, setShowFilter] = useState(false);
    const [incType, setIncType] = useState<0 | 1>(0);

    const [refreshing, setRefreshing] = useState(false);

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

    const getAssignedIncident = async () => {
      try {
        const resp = await ApiManager.assignedToResponder(user?.id, userToken);
        if (resp?.data?.status) {
          const results = resp?.data?.data || [];
          setAssignedInc(results);
        }
      } catch (err) {
        console.error('Error fetching assigned incidents:', err);
      }
    };

    useEffect(() => {
      fetchIncidentList();
      getAssignedIncident();
    }, [userToken]);

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchIncidentList();
      await getAssignedIncident();
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

    const renderItem = ({ item }: any) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          (ref as { current: any } | null)?.current?.close();
          navigation.navigate(
            !isAssignedTab ? 'incidentDetails' : 'resIncidentDetails',
            {
              data: item.id,
            },
          );
        }}
        style={styles.card}
      >
        <View style={styles.headerRow1}>
          <Text style={styles.incidentId}>
            {TEXT.incident_id()} - {item.incident_id}
          </Text>
          {renderStatus(item.status)}
        </View>

        <Text style={styles.cardTitle}>{item.incident_type_name}</Text>
        <Text style={styles.cardLocation}>{item.address}</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.cardDate}>{formatDateTime(item.created_on)}</Text>

          {item.status === 'New' && (
            <View style={[styles.statusBadge, { backgroundColor: COLOR.blue }]}>
              <Text style={[styles.statusText, { color: COLOR.white }]}>
                Edit
              </Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />
      </TouchableOpacity>
    );

    const listData = isAssignedTab
      ? assignedInc
      : incType === 0
      ? myIncident
      : assignedIncident;

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

          {/* ------------------- TABS -------------------- */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, !isAssignedTab && styles.tabActive]}
              onPress={() => setIsAssignedTab(false)}
            >
              <Text
                style={[styles.tabText, !isAssignedTab && styles.tabTextActive]}
              >
                {TEXT.my_incident_records()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton1, isAssignedTab && styles.tabActive]}
              onPress={() => setIsAssignedTab(true)}
            >
              <Text
                style={[styles.tabText, isAssignedTab && styles.tabTextActive]}
              >
                {TEXT.assigned_incident_records()}
              </Text>
            </TouchableOpacity>
          </View>

          {!isAssignedTab && (
            <View style={styles.filterRow}>
              <Filter />
              <Text style={styles.filterTitle}>{TEXT.filter()} :</Text>

              <View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowFilter(!showFilter)}
                  style={styles.filterDropdownButton}
                >
                  <Text style={styles.filterDropdownText}>
                    {incType === 0 ? TEXT.my_records() : TEXT.other_records()}
                  </Text>

                  <Text style={styles.dropdownArrow}>
                    {showFilter ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {/* DROPDOWN LIST */}
                {showFilter && (
                  <View style={styles.dropdownContainer}>
                    <Text
                      onPress={() => {
                        setIncType(0);
                        setShowFilter(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      {TEXT.my_incident()}
                    </Text>

                    <Text
                      onPress={() => {
                        setIncType(1);
                        setShowFilter(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      {TEXT.other_incident()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item: any, index) =>
              item?.id?.toString() || index.toString()
            }
            contentContainerStyle={{ paddingBottom: 30, marginTop: 10 }}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      </RBSheet>
    );
  },
);

export default IncidentRecordsSheet3;

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: COLOR.white,
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

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F2F5FA',
    borderRadius: 10,
    marginBottom: 10,
    width: WIDTH(92),
  },

  tabButton: {
    paddingVertical: 10,
    width: WIDTH(43),
    alignItems: 'center',
  },
  tabButton1: {
    paddingVertical: 10,
    width: WIDTH(49),
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLOR.blue,
    borderRadius: 10,
  },

  tabText: {
    color: COLOR.blue,
    fontFamily: FONT.R_MED_500,
  },

  tabTextActive: {
    color: COLOR.white,
    fontFamily: FONT.R_BOLD_700,
  },

  // Filter
  filterRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },

  filterTitle: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: FONT.R_BOLD_700,
    color: COLOR.darkGray,
  },

  filterDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 5,
  },

  filterDropdownText: {
    fontSize: 16,
    fontFamily: FONT.R_MED_500,
    color: COLOR.darkGray,
  },

  dropdownArrow: {
    fontSize: 16,
    color: COLOR.darkGray,
  },

  dropdownContainer: {
    position: 'absolute',
    backgroundColor: COLOR.white,
    zIndex: 10,
    borderWidth: 1,
    top: 26,
    left: 10,
    paddingHorizontal: 6,
    borderRadius: 4,
    borderColor: COLOR.darkGray,
    width: 130,
  },

  dropdownItem: {
    fontSize: 16,
    paddingVertical: 5,
    fontFamily: FONT.R_MED_500,
    color: COLOR.darkGray,
  },

  // Card
  card: { marginBottom: 10 },

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
  incidentId: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },

  cardTitle: {
    color: COLOR.blue,
    fontSize: 16,
    fontFamily: FONT.R_BOLD_700,
    marginBottom: 5,
  },

  cardLocation: {
    color: '#666',
    fontSize: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardDate: {
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
    color: COLOR.textGrey,
    fontSize: 11,
    fontFamily: FONT.R_BOLD_700,
    maxWidth: 120,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
});
