import React, { useMemo, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';
import { RootState } from '../../store/RootReducer';

import IncidentRecordsSheet from '../bottomSheets/IncidentRecordSheet';
import IncidentRecordsSheet2 from '../bottomSheets/IncidentRecordsSheet2';
import IncidentRecordsSheet3 from '../bottomSheets/IncidentRecordsSheet3';
import NotificationSheet from '../bottomSheets/NotificationSheet';
import TimelineSheet from '../bottomSheets/TimelineSheet';
import IncidentTypeSheet from '../bottomSheets/IncidentTypeSheet';

interface Props {
  drawer: boolean;
  setDrawer: (val: boolean) => void;
}

const DashBoardHeader: React.FC<Props> = ({ setDrawer }) => {
  const incidentSheetRef = useRef<any>(null);
  const notificationSheetRef = useRef<any>(null);
  const timelineSheetRef = useRef<any>(null);
  const showIncidentType = useRef<any>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(
    null,
  );

  /* ---------------------- Helpers ---------------------- */

  const userInitials = useMemo(() => {
    if (!user?.full_name) return 'UN';
    return user.full_name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  }, [user?.full_name]);

  const handleOpenTimeline = (incidentId: number) => {
    setSelectedIncidentId(incidentId);
    setTimeout(() => timelineSheetRef.current?.open(), 350);
  };

  const IncidentSheetComponent =
    user?.role === 'citizen'
      ? IncidentRecordsSheet
      : user?.role === 'reviewer'
      ? IncidentRecordsSheet2
      : IncidentRecordsSheet3;

  /* ---------------------- Render ---------------------- */

  return (
    <View style={styles.container}>
      {/* Left */}
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={styles.userCircle}
          onPress={() => setDrawer(true)}
        >
          <Text style={styles.userText}>{userInitials}</Text>
        </TouchableOpacity>

        <View style={styles.dosDontsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => showIncidentType?.current?.open()}
            style={styles.dosBtn}
          >
            <Text style={styles.btnText}>Do's</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => showIncidentType?.current?.open()}
            style={styles.dontsBtn}
          >
            <Text style={styles.btnText}>Don'ts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Logo */}
      <Image
        source={require('../../assets/appLogo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Right */}
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => incidentSheetRef.current?.open()}>
          <Image
            source={require('../../assets/alert.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => notificationSheetRef.current?.open()}>
          <Image
            source={require('../../assets/bell.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheets */}
      <IncidentSheetComponent
        ref={incidentSheetRef}
        onOpenTimeline={handleOpenTimeline}
      />

      <NotificationSheet ref={notificationSheetRef} />

      <TimelineSheet ref={timelineSheetRef} incidentId={selectedIncidentId} />

      <IncidentTypeSheet ref={showIncidentType} />
    </View>
  );
};

export default DashBoardHeader;

const styles = StyleSheet.create({
  container: {
    height: 70,
    paddingHorizontal: 15,
    backgroundColor: COLOR.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  logo: {
    position: 'absolute',
    width: 120,
    height: 60,
    left: '50%',
    transform: [{ translateX: -45 }],
  },

  icon: {
    width: 28,
    height: 28,
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

  dosDontsContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },

  dosBtn: {
    paddingHorizontal: 10,
    backgroundColor: '#71BC6A',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  dontsBtn: {
    paddingHorizontal: 8,
    backgroundColor: '#FF5757',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  btnText: {
    color: COLOR.white,
    fontFamily: FONT.R_MED_500,
    fontSize: 12,
  },

  divider: {
    width: 2,
    backgroundColor: '#fff',
  },
});
