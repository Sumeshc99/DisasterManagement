import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('background notification!', remoteMessage);

  // 🔔 Create Android notification channel with custom sound
  const channelId = await notifee.createChannel({
    id: 'custom_sound_channel_v5',
    name: 'Alert Sound Channel',
    importance: AndroidImportance.HIGH,
    sound: 'alert',
  });

  // 🔔 Display notification with custom sound
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'Notification',
    body: remoteMessage.notification?.body || 'Background message',
    android: {
      channelId,
      sound: 'alert',
      pressAction: {
        id: 'default',
      },
    },
  });
});

messaging().onNotificationOpenedApp(remoteMessage => {
  if (remoteMessage) {
    console.log('App opened from background by notification', remoteMessage);
  }
});

messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('App opened from killed state', remoteMessage);
    }
  });

AppRegistry.registerComponent(appName, () => App);
