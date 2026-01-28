import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import { COLOR } from '../../themes/Colors';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../store/slices/authSlice';
import BlinkingIcon from '../../components/UI/BlinkingIcon';
import { FONT } from '../../themes/AppConst';
import CitizensMetric from '../../components/Overview/CitizensMetric';
import IncidentsVolumeSection from '../../components/Overview/IncidentsVolumeSection';
import SeverityMetrics from '../../components/Overview/SeverityMetrics';
import ResolutionMetrics from '../../components/Overview/ResolutionMetrics';

const Community = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // const logOut = () => {
  //   dispatch(clearUser());
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{ name: 'loginScreen' }],
  //     }),
  //   );
  // };

  const role = 'reviewer'; // change to citizen / responder
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader drawer={false} setDrawer={() => ''} />

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: '20%' }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        {/* Sections will come here step-by-step */}
        {(role === 'reviewer' || role === 'responder') && <CitizensMetric />}

        <IncidentsVolumeSection role={role} />

        <SeverityMetrics />
        <ResolutionMetrics />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.blue,
  },
  content: {
    backgroundColor: COLOR.white,
    padding: 16,
  },
  header: {
    paddingVertical: 10,
  },
  headerText: {
    fontFamily: FONT.R_SBD_600,
    fontSize: 18,
    color: COLOR.textGrey,
  },
});
