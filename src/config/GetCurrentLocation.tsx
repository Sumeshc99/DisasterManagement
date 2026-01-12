import { useEffect, useState } from 'react';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
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
    const isAndroid = Platform.OS === 'android';

    const ensureLocationPermission = async () => {
      try {
        if (isAndroid) {
          // ANDROID LOGIC UNCHANGED
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getLocation();
            return;
          }

          if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert(
              'Permission Required',
              'Please enable location in settings.',
              [{ text: 'Open Settings', onPress: () => openSettings() }],
            );
            return;
          }

          Alert.alert(
            'Location Required',
            'This feature needs your location to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: () => ensureLocationPermission() },
            ],
          );

          return;
        }

        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

        let status = await check(permission);

        if (status === RESULTS.GRANTED) {
          getLocation();
          return;
        }

        if (status === RESULTS.DENIED) {
          const req = await request(permission);

          if (req === RESULTS.GRANTED) {
            getLocation();
            return;
          }

          if (req === RESULTS.BLOCKED) {
            Alert.alert(
              'Permission Denied',
              'Please enable location permission in settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => openSettings() },
              ],
            );

            return;
          }
          Alert.alert(
            'Location Needed',
            'Please allow location to use this feature.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Retry', onPress: () => ensureLocationPermission() },
            ],
          );
          return;
        }
        if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Blocked',
            'Please enable location permission in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => openSettings() },
            ],
          );
          return;
        }

        Alert.alert(
          'Location Needed',
          'Please allow location to use this feature.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: () => ensureLocationPermission() },
          ],
        );
      } catch (err) {
        console.warn('Permission error:', err);
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
            'Location Off',
            'Turn on location services and try again.',
            [{ text: 'Retry', onPress: () => getLocation() }],
          );
        }

        setLoading(false);
      }
    };

    ensureLocationPermission();
  }, [dispatch]);

  return null;
};

export default GetCurrentLocation;
