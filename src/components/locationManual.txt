import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { COLOR } from '../themes/Colors';
import { FONT } from '../themes/AppConst';
import { TEXT } from '../i18n/locales/Text';
import SearchIcon from '../assets/svg/searchIcon.svg';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // loader for search + reverse geo
  const [searching, setSearching] = useState(false); // only searchbox loader

  const lastRequestId = useRef(0); // ignore slow responses

  const [region, setRegion] = useState({
    latitude: location.latitude || 21.1458,
    longitude: location.longitude || 79.0882,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [debouncedValue, setDebouncedValue] = useState(location.address);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(location.address), 800);
    return () => clearTimeout(handler);
  }, [location.address]);

  const fetchPlaces = useCallback(async () => {
    const query = debouncedValue.trim();

    if (query.length < 3) {
      setPlaces([]);
      setShowDropdown(false);
      return;
    }

    const currentRequest = ++lastRequestId.current;

    setSearching(true);

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query,
      )}&format=json&addressdetails=1&limit=5`;

      const response = await Promise.race([
        fetch(url, {
          headers: { 'User-Agent': 'ReactNativeApp (developer@example.com)' },
        }),
        new Promise((_, reject) => setTimeout(() => reject('timeout'), 6000)),
      ]);

      if (currentRequest !== lastRequestId.current) return; // ignore old result

      const json = await response?.json();
      setPlaces(json || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('OSM search error:', error);
    } finally {
      if (currentRequest === lastRequestId.current) {
        setSearching(false);
      }
    }
  }, [debouncedValue]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleSelectPlace = (place: any) => {
    Keyboard.dismiss();

    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);

    onChangeLocation({
      address: place.display_name,
      latitude: lat,
      longitude: lon,
    });

    setPlaces([]);
    setShowDropdown(false);

    setRegion({
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    setLoading(true);

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      const response = await Promise.race([
        fetch(url, {
          headers: { 'User-Agent': 'ReactNativeApp (developer@example.com)' },
        }),
        new Promise((_, reject) => setTimeout(() => reject('timeout'), 7000)),
      ]);

      const json = await response?.json();
      const address = json.display_name || '';

      onChangeLocation({ address, latitude, longitude });

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (error) {
      console.warn('Reverse OSM error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{TEXT.address()}</Text>

      <View style={styles.searchBox}>
        <TextInput
          placeholder={TEXT.enter_your_address()}
          value={location.address}
          onChangeText={text => {
            onChangeLocation({ ...location, address: text });
          }}
          style={styles.input}
        />

        {/* Loader inside search box */}
        {searching ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.iconWrapper}>
            <SearchIcon width={18} height={18} />
          </View>
        )}
      </View>

      {/* Results Dropdown */}
      {showDropdown && places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={item =>
            item.place_id?.toString() || Math.random().toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectPlace(item)}
              style={styles.resultItem}
            >
              <Text style={styles.placeName}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
          style={styles.resultList}
        />
      )}

      {/* MAP */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          <Marker coordinate={region} />
        </MapView>

        {/* Map Loader */}
        {loading && (
          <View style={styles.mapLoader}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </View>
  );
};

export default LocationManual;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 16, fontFamily: FONT.R_SBD_600, color: COLOR.textGrey },
  searchBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, height: 45, fontSize: 16, color: COLOR.textGrey },
  iconWrapper: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultList: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    position: 'absolute',
    zIndex: 20,
    top: 80,
    left: 0,
    right: 0,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  placeName: { fontWeight: '600', fontSize: 14, color: '#333' },
  mapContainer: {
    flex: 1,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: { flex: 1 },
  mapLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
