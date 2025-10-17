import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';

const DashBoardHeader = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={require('../../assets/location.png')}
          style={styles.iconSmall}
        />
        <Text style={styles.locationText}>Nagpur City</Text>
      </View>

      <Image
        source={require('../../assets/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.rightContainer}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/alert.png')}
            style={styles.iconSmall}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require('../../assets/bell.png')}
            style={styles.iconSmall}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('profile')}
          style={styles.userCircle}
        >
          <Text style={styles.userText}>UN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashBoardHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 70,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  logo: {
    width: 120,
    height: 60,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconSmall: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  userCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    color: '#2B2B2B',
    fontWeight: '700',
  },
});
