import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { Circle, Marker, UrlTile } from 'react-native-maps';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootReducer';

interface Props {
  list: any;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface ResourceItem {
  id: number;
  owner_full_name: string;
  location: string;
  latitude: string;
  longitude: string;
  resource_type: string;
}

interface IncidentItem {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  type: string;
  severity: string;
  time: string;
  img?: string;
  description: string;
}

const OpenStreetMap: React.FC<Props> = ({ list }) => {
  const location = useSelector((state: RootState) => state.location);

  const navigation = useNavigation<AppStackNavigationProp<'respondersList'>>();
  const defaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XM2wnktL0zldrIsvWCykFb1Od4m6jHh-4Q&s';

  const CurrentLocation = {
    // latitude: location.currentLocation.latitude || 21.1458,
    // longitude: location.currentLocation.longitude || 79.0882,
    latitude: 21.1458,
    longitude: 79.0882,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

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
    (item: ResourceItem) => (
      <Marker
        key={item.id}
        coordinate={{
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }}
        title={item.owner_full_name}
        description={item.location}
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

  const renderIncedent = useCallback(
    (item: IncidentItem) => (
      <Marker
        key={item.id}
        coordinate={{
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={styles.infoBox}>
            <Image
              source={{ uri: item.img || defaultImage }}
              style={styles.incidentImage}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.incidentTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.incidentSeverity} numberOfLines={1}>
                Severity: {item.severity}
              </Text>
            </View>
          </View>
          <Image
            source={require('../assets/markers/incident.png')}
            style={styles.incidentIcon}
            resizeMode="contain"
          />
        </View>
      </Marker>
    ),
    [],
  );

  const { ambulance, hospitalList, policeStation, sdrfCenter } = useMemo(
    () => dummyList,
    [],
  );
  const incidents = useMemo(() => incidentList, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: COLOR.white,
          alignItems: 'center',
          paddingBottom: 2,
        }}
      >
        <Text>Default view: Incidents within 2 km around you.</Text>
      </View>
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

        {ambulance.map((item: any) => renderMarker(item))}
        {hospitalList.map((item: any) => renderMarker(item))}
        {policeStation.map((item: any) => renderMarker(item))}
        {sdrfCenter.map((item: any) => renderMarker(item))}
        {incidents.map((item: any) => renderIncedent(item))}
      </MapView>

      <View style={styles.incidentBox}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Image
            source={require('../assets/incedent.png')}
            style={{ width: WIDTH(10), height: WIDTH(10) }}
          />
          <Text style={{ fontSize: 30, color: COLOR.white }}>002</Text>
        </View>
        <Text style={{ fontSize: 16, marginTop: 10, color: COLOR.white }}>
          Nearby Live Incident
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
    padding: 14,
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
    backgroundColor: COLOR.white,
    borderRadius: 8,
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 5,
  },
  incidentImage: {
    width: 45,
    height: 45,
    margin: 4,
    borderRadius: 4,
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

const dummyList = {
  hospitalList: [
    {
      id: 1,
      owner_full_name: 'Orange City Hospital',
      location: 'Khamla Square, Nagpur',
      latitude: '21.1187',
      longitude: '79.0596',
      resource_type: 'Hospital',
    },
    {
      id: 2,
      owner_full_name: 'Care Hospital Nagpur',
      location: 'Ramdaspeth, Nagpur',
      latitude: '21.1412',
      longitude: '79.0781',
      resource_type: 'Hospital',
    },
    {
      id: 3,
      owner_full_name: 'Wockhardt Hospital',
      location: 'Shankar Nagar, Nagpur',
      latitude: '21.1368',
      longitude: '79.0603',
      resource_type: 'Hospital',
    },
  ],

  ambulance: [
    {
      id: 4,
      owner_full_name: 'Ambulance Unit 1',
      location: 'Sitabuldi, Nagpur',
      latitude: '21.1461',
      longitude: '79.0849',
      resource_type: 'Ambulance',
    },
    {
      id: 5,
      owner_full_name: 'Ambulance Unit 2',
      location: 'Dharampeth, Nagpur',
      latitude: '21.1475',
      longitude: '79.0671',
      resource_type: 'Ambulance',
    },
  ],

  policeStation: [
    {
      id: 6,
      owner_full_name: 'Sadar Police Station',
      location: 'Sadar, Nagpur',
      latitude: '21.1633',
      longitude: '79.0736',
      resource_type: 'Police Station',
    },
    {
      id: 7,
      owner_full_name: 'Sitabuldi Police Station',
      location: 'Sitabuldi, Nagpur',
      latitude: '21.1470',
      longitude: '79.0820',
      resource_type: 'Police Station',
    },
  ],

  sdrfCenter: [
    {
      id: 8,
      owner_full_name: 'SDRF Central Unit Nagpur',
      location: 'Civil Lines, Nagpur',
      latitude: '21.1571',
      longitude: '79.0719',
      resource_type: 'SDRF Center',
    },
  ],
};

const incidentList = [
  {
    id: 101,
    title: 'Road Accident - Sadar',
    latitude: '21.1605',
    longitude: '79.0723',
    type: 'Accident',
    severity: 'High',
    time: '2025-10-28T10:15:00Z',
    description:
      'Two vehicles collided near Sadar flyover. Ambulance and police dispatched to the scene.',
  },
  {
    id: 102,
    title: 'Fire Breakout - Dharampeth',
    latitude: '21.1472',
    longitude: '79.0679',
    type: 'Fire',
    severity: 'Medium',
    time: '2025-10-28T09:50:00Z',
    description:
      'Small fire reported at a residential building in Dharampeth. Fire services are responding.',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XM2wnktL0zldrIsvWCykFb1Od4m6jHh-4Q&s',
  },
  {
    id: 103,
    title: 'Medical Emergency - Ramdaspeth',
    latitude: '21.1420',
    longitude: '79.0785',
    type: 'Medical',
    severity: 'Low',
    time: '2025-10-28T08:40:00Z',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XM2wnktL0zldrIsvWCykFb1Od4m6jHh-4Q&s',

    description:
      'Senior citizen reported chest pain at home. Nearby ambulance is on the way.',
  },
  {
    id: 104,
    title: 'Flooded Road - Sitabuldi',
    latitude: '21.1468',
    longitude: '79.0843',
    type: 'Flood',
    severity: 'Medium',
    time: '2025-10-28T07:30:00Z',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XM2wnktL0zldrIsvWCykFb1Od4m6jHh-4Q&s',
    description:
      'Heavy rainfall caused waterlogging near Sitabuldi market. Traffic police managing flow.',
  },
  {
    id: 105,
    title: 'Power Outage - Civil Lines',
    latitude: '21.1575',
    longitude: '79.0711',
    type: 'Infrastructure',
    severity: 'Low',
    time: '2025-10-28T06:55:00Z',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XM2wnktL0zldrIsvWCykFb1Od4m6jHh-4Q&s',

    description:
      'Reported power outage affecting multiple buildings in Civil Lines area. Electric board notified.',
  },
  {
    id: 106,
    title: 'Fire - Cotton Market',
    latitude: '21.1478',
    longitude: '79.0902',
    type: 'Fire',
    severity: 'High',
    time: '2025-10-28T11:10:00Z',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1XM2wnktL0zldrIsvWCykFb1Od4m6jHh-4Q&s',

    description:
      'Major fire reported in a warehouse at Cotton Market. Fire brigades are on site.',
  },
];
