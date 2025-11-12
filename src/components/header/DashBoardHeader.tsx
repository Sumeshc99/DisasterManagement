import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import IncidentRecordsSheet from '../bottomSheets/IncidentRecordSheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

interface props {
  drawer: boolean;
  setDrawer: any;
}

const DashBoardHeader: React.FC<props> = ({ drawer, setDrawer }) => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const sheetRef = useRef<any>(null);

  const { user, userToken } = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Image
          source={require('../../assets/location.png')}
          style={styles.iconSmall}
        />
        <Text style={styles.locationText}>{user?.tehsil}</Text>
      </View>

      <Image
        source={require('../../assets/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => sheetRef.current?.open()}>
          <Image
            source={require('../../assets/alert.png')}
            style={styles.iconSmall1}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('incidentRecordsScreen')}
        >
          <Image
            source={require('../../assets/bell.png')}
            style={styles.iconSmall1}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDrawer(true)}
          style={styles.userCircle}
        >
          <Text style={styles.userText}>
            {user?.full_name
              ? user.full_name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(word => word.charAt(0).toUpperCase())
                  .join('')
              : 'UN'}
          </Text>
        </TouchableOpacity>
      </View>

      <IncidentRecordsSheet ref={sheetRef} />
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
    position: 'absolute',
    width: 120,
    height: 60,
    left: '50%',
    transform: [{ translateX: -45 }],
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconSmall: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  iconSmall1: {
    width: 26,
    height: 26,
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
