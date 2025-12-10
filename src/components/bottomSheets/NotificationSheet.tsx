import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import ApiManager from '../../apis/ApiManager';
import { FONT, WIDTH } from '../../themes/AppConst';
import { useNavigation } from '@react-navigation/native';
import { COLOR } from '../../themes/Colors';

interface NotificationItem {
  id: string;
  notification_text: string;
  created_at: string;
  status: string;
  incident_type_name: string;
  incident_id: string; // for navigation
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('en-GB')} Time: ${d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const NotificationSheet = forwardRef((props: any, ref) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!user?.id) return;
    ApiManager.notifications(user.id, userToken)
      .then(resp => {
        if (resp?.data?.status) {
          setNotifications(resp.data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (index: string) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };
  const navigateToIncident = (item: NotificationItem) => {
    ref?.current?.close();
    navigation.navigate('NotificationIncidentDetails', {
      incident_id: item.incident_id, // ⬅️ pass ID here
      notification_id: item.notification_id,
    });
  };

  // Group notifications by date
  const groupByDate = notifications.reduce(
    (acc: any, item: NotificationItem) => {
      const date = formatDate(item.created_at);
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {},
  );

  const groupedList = Object.entries(groupByDate);

  const renderItem = ([date, items]: [string, NotificationItem[]]) => (
    <View>
      <View style={styles.dateLabel}>
        <Text style={styles.dateLabelText}>{date}</Text>
      </View>

      {items.map((item, idx) => {
        const key = `${date}-${idx}`;
        const isExpanded = expandedItems[key];
        return (
          <TouchableOpacity
            key={idx}
            onPress={() => navigateToIncident(item)}
            style={styles.notificationContainer}
          >
            <Text
              numberOfLines={isExpanded ? undefined : 1}
              ellipsizeMode="tail"
              style={styles.notificationText}
            >
              {item.notification_text}
            </Text>

            <View style={styles.notificationFooter}>
              <Text style={styles.notificationTime}>
                {formatDateTime(item.created_at)}
              </Text>

              <TouchableOpacity
                style={styles.viewBtn}
                onPress={e => {
                  e.stopPropagation(); // prevent navigation when clicking View
                  toggleExpand(key);
                }}
              >
                <Text style={styles.viewBtnText}>
                  {isExpanded ? 'Hide' : 'View'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider line */}
            {idx !== items.length - 1 && <View style={styles.divider} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <RBSheet
      ref={ref}
      height={650}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        container: {
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          padding: 18,
          backgroundColor: '#fff',
        },
      }}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.titleHeader}>Notifications</Text>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => ref?.current?.close()}
        >
          <Image
            source={require('../../assets/cancel.png')}
            style={{ width: WIDTH(8), height: WIDTH(8) }}
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLOR.blue}
          style={{ marginTop: 40 }}
        />
      ) : notifications.length === 0 ? (
        <Text style={styles.emptyText}>No Notifications Found</Text>
      ) : (
        <FlatList
          data={groupedList}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },

  dateLabel: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginTop: 12,
  },
  dateLabelText: {
    fontFamily: FONT.R_SBD_600,
    fontSize: 14,
    color: COLOR.blue,
  },

  notificationContainer: {
    marginTop: 18,
    paddingBottom: 12,
  },
  notificationText: {
    fontFamily: FONT.R_MED_500,
    fontSize: 15,
    width: '78%',
    color: COLOR.blue,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 13,
    color: '#6E6E6E',
  },
  viewBtn: {
    borderWidth: 1,
    borderColor: COLOR.blue,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 20,
  },
  viewBtnText: {
    color: COLOR.blue,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 12,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
});

export default NotificationSheet;
