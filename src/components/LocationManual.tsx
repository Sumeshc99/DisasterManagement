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
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_API_KEY = 'AIzaSyDjFGPFuN3IMaMQU76874r-T1glz8dyupw';
Geocoder.init(GOOGLE_API_KEY);

interface Location {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationManualProps {
  location: Location;
  onChangeLocation: (updatedLocation: Location) => void;
}

const LocationManual: React.FC<LocationManualProps> = ({
  location,
  onChangeLocation,
}) => {
  const [places, setPlaces] = useState<any[]>([]);
  const [debouncedValue, setDebouncedValue] = useState(location.address);
  const [showDropdown, setShowDropdown] = useState(false);

  const [region, setRegion] = useState({
    latitude: location.latitude || 20.5937,
    longitude: location.longitude || 78.9629,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(location.address), 400);
    return () => clearTimeout(handler);
  }, [location.address]);

  const fetchPlaces = useCallback(async () => {
    if (debouncedValue.trim().length < 2) {
      setPlaces([]);
      setShowDropdown(false);
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
    Keyboard.dismiss();
    setPlaces([]);
    setShowDropdown(false);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${GOOGLE_API_KEY}`,
      );
      const json = await response.json();
      const loc = json.result.geometry.location;

      const updated = {
        address: place.description,
        latitude: loc.lat,
        longitude: loc.lng,
      };

      onChangeLocation(updated);
      setRegion({
        latitude: loc.lat,
        longitude: loc.lng,
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
      const addr = json.results[0]?.formatted_address || '';

      const updated = { address: addr, latitude, longitude };
      onChangeLocation(updated);
      setShowDropdown(false);

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
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
          value={location.address}
          onChangeText={text => {
            onChangeLocation({ ...location, address: text });
            setShowDropdown(text.trim().length > 0);
          }}
          style={styles.input}
        />
      </View>

      {showDropdown && places.length > 0 && (
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

      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          <Marker coordinate={region} />
        </MapView>
      </View>
    </View>
  );
};

export default LocationManual;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', color: '#333' },
  searchBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  input: { height: 45, fontSize: 16 },
  resultList: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    position: 'absolute',
    zIndex: 20,
    top: 80,
    marginHorizontal: 2,
    width: '100%',
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: { fontWeight: '600', fontSize: 15, color: '#333' },
  placeAddress: { fontSize: 13, color: '#888' },
  mapContainer: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: { flex: 1 },
});
