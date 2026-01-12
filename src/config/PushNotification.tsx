import { Alert, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

import messaging, {
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

const PushNotification = () => {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
    }
  });

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      // await notifee.createChannel({
      //   id: 'default',
      //   name: 'Default Channel',
      //   importance: AndroidImportance.HIGH,
      // });
    } else {
      console.log('User has notification permissions disabled');
      Alert.alert(
        'Permissions required',
        'This app requires notification permissions to function properly. Please enable them in settings.',
      );
    }
  };

  const onDisplayNotification = async (data: any) => {
    console.log('notification', data);

    const channelId = await notifee.createChannel({
      id: 'custom_sound_channel_v5',
      name: 'Alert Sound Channel',
      importance: AndroidImportance.HIGH,
      sound: 'alert',
    });

    await notifee.displayNotification({
      title: data?.notification?.title,
      body: data?.notification?.body,
      android: {
        channelId,
        ongoing: data?.data.ongoing == 'true' ? true : false,
        pressAction: {
          id: 'default',
        },
        smallIcon: '@mipmap/ic_launcher',
      },
    });
  };

  return null;
};

export default PushNotification;

const styles = StyleSheet.create({});
