import { Alert, Platform, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  AuthorizationStatus,
  onMessage,
} from '@react-native-firebase/messaging';

const CHANNEL_ID = 'custom_sound_channel_v5';

const PushNotification = () => {
  const messagingInstance = getMessaging(getApp());

  // 🔔 Notification press
  useEffect(() => {
    return notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed');
      }
    });
  }, []);

  // 📩 Foreground FCM listener (MODULAR)
  useEffect(() => {
    const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  // 🔐 Permission + channel
  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: CHANNEL_ID,
          name: 'Alert Sound Channel',
          importance: AndroidImportance.HIGH,
          sound: 'alert',
        });
      }
    } else {
      Alert.alert(
        'Permissions required',
        'Enable notification permissions in settings.',
      );
    }
  };

  const onDisplayNotification = async (remoteMessage: any) => {
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,

      android: {
        channelId: CHANNEL_ID,
        ongoing: remoteMessage?.data?.ongoing === 'true',
        pressAction: { id: 'default' },
        smallIcon: '@mipmap/ic_launcher',
      },

      ios: {
        sound: 'alert.caf',
      },
    });
  };

  return null;
};

export default PushNotification;

const styles = StyleSheet.create({});
