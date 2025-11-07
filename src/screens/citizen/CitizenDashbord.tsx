import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import OpenStreetMap from '../../components/OpenStreetMap';
import ApiManager from '../../apis/ApiManager';
import { COLOR } from '../../themes/Colors';
import { useBackExit } from '../../hooks/useBackExit';
import { RootState } from '../../store/RootReducer';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import GetCurrentLocation from '../../config/GetCurrentLocation';
import { setUser } from '../../store/slices/authSlice';
import HelplineDetails from '../../components/bottomSheets/HelplineDetails';
import CompleteProfileSheet from '../../components/bottomSheets/CompleteProfileSheet';
import ProfileReminder from '../../components/bottomSheets/ProfileReminder';
import ChangePinSheet from '../../components/bottomSheets/ChangePinSheet';
import SuccessScreen from '../../components/bottomSheets/SuccessScreen';
import AlertModal from '../../components/AlertModal';
import RejectReasonSheet from '../../components/bottomSheets/RejectReasonSheet';
import RespondersList from './pages/RespondersList';
import RightDrawer from '../../components/RightDrawer';
import Maps from '../../assets/svg/maps.svg';
import Weather from '../../assets/svg/wea.svg';
import Help from '../../assets/svg/help.svg';
import Dis from '../../assets/svg/dis.svg';

const CitizenDashboard = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();

  const sheetRef = useRef<any>(null);
  const remindRef = useRef<any>(null);
  const showHelfRef = useRef<any>(null);
  const changePassRef = useRef<any>(null);
  const successRef = useRef<any>(null);
  const rejectRef = useRef<any>(null);

  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const [incidentList, setincidentList] = useState([]);
  const [responders, setresponders] = useState([]);
  const [visible, setVisible] = useState(false);
  const [tabs, settabs] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  GetCurrentLocation();
  useBackExit();

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

  useEffect(() => {
    const fetchIncidentList = async () => {
      try {
        const resp = await ApiManager.incidentList(userToken);
        if (resp?.data?.success) {
          setincidentList(resp?.data?.data?.results);
        }
      } catch (err) {
        console.error('Error fetching responder list:', err);
      }
    };

    fetchIncidentList();
  }, []);

  useEffect(() => {
    const fetchResponderList = async () => {
      try {
        const resp = await ApiManager.responderList();
        if (resp?.data?.success) {
          setresponders(resp?.data?.data?.results);
        }
      } catch (err) {
        console.error('Error fetching responder list:', err);
      }
    };

    fetchResponderList();
  }, []);

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
              is_registered: (user as { is_registered: 0 | 1 }).is_registered,
            }),
          );
          sheetRef.current?.close();
        }
      } catch (err: any) {
        console.error('Short profile update failed:', err?.response || err);
      } finally {
      }
    },
    [user, userToken],
  );

  const handleProfileReminder = useCallback(() => {
    remindRef.current?.close();
    navigation.navigate('profile');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader drawer={drawerOpen} setDrawer={setDrawerOpen} />

      <View style={styles.mapContainer}>
        {tabs ? (
          <RespondersList responders={responders} />
        ) : (
          <OpenStreetMap responders={responders} incidents={incidentList} />
        )}
      </View>

      <View style={styles.sideBtns}>
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => settabs(!tabs)}
        >
          <View style={styles.flotingBtn}>
            {tabs ? (
              <Maps width={26} height={26} />
            ) : (
              <Dis width={26} height={26} />
            )}
          </View>
          <Text style={styles.text}>{tabs ? 'Maps' : 'Responders'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => showHelfRef.current?.open()}
        >
          <View style={styles.flotingBtn}>
            <Help width={26} height={26} />
          </View>
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center' }}>
          <View style={styles.flotingBtn}>
            <Weather width={26} height={26} />
          </View>
          <Text style={styles.text}>Weather</Text>
        </TouchableOpacity>
      </View>

      {/* Bottem sheets  */}
      <CompleteProfileSheet
        ref={sheetRef}
        data=""
        submitData={handleShortProfile}
      />

      <ProfileReminder ref={remindRef} onUpdatePress={handleProfileReminder} />

      <HelplineDetails ref={showHelfRef} onClose={() => ''} />

      <ChangePinSheet
        ref={changePassRef}
        onUpdatePress={() => {
          changePassRef.current?.close();
          successRef.current?.open();
        }}
      />

      <SuccessScreen ref={successRef} />

      {/* <View style={{ position: 'absolute', marginTop: 100 }}>
        <Button title="Show Alert" onPress={() => setVisible(true)} />
      </View> */}

      <AlertModal
        visible={visible}
        onAcknowledge={() => {
          setVisible(false);
          rejectRef.current.open();
        }}
        onViewDetails={() => {
          setVisible(false), navigation.navigate('incidentDetails');
        }}
        onClose={() => setVisible(false)}
      />

      <RejectReasonSheet ref={rejectRef} />

      <RightDrawer
        open={drawerOpen}
        changePass={() => {
          setDrawerOpen(false);
          changePassRef.current?.open();
        }}
        onClose={() => setDrawerOpen(false)}
      />
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
  sideBtns: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    gap: 14,
    width: 70,
  },
  flotingBtn: {
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
    fontWeight: 500,
    paddingHorizontal: 4,
    marginTop: 2,
    borderRadius: 4,
  },
});
