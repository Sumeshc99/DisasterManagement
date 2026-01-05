import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

export async function backgroundMessageHandler(remoteMessage: any) {
  console.log('ooooo', remoteMessage);
  const isAlert = remoteMessage.data?.title === 'Incident Alert';
  try {
    /* ---------- CREATE CHANNELS (SAFE CALL) ---------- */
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'alert_channel',
        name: 'Alert Channel',
        importance: AndroidImportance.HIGH,
        sound: 'sound',
        vibration: true,
      });

      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }

    /* ---------- EXTRACT DATA ---------- */
    const title =
      remoteMessage.data?.title ||
      remoteMessage.notification?.title ||
      'New Notification';

    const body =
      remoteMessage.data?.body ||
      remoteMessage.notification?.body ||
      'You have received a message';

    const isAlert = title === 'Incident Alert';

    /* ---------- SHOW NOTIFICATION ---------- */
    await notifee.displayNotification({
      title,
      body,
      android:
        Platform.OS === 'android'
          ? {
              channelId: isAlert ? 'alert_channel' : 'default',
              smallIcon: 'ic_launcher',
              pressAction: { id: 'default' },
            }
          : undefined,
      ios:
        Platform.OS === 'ios'
          ? {
              sound: isAlert ? 'sound' : 'default',
            }
          : undefined,
    });
  } catch (e) {
    console.log('❌ BG notification error', e);
  }
}
