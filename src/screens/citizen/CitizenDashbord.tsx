import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import { COLOR } from '../../config/Colors';
import OpenStreetMap from '../../components/OpenStreetMap';

const CitizenDashbord = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader />

      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <OpenStreetMap />
      </View>
    </SafeAreaView>
  );
};

export default CitizenDashbord;

const styles = StyleSheet.create({});
