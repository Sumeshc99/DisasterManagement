import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { WIDTH } from '../themes/AppConst';

const GOOGLE_API_KEY = 'AIzaSyDjFGPFuN3IMaMQU76874r-T1glz8dyupw';
Geocoder.init(GOOGLE_API_KEY);

interface LocationManualProps {
  value: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
}

const LocationManual: React.FC<LocationManualProps> = ({
  value,
  onChangeText,
  onSelectLocation,
}) => {
  const [places, setPlaces] = useState<any[]>([]);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), 400);
    return () => clearTimeout(handler);
  }, [value]);

  const fetchPlaces = useCallback(async () => {
    if (debouncedValue.trim().length < 2) {
      setPlaces([]);
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${GOOGLE_API_KEY}&input=${debouncedValue}&components=country:in`,
      );
      const json = await response.json();
      setPlaces(json.predictions || []);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  }, [debouncedValue]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleSelectPlace = async (place: any) => {
    onChangeText(place.description);
    setPlaces([]);
    Keyboard.dismiss();

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${GOOGLE_API_KEY}`,
      );
      const json = await response.json();
      const location = json.result.geometry.location;

      const address = place.description;
      onSelectLocation({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const json = await Geocoder.from(latitude, longitude);
      const address = json.results[0]?.formatted_address || '';
      onSelectLocation({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      onChangeText(address);
    } catch (error) {
      console.warn('Geocoding error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Address</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Please enter address"
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </View>

      {places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={item => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectPlace(item)}
              style={styles.resultItem}
            >
              <Text style={styles.placeName}>
                {item?.structured_formatting.main_text}
              </Text>
              <Text style={styles.placeAddress}>
                {item?.structured_formatting.secondary_text}
              </Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
          style={styles.resultList}
        />
      )}
    </View>
  );
};

export default LocationManual;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  searchBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  input: {
    height: 45,
    fontSize: 16,
  },
  resultList: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    position: 'absolute',
    zIndex: 20,
    top: 80,
    marginHorizontal: 2,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
  placeAddress: {
    fontSize: 13,
    color: '#888',
  },
  mapContainer: {
    flex: 1,
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
});
