import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const [hospitalList, sethospitalList] = useState<any[]>([]);
  const [ambulance, setambulance] = useState<any[]>([]);
  const [policeStation, setpoliceStation] = useState<any[]>([]);
  const [sdrfCenter, setsdrfCenter] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [tabs, settabs] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  GetCurrentLocation();
  useBackExit();

  useEffect(() => {
    const fetchResponderList = async () => {
      try {
        const resp = await ApiManager.responderList();

        if (resp?.data?.success) {
          const data = resp?.data?.data?.results || [];
          if (data.length > 0) {
            const hospitals = data.filter(
              (item: any) => item.resource_type === 'Hospital',
            );
            sethospitalList(hospitals);

            const ambulance = data.filter(
              (item: any) => item.resource_type === 'Ambulance',
            );
            setambulance(ambulance);

            const policeStation = data.filter(
              (item: any) => item.resource_type === 'Police Station',
            );
            setpoliceStation(policeStation);

            const sdrfCenter = data.filter(
              (item: any) => item.resource_type === 'SDRF Center',
            );
            setsdrfCenter(sdrfCenter);
          }
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
          dispatch(
            setUser({
              id: user?.id || '',
              full_name: data.name || '',
              mobile_no: user?.mobile_no || '',
              email: user?.email || '',
              role: user?.role || '',
              tehsil: user?.tehsil || '',
              is_registered: (user as { is_registered: boolean }).is_registered,
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
          <RespondersList />
        ) : (
          <OpenStreetMap
            list={{ hospitalList, ambulance, policeStation, sdrfCenter }}
          />
        )}
      </View>

      <View style={styles.sideBtns}>
        <TouchableOpacity onPress={() => settabs(!tabs)}>
          <Image
            source={
              tabs
                ? require('../../assets/maps.png')
                : require('../../assets/res1.png')
            }
            resizeMode="contain"
            style={{ width: 60, height: 60 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => showHelfRef.current?.open()}>
          <Image
            source={require('../../assets/res2.png')}
            resizeMode="contain"
            style={{ width: 60, height: 60 }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require('../../assets/res3.png')}
            resizeMode="contain"
            style={{ width: 60, height: 60 }}
          />
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
  },
});
