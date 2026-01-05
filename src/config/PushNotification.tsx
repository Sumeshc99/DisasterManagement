import { useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
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
    const requestPermissions = async () => {
      const app = getApp();
      const messaging = getMessaging(app);

      if (Platform.OS === 'ios') {
        try {
          const authStatus = await requestPermission(messaging, {
            alert: true,
            badge: true,
            sound: true,
          });

          const enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;

          console.log(
            enabled
              ? '✅ iOS FCM permission granted'
              : '❌ iOS FCM permission denied',
          );

          // Notifee permission (foreground notifications)
          const notifeeSettings = await notifee.requestPermission();
          if (
            notifeeSettings.authorizationStatus >= NotifeeAuthStatus.AUTHORIZED
          ) {
            console.log('✅ iOS Notifee permission granted');
          }
        } catch (error) {
          console.error('❌ iOS permission error:', error);
        }
      }

      if (Platform.OS === 'android') {
        try {
          if (Platform.Version >= 33) {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
          }

          const settings = await notifee.requestPermission();
          if (settings.authorizationStatus >= NotifeeAuthStatus.AUTHORIZED) {
            console.log('✅ Android notification permission granted');
          }
        } catch (error) {
          console.error('❌ Android permission error:', error);
        }
      }
    };

    requestPermissions();
  }, []);

  const showForegroundNotification = async (remoteMessage: any) => {
    try {
      const title =
        remoteMessage.notification?.title ||
        remoteMessage.data?.title ||
        'New Notification';

      const body =
        remoteMessage.notification?.body ||
        remoteMessage.data?.body ||
        'You have received a message';

      Alert.alert(title, body, [{ text: 'OK' }], { cancelable: true });

      const channelId =
        Platform.OS === 'android'
          ? await notifee.createChannel({
              id: 'default',
              name: 'Default Channel',
              importance: AndroidImportance.HIGH,
              sound: 'default',
              vibration: true,
            })
          : undefined;

      await notifee.displayNotification({
        title,
        body,
        android:
          Platform.OS === 'android'
            ? {
                channelId,
                smallIcon: 'ic_launcher',
                pressAction: { id: 'default' },
              }
            : undefined,
        ios:
          Platform.OS === 'ios'
            ? {
                foregroundPresentationOptions: {
                  alert: true,
                  badge: true,
                  sound: true,
                },
              }
            : undefined,
      });
    } catch (error) {
      console.error('❌ Notification display error:', error);
    }
  };

  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

    const unsubscribeMessage = onMessage(messaging, async remoteMessage => {
      if (remoteMessage) {
        await showForegroundNotification(remoteMessage);
      }
    });

    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Notification pressed:', detail.notification?.data);
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeNotifee();
    };
  }, []);

  return null;
};

export default PushNotification;
