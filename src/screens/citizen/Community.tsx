import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../config/Colors';
import DashBoardHeader from '../../components/header/DashBoardHeader';

const Community = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader />

      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <Text>Community</Text>
      </View>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({});
