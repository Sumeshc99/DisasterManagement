import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
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
    const fetchLocation = async () => {
      try {
        const permission =
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

        const status = await check(permission);

        if (status === RESULTS.GRANTED) {
          getLocation();
        } else if (status === RESULTS.DENIED) {
          const result = await request(permission);
          if (result === RESULTS.GRANTED) {
            getLocation();
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required.',
            );
            setLoading(false);
          }
        } else if (status === RESULTS.BLOCKED) {
          Alert.alert(
            'Permission Blocked',
            'Please enable location permission from settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => setLoading(false),
              },
              { text: 'Open Settings', onPress: () => openSettings() },
            ],
          );
        }
      } catch (err) {
        console.warn('Permission check error:', err);
        setLoading(false);
      }
    };

    const getLocation = () => {
      Geolocation.getCurrentPosition(
        (pos: any) => {
          console.log('Current Location:', pos.coords);
          dispatch(setLocation({ latitude: 37.7749, longitude: -122.4194 }));
          setLoading(false);
        },
        error => {
          console.warn('Location Error:', error.code, error.message);
          if (error.code === 1) {
            Alert.alert(
              'Permission Denied',
              'Enable location permission in settings.',
            );
          } else if (error.code === 2) {
            Alert.alert(
              'Location Unavailable',
              'Please turn on location services.',
            );
          } else if (error.code === 3) {
            Alert.alert('Timeout', 'Fetching location took too long.');
          } else {
            Alert.alert('Error', 'Unable to fetch location.');
          }
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    fetchLocation();
  }, []);

  return null;
};

export default GetCurrentLocation;
