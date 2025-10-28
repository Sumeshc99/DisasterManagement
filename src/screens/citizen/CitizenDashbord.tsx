import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import DashBoardHeader from '../../components/header/DashBoardHeader';
import OpenStreetMap from '../../components/OpenStreetMap';
import CompleteProfileSheet from '../../components/CompleteProfileSheet';
import ProfileReminder from '../../components/ProfileReminder';
import ApiManager from '../../apis/ApiManager';
import { COLOR } from '../../themes/Colors';
import { useBackExit } from '../../hooks/useBackExit';
import { RootState } from '../../store/RootReducer';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';

const CitizenDashboard = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const sheetRef = useRef<any>(null);
  const remindRef = useRef<any>(null);

  const { user, userToken } = useSelector((state: RootState) => state.auth);
  const [responderList, setResponderList] = useState<any[]>([]);

  useBackExit();

  useEffect(() => {
    const fetchResponderList = async () => {
      try {
        const resp = await ApiManager.responderList();
        if (resp?.data?.success) {
          setResponderList(resp?.data?.data?.results || []);
        }
      } catch (err) {
        console.error('Error fetching responder list:', err);
      }
    };

    fetchResponderList();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user?.full_name === '') {
        sheetRef.current?.open();
      } else if (!user?.is_registered) {
        remindRef.current?.open();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  const handleShortProfile = useCallback(
    async (data: any) => {
      const body = {
        mobile: user?.mobile_no,
        full_name: data.name,
        full_name_contact: data.emgName,
        mobile_no_contact: data.emgPhone,
      };

      try {
        const resp = await ApiManager.shortProfile(body, userToken);
        if (resp?.data?.status) {
          sheetRef.current?.close();
        }
      } catch (err: any) {
        console.error('Short profile update failed:', err?.response || err);
      } finally {
      }
    },
    [user, userToken],
  );

  /** Navigate to profile screen */
  const handleProfileReminder = useCallback(() => {
    remindRef.current?.close();
    navigation.navigate('profile');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader />

      <View style={styles.mapContainer}>
        <OpenStreetMap list={responderList} />
      </View>

      <CompleteProfileSheet
        ref={sheetRef}
        data=""
        submitData={handleShortProfile}
      />

      <ProfileReminder ref={remindRef} onUpdatePress={handleProfileReminder} />
    </SafeAreaView>
  );
};

export default CitizenDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
});
