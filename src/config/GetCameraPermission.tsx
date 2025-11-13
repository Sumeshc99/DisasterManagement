import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const GetCameraPermission = () => {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const ensureCameraPermission = async () => {
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
            'Camera Permission Required',
            'Please enable camera access in settings to continue.',
            [
              { text: 'Open Settings', onPress: () => openSettings() },
              {
                text: 'Try Again',
                onPress: () => ensureCameraPermission(),
              },
            ],
          );
        } else {
          Alert.alert(
            'Camera Access Needed',
            'This feature requires camera access.',
            [
              {
                text: 'Allow Access',
                onPress: () => ensureCameraPermission(),
              },
            ],
          );
        }

        setLoading(false);
      } catch (err) {
        console.warn('Camera permission error:', err);
        setLoading(false);
      }
    };

    ensureCameraPermission();
  }, []);

  return null;
};

export default GetCameraPermission;
