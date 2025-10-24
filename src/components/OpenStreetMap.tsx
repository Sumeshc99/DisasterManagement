import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
interface Props {
  list: any;
}

const OpenStreetMap: React.FC<Props> = ({ list }) => {
  const navigation = useNavigation<AppStackNavigationProp<'respondersList'>>();
  const latitude = 20.5937;
  const longitude = 78.9629;
  const latitudeDelta = 10;
  const longitudeDelta = 10;

  const responderList = () => {
    navigation.navigate('respondersList');
  };

  console.log('responderList', list);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        }}
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
      </MapView>

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

        <View
          style={{
            backgroundColor: COLOR.blue,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 6,
            width: WIDTH(50),
            borderRadius: 12,
            padding: 14,
          }}
        >
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

        <View
          style={{
            position: 'absolute',
            gap: 14,
            bottom: WIDTH(14),
            right: 10,
          }}
        >
          <TouchableOpacity onPress={responderList}>
            <Image
              source={require('../assets/res1.png')}
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
          </TouchableOpacity>

          <Image
            source={require('../assets/res2.png')}
            resizeMode="contain"
            style={{ width: 70, height: 70 }}
          />

          <Image
            source={require('../assets/res3.png')}
            resizeMode="contain"
            style={{ width: 70, height: 70 }}
          />
        </View>
      </View>
    </View>
  );
};

export default OpenStreetMap;

const styles = StyleSheet.create({});
