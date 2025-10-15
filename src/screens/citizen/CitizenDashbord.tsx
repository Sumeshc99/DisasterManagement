import React, { useEffect, useRef } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import OpenStreetMap from '../../components/OpenStreetMap';
import { COLOR } from '../../themes/Colors';
import CompleteProfileSheet from '../../components/CompleteProfileSheet';
import RBSheet from 'react-native-raw-bottom-sheet';

const CitizenDashbord = () => {
  const sheetRef = useRef<RBSheet>(null);

  useEffect(() => {
    sheetRef.current?.open();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader />

      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <OpenStreetMap />
      </View>

      <CompleteProfileSheet ref={sheetRef} />
    </SafeAreaView>
  );
};

export default CitizenDashbord;

const styles = StyleSheet.create({});
