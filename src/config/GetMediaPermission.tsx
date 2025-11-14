import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const GetMediaPermission = () => {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.IOS.PHOTO_LIBRARY;

    const ensureMediaPermission = async () => {
      try {
        let status = await check(permission);

        if (status === RESULTS.GRANTED) {
          setGranted(true);
          setLoading(false);
          return;
        }

        if (status === RESULTS.DENIED) {
          status = await request(permission);
        }

        if (status === RESULTS.GRANTED) {
          setGranted(true);
        } else if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Media Permission Required',
            'Please enable media/gallery access in settings to continue.',
            [
              { text: 'Open Settings', onPress: () => openSettings() },
              {
                text: 'Try Again',
                onPress: () => ensureMediaPermission(),
              },
            ],
          );
        } else {
          Alert.alert(
            'Media Access Needed',
            'This feature requires gallery access.',
            [
              {
                text: 'Allow Access',
                onPress: () => ensureMediaPermission(),
              },
            ],
          );
        }

        setLoading(false);
      } catch (err) {
        console.warn('Media permission error:', err);
        setLoading(false);
      }
    };

    ensureMediaPermission();
  }, []);

  return null;
};

export default GetMediaPermission;
