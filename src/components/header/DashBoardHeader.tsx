import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOR } from '../../themes/Colors';
import IncidentRecordsSheet from '../bottomSheets/IncidentRecordSheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import IncidentRecordsSheet2 from '../bottomSheets/IncidentRecordsSheet2';
import IncidentRecordsSheet3 from '../bottomSheets/IncidentRecordsSheet3';
import NotificationSheet from '../bottomSheets/NotificationSheet';
import TimelineSheet from '../bottomSheets/TimelineSheet';

interface props {
  drawer: boolean;
  setDrawer: any;
}

const DashBoardHeader: React.FC<props> = ({ drawer, setDrawer }) => {
  const sheetRef = useRef<any>(null);
  const notificationSheetRef = useRef<any>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const timelineSheetRef = useRef<any>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(
    null,
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={require('../../assets/location.png')}
          style={styles.iconSmall}
        />
        <Text style={styles.locationText}>{user?.tehsil}</Text>
      </View>

      <Image
        source={require('../../assets/appLogo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => sheetRef.current?.open()}>
          <Image
            source={require('../../assets/alert.png')}
            style={styles.iconSmall1}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => notificationSheetRef.current?.open()}>
          <Image
            source={require('../../assets/bell.png')}
            style={styles.iconSmall1}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDrawer(true)}
          style={styles.userCircle}
        >
          <Text style={styles.userText}>
            {user?.full_name
              ? user.full_name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(word => word.charAt(0).toUpperCase())
                  .join('')
              : 'UN'}
          </Text>
        </TouchableOpacity>
      </View>

      {user?.role === 'citizen' ? (
        <IncidentRecordsSheet
          ref={sheetRef}
          onOpenTimeline={(incidentId: number) => {
            setSelectedIncidentId(incidentId);

            // Wait a little so first sheet is fully closed
            setTimeout(() => {
              timelineSheetRef.current?.open();
            }, 350);
          }}
        />
      ) : user?.role == 'reviewer' ? (
        <IncidentRecordsSheet2
          ref={sheetRef}
          onOpenTimeline={(incidentId: number) => {
            setSelectedIncidentId(incidentId);

            // Wait a little so first sheet is fully closed
            setTimeout(() => {
              timelineSheetRef.current?.open();
            }, 350);
          }}
        />
      ) : (
        <IncidentRecordsSheet3
          ref={sheetRef}
          onOpenTimeline={(incidentId: number) => {
            setSelectedIncidentId(incidentId);

            // Wait a little so first sheet is fully closed
            setTimeout(() => {
              timelineSheetRef.current?.open();
            }, 350);
          }}
        />
      )}

      <NotificationSheet ref={notificationSheetRef} />

      <TimelineSheet ref={timelineSheetRef} incidentId={selectedIncidentId} />
    </View>
  );
};

export default DashBoardHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 70,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  logo: {
    position: 'absolute',
    width: 120,
    height: 60,
    left: '50%',
    transform: [{ translateX: -45 }],
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconSmall: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  iconSmall1: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
  userCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    color: '#2B2B2B',
    fontWeight: '700',
  },
});
