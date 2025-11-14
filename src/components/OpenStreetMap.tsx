import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker, UrlTile } from 'react-native-maps';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootReducer';
import { TEXT } from '../i18n/locales/Text';
import Incident from '../assets/svg/incident.svg';

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
      latitude: Number(location?.latitude) || 0,
      longitude: Number(location?.longitude) || 0,
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

  const renderMarker = useCallback(
    (item: ResourceItem) => {
      return (
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
      );
    },
    [getMarkerIcon],
  );

  const renderIncident = useCallback(
    (item: any) => {
      return (
        <Marker
          key={item.id}
          coordinate={{
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          }}
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
            <Incident width={60} height={60} />
          </View>
        </Marker>
      );
    },
    [incidents],
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
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          showsUserLocation={true}
          showsCompass={true}
          showsScale={true}
        >
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />

          {/* ✅ 2 KM Radius Circle */}
          <Circle
            center={{
              latitude: CurrentLocation.latitude,
              longitude: CurrentLocation.longitude,
            }}
            radius={2000} // 2 km
            strokeWidth={2}
            strokeColor="rgba(0, 122, 255, 0.8)"
            fillColor="rgba(0, 122, 255, 0.1)"
          />

          {/* ✅ User Marker */}
          <Marker
            coordinate={{
              latitude: CurrentLocation.latitude,
              longitude: CurrentLocation.longitude,
            }}
            title="Your Location"
            description="This is your current position"
          >
            <Image
              source={require('../assets/markers/marker.png')}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </Marker>

          {responders.map((item: any) => renderMarker(item))}
          {incidents.map((item: any) => renderIncident(item))}
        </MapView>
      )}

      <View style={styles.incidentBox}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Image
            source={require('../assets/incedent.png')}
            style={{ width: WIDTH(10), height: WIDTH(10) }}
          />
          <Text style={{ fontSize: 30, color: COLOR.white }}>
            <Text>{incidents.length.toString().padStart(3, '0')}</Text>
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

  markers: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 5,
    flexDirection: 'row',
  },
  markerIcon: { width: 30, height: 30 },
  infoBox: {
    flex: 1,
    maxWidth: 150,
    minWidth: 120,
    backgroundColor: COLOR.white,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  incidentIcon: { width: 50, height: 50 },
});
