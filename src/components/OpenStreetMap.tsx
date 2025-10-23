import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';
import { COLOR } from '../config/Colors';
import { HEIGHT, WIDTH } from '../config/AppConst';
import { useNavigation } from '@react-navigation/native';
import PopupBanner from './PopupBanner';
import IncidentRecordsScreen from './IncidentRecordsScreen';
import SelfHelpOptions from '../screens/citizen/SelfHelpOptions';


const OpenStreetMap = ({
  latitude = 20.5937,
  longitude = 78.9629,
  latitudeDelta = 10,
  longitudeDelta = 10,
}) => {

  const navigation = useNavigation<AppStackNavigationProp<'respondersList'>>();


  const responderList = () => {
    console.log("kk")
    navigation.navigate('respondersList');
  }

  const incidentRecordsList = () => {
    console.log("kk")
    navigation.navigate('incidentRecordsScreen');
  }
  const incidentDetails = () => {
    console.log("kk")
    navigation.navigate('incidentDetails');
  }
  const selfHelpOptions = () => {
    console.log("kk")
    navigation.navigate('selfHelpOptions');
  }

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show popup as soon as the screen mounts
    setShowBanner(true);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={[StyleSheet.absoluteFillObject]}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        }}
      //   provider={null} // important: not Google
      >
        <UrlTile
          urlTemplate="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
      </MapView>
      <View style={styles.popupContainer}>
        {/* Popup will show automatically on mount */}
        <PopupBanner visible={showBanner} onHide={() => setShowBanner(false)} />
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
        <TouchableOpacity onPress={() => selfHelpOptions()}>
          <Image
            source={require('../assets/res1.png')}
            resizeMode="contain"
            style={{ width: 70, height: 70 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => incidentDetails()}>
          <Image
            source={require('../assets/res1.png')}
            resizeMode="contain"
            style={{ width: 70, height: 70 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => incidentRecordsList()}>
          <Image
            source={require('../assets/res1.png')}
            resizeMode="contain"
            style={{ width: 70, height: 70 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => responderList()}>
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
  );
};

export default OpenStreetMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    alignItems: "center",
  },
});
