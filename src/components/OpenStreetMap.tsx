import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker, UrlTile } from 'react-native-maps';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootReducer';
import { TEXT } from '../i18n/locales/Text';
import BlinkingIcon from './UI/BlinkingIcon';

interface Props {
  responders: any;
  incidents: any;
}

interface ResourceItem {
  id: number;
  full_name: string;
  tehsil_name: string;
  latitude: string;
  longitude: string;
  resource_type: string;
}

const OpenStreetMap: React.FC<Props> = ({ responders, incidents }) => {
  const location = useSelector(
    (state: RootState) => state?.location?.currentLocation,
  );

  const CurrentLocation = useMemo(
    () => ({
      latitude: location.latitude || 21.1458,
      longitude: location.longitude || 79.0882,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    }),
    [location],
  );

  const getMarkerIcon = useCallback((type: string) => {
    switch (type) {
      case 'Ambulance':
        return require('../assets/markers/ambulance.png');
      case 'Hospital':
        return require('../assets/markers/hospi.png');
      case 'Police Station':
        return require('../assets/markers/cren.png');
      case 'SDRF Center':
        return require('../assets/markers/sdrf.png');
      default:
        return require('../assets/markers/marker.png');
    }
  }, []);

  const [tracksChanges, setTracksChanges] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksChanges(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [incidents]);

  const renderMarker = useCallback(
    (item: ResourceItem) => (
      <Marker
        key={item.id}
        coordinate={{
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }}
        title={item.full_name}
        description={item.tehsil_name}
      >
        <Image
          source={getMarkerIcon(item.resource_type)}
          style={styles.markerIcon}
          resizeMode="contain"
        />
      </Marker>
    ),
    [getMarkerIcon],
  );

  const renderIncident = useCallback(
    (item: any) => (
      <Marker
        key={item.id}
        coordinate={{
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }}
        tracksViewChanges={true}
      >
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.infoBox}>
            <Text style={styles.incidentTitle} numberOfLines={1}>
              {item?.incident_type_name}
            </Text>
            <Text style={styles.incidentSeverity} numberOfLines={1}>
              Severity: {item.severity || 'Medium'}
            </Text>
          </TouchableOpacity>

          <BlinkingIcon size={50} />
        </View>
      </Marker>
    ),
    [tracksChanges],
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: COLOR.white,
          alignItems: 'center',
          paddingBottom: 2,
        }}
      >
        <Text>{TEXT.default_view_incidents()}</Text>
      </View>

      {CurrentLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={CurrentLocation}
          showsUserLocation={true}
          zoomEnabled
          scrollEnabled
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />

          <Circle
            center={{
              latitude: CurrentLocation.latitude,
              longitude: CurrentLocation.longitude,
            }}
            radius={2000}
            strokeWidth={2}
            strokeColor="rgba(0, 122, 255, 0.8)"
            fillColor="rgba(0, 122, 255, 0.1)"
          />

          <Marker
            coordinate={{
              latitude: CurrentLocation.latitude,
              longitude: CurrentLocation.longitude,
            }}
            title="Your Location"
          >
            <Image
              source={require('../assets/markers/marker.png')}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </Marker>

          {responders.map(renderMarker)}
          {incidents.map(renderIncident)}
        </MapView>
      )}

      <View style={styles.incidentBox}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Image
            source={require('../assets/incedent.png')}
            style={{ width: WIDTH(10), height: WIDTH(10) }}
          />
          <Text style={{ fontSize: 30, color: COLOR.white }}>
            {incidents.length.toString().padStart(3, '0')}
          </Text>
        </View>
        <Text style={{ fontSize: 16, marginTop: 10, color: COLOR.white }}>
          {TEXT.nearby_live_incident()}
        </Text>
      </View>
    </View>
  );
};

export default OpenStreetMap;

const styles = StyleSheet.create({
  incidentBox: {
    backgroundColor: COLOR.blue,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 6,
    width: WIDTH(50),
    borderRadius: 12,
    padding: 10,
    position: 'absolute',
    top: 26,
  },

  markerIcon: { width: 30, height: 30 },

  infoBox: {
    maxWidth: 150,
    minWidth: 120,
    backgroundColor: COLOR.white,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    paddingVertical: 4,
  },
  incidentTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  incidentSeverity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
