import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  onMessage,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  AuthorizationStatus as NotifeeAuthStatus,
} from '@notifee/react-native';

const PushNotification = () => {
  useEffect(() => {
    const init = async () => {
      const app = getApp();
      const messaging = getMessaging(app);

      /* ---------- iOS Permission ---------- */
      if (Platform.OS === 'ios') {
        const status = await requestPermission(messaging, {
          alert: true,
          badge: true,
          sound: true,
        });

        if (
          status === AuthorizationStatus.AUTHORIZED ||
          status === AuthorizationStatus.PROVISIONAL
        ) {
          console.log('✅ iOS FCM permission granted');
        }

        await notifee.requestPermission();
      }

      /* ---------- Android Permission ---------- */
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }
        await notifee.requestPermission();
      }

      /* ---------- ANDROID CHANNELS (ONLY ONCE) ---------- */
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'alert_channel',
          name: 'Alert Channel',
          importance: AndroidImportance.HIGH,
          sound: 'sound', // res/raw/sound.mp3
          vibration: true,
        });

        await notifee.createChannel({
          id: 'default_channel',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
        });
      }
    };

    init();
  }, []);

  /* ---------- FOREGROUND NOTIFICATION ---------- */
  const showForegroundNotification = async (remoteMessage: any) => {
    const title =
      remoteMessage.data?.title ||
      remoteMessage.notification?.title ||
      'New Notification';

    const body =
      remoteMessage.data?.body ||
      remoteMessage.notification?.body ||
      'You have received a message';

    const isAlert = title === 'Incident Alert';

    await notifee.displayNotification({
      title,
      body,
      android:
        Platform.OS === 'android'
          ? {
              channelId: isAlert ? 'alert_channel' : 'default_channel',
              smallIcon: 'ic_launcher',
              pressAction: { id: 'default' },
            }
          : undefined,
      ios:
        Platform.OS === 'ios'
          ? {
              sound: isAlert ? 'sound.mp3' : 'default',
              foregroundPresentationOptions: {
                alert: true,
                badge: true,
                sound: true,
              },
            }
          : undefined,
    });
  };

  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    const unsubMsg = onMessage(messaging, showForegroundNotification);

    const unsubNotifee = notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Notification pressed');
      }
    });

    return () => {
      unsubMsg();
      unsubNotifee();
    };
  }, []);

  return null;
};

export default PushNotification;
