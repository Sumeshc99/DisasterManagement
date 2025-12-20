import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import DashBoardHeader from '../../components/header/DashBoardHeader';
import OpenStreetMap from '../../components/OpenStreetMap';
import RespondersList from './pages/RespondersList';
import RightDrawer from '../../components/RightDrawer';

import HelplineDetails from '../../components/bottomSheets/HelplineDetails';
import CompleteProfileSheet from '../../components/bottomSheets/CompleteProfileSheet';
import ProfileReminder from '../../components/bottomSheets/ProfileReminder';
import ChangePinSheet from '../../components/bottomSheets/ChangePinSheet';
import SuccessScreen from '../../components/bottomSheets/SuccessScreen';

import { COLOR } from '../../themes/Colors';
import { RootState } from '../../store/RootReducer';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { setUser } from '../../store/slices/authSlice';
import ApiManager from '../../apis/ApiManager';
import GetCurrentLocation from '../../config/GetCurrentLocation';
import { useBackExit } from '../../hooks/useBackExit';

import Maps from '../../assets/svg/maps.svg';
import Weather from '../../assets/svg/wea.svg';
import Help from '../../assets/svg/help.svg';
import Dis from '../../assets/svg/dis.svg';
import { TEXT } from '../../i18n/locales/Text';
import ReviewerSection from '../receiver/ReviewerSection';
import ResponderSection from '../responder/ResponderSection';
import WeatherSheet from '../../components/bottomSheets/WeatherSheet';

const CitizenDashboard = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [incidentList, setIncidentList] = useState<any[]>([]);
  const [responders, setResponders] = useState<any[]>([]);
  const [showResponders, setShowResponders] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const route = useRoute();
  // const navigation = useNavigation();

  // useEffect(() => {
  //   if (route?.params?.responders) {
  //     setResponderListFromSheet(route?.params?.responders);
  //     // OPEN bottom sheet when data arrives
  //     responderSheetRef.current?.open();
  //   }
  // }, [route.params]);

  const sheetRef = useRef<any>(null);
  const remindRef = useRef<any>(null);
  const showHelpRef = useRef<any>(null);
  const changePassRef = useRef<any>(null);
  const successRef = useRef<any>(null);
  const responderSheetRef = useRef<any>(null);
  const weatherSheetRef = useRef<any>(null);

  GetCurrentLocation();
  useBackExit();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user?.full_name) {
        sheetRef.current?.open();
      } else if (!user?.is_registered) {
        remindRef.current?.open();
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [user]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     GetCurrentLocation();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  const fetchIncidentsAndResponders = useCallback(async () => {
    try {
      const [incidentsResp, respondersResp] = await Promise.all([
        ApiManager.incidentList(userToken),
        ApiManager.responderList(),
      ]);

      if (incidentsResp?.data?.success)
        setIncidentList(incidentsResp.data.data?.results ?? []);

      if (respondersResp?.data?.success)
        setResponders(respondersResp.data.data?.results ?? []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    fetchIncidentsAndResponders();
  }, [fetchIncidentsAndResponders]);

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
          dispatch(
            setUser({
              id: user?.id || '',
              full_name: data.name || '',
              mobile_no: user?.mobile_no || '',
              email: user?.email || '',
              role: user?.role || '',
              tehsil: user?.tehsil || '',
              is_registered: user?.is_registered ?? 0,
            }),
          );
          sheetRef.current?.close();
        }
      } catch (err: any) {
        console.error('Short profile update failed:', err?.response || err);
      }
    },
    [user, userToken, dispatch],
  );

  const handleProfileReminder = useCallback(() => {
    remindRef.current?.close();
    navigation.navigate('profile');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader drawer={drawerOpen} setDrawer={setDrawerOpen} />

      <View style={styles.mapContainer}>
        {showResponders ? (
          <RespondersList responders={responders} />
        ) : (
          <OpenStreetMap responders={responders} incidents={incidentList} />
        )}
      </View>

      {/* Floating buttons */}
      <View style={styles.sideBtns}>
        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={() => setShowResponders(prev => !prev)}
        >
          <View style={styles.floatingBtn}>
            {showResponders ? (
              <Maps width={26} height={26} />
            ) : (
              <Dis width={26} height={26} />
            )}
          </View>
          <Text style={styles.text}>
            {showResponders ? (
              <Text style={styles.text}>{TEXT.maps()}</Text>
            ) : (
              <Text style={styles.text}>{TEXT.responders()}</Text>
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={() => showHelpRef.current?.open()}
        >
          <View style={styles.floatingBtn}>
            <Help width={26} height={26} />
          </View>
          <Text style={styles.text}>{TEXT.help()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => weatherSheetRef?.current?.open()}
          style={styles.btnWrapper}
        >
          <View style={styles.floatingBtn}>
            <Weather width={26} height={26} />
          </View>
          <Text style={styles.text}>{TEXT.weather()}</Text>
        </TouchableOpacity>
      </View>

      <RightDrawer
        open={drawerOpen}
        changePass={() => {
          setDrawerOpen(false);
          changePassRef.current?.open();
        }}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Bottom sheets */}
      <CompleteProfileSheet
        ref={sheetRef}
        data=""
        submitData={handleShortProfile}
      />
      <ProfileReminder ref={remindRef} onUpdatePress={handleProfileReminder} />
      <HelplineDetails ref={showHelpRef} onClose={() => {}} />
      <ChangePinSheet
        ref={changePassRef}
        onUpdatePress={() => {
          changePassRef.current?.close();
          successRef.current?.open();
        }}
      />
      <SuccessScreen ref={successRef} height={220} />

      {user?.role === 'reviewer' && <ReviewerSection />}
      {user?.role === 'responder' && <ResponderSection />}

      <WeatherSheet ref={weatherSheetRef} />
    </SafeAreaView>
  );
};

export default CitizenDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.blue },
  mapContainer: { flex: 1, backgroundColor: COLOR.white },
  sideBtns: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    gap: 14,
    width: 70,
  },
  btnWrapper: { alignItems: 'center' },
  floatingBtn: {
    borderWidth: 2,
    borderColor: COLOR.white,
    backgroundColor: COLOR.blue,
    padding: 6,
    borderRadius: 50,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 10,
    backgroundColor: COLOR.darkGray,
    color: COLOR.white,
    fontWeight: '500',
    paddingHorizontal: 4,
    marginTop: 2,
    borderRadius: 4,
  },
});
