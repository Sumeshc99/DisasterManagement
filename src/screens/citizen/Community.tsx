import { Button, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../../components/header/DashBoardHeader';
import { COLOR } from '../../themes/Colors';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../store/slices/authSlice';

const Community = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(clearUser());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'loginScreen' }],
      }),
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLOR.blue }}>
      <DashBoardHeader />

      <View
        style={{
          flex: 1,
          backgroundColor: COLOR.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* <Button title="Log out" onPress={() => logOut()} /> */}
      </View>
    </SafeAreaView>
  );
};

export default Community;

const styles = StyleSheet.create({});
