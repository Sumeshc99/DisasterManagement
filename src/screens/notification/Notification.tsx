import { StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../themes/Colors';

const Notification = () => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const getNotification = () => {
      ApiManager.notifications(user?.id, userToken)
        .then(resp => {
          if (resp?.data?.status) {
            // console.log('Notification Data', resp.data.data);
          }
        })
        .catch(err => console.log('error', err.response))
        .finally(() => '');
    };

    getNotification();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Notification</Text>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
});
