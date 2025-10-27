import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import OpenStreetMap from '../../components/OpenStreetMap';
import { COLOR } from '../../themes/Colors';
import CompleteProfileSheet from '../../components/CompleteProfileSheet';
import ApiManager from '../../apis/ApiManager';
import { useBackExit } from '../../hooks/useBackExit';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

const CitizenDashbord = () => {
  const sheetRef = useRef<any>(null);

  const { user, userToken } = useSelector(
    (state: RootState) => state.auth as any,
  );

  const [responderList, setresponderList] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sheetRef.current?.open();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    handleResponderList();
  }, []);

  const handleResponderList = () => {
    ApiManager.responderList()
      .then(resp => {
        if (resp?.data?.success) {
          setresponderList(resp?.data?.data?.results);
        }
      })
      .catch(err => console.log('error', err));
  };

  const handleShortProfile = (data: any) => {
    const body = {
      mobile: user?.mobile_no,
      full_name: data.name,
      full_name_contact: data.emgName,
      mobile_no_contact: data.emgPhone,
    };

    ApiManager.shortProfile(body, userToken)
      .then(resp => {
        if (resp?.data?.status) {
          sheetRef.current?.close();
        }
      })
      .catch(err => console.log('error', err.response));
  };

  useBackExit();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader />

      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <OpenStreetMap list={responderList} />
      </View>

      <CompleteProfileSheet
        ref={sheetRef}
        data={''}
        submitData={handleShortProfile}
      />
    </SafeAreaView>
  );
};

export default CitizenDashbord;

const styles = StyleSheet.create({});
