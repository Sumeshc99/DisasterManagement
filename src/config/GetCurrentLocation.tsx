import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import GetLocation from 'react-native-get-location';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import { useDispatch } from 'react-redux';
import { setLocation } from '../store/slices/userLocation';

const GetCurrentLocation = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const ensureLocationPermission = async () => {
      try {
        let status = await check(permission);

        if (status === RESULTS.GRANTED) {
          getLocation();
          return;
        }

        if (status === RESULTS.DENIED) {
          status = await request(permission);
        }

        if (status === RESULTS.GRANTED) {
          getLocation();
        } else if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Required',
            'Please enable location permission from settings to continue.',
            [
              { text: 'Open Settings', onPress: () => openSettings() },
              {
                text: 'Try Again',
                onPress: () => ensureLocationPermission(),
              },
            ],
          );
        } else {
          Alert.alert(
            'Location Required',
            'This feature needs your location to continue.',
            [
              {
                text: 'Allow Location',
                onPress: () => ensureLocationPermission(),
              },
            ],
          );
        }
      } catch (err) {
        console.warn('Permission check error:', err);
        setLoading(false);
      }
    };

    const getLocation = async () => {
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });

        dispatch(
          setLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          }),
        );

        setLoading(false);
      } catch (error: any) {
        console.warn('Location Error:', error.code, error.message);

        if (error.code === 'UNAUTHORIZED') {
          Alert.alert(
            'Permission Denied',
            'Please enable location permission in settings.',
            [
              { text: 'Open Settings', onPress: () => openSettings() },
              { text: 'Retry', onPress: () => ensureLocationPermission() },
            ],
          );
        } else if (error.code === 'UNAVAILABLE') {
          Alert.alert(
            'Location Unavailable',
            'Please turn on location services and try again.',
            [{ text: 'Retry', onPress: () => getLocation() }],
          );
        } else if (error.code === 'TIMEOUT') {
          Alert.alert(
            'Timeout',
            'Fetching location took too long. Try again.',
            [{ text: 'Retry', onPress: () => getLocation() }],
          );
        } else {
          Alert.alert('Error', 'Unable to fetch location.', [
            { text: 'Retry', onPress: () => getLocation() },
          ]);
        }

        setLoading(false);
      }
    };

    ensureLocationPermission();
  }, [dispatch]);

  return null;
};

export default GetCurrentLocation;
