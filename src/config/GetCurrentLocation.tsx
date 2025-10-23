import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const GetCurrentLocation = () => {
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const permission =
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

        const result = await request(permission);

        if (result === RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              console.log('Current Location:', position.coords);
            },
            error => {
              console.log('Location Error:', error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to fetch your location.',
          );
        }
      } catch (err) {
        console.warn('Permission Error:', err);
      }
    };

    fetchLocation();
  }, []);

  return null;
};

export default GetCurrentLocation;
