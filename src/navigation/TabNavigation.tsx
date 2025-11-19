import React from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CitizenDashbord from '../screens/citizen/CitizenDashbord';
import Community from '../screens/citizen/Community';
import { COLOR } from '../themes/Colors';
import { WIDTH } from '../themes/AppConst';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from './AppNavigation';
import { TEXT } from '../i18n/locales/Text';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 66,
          paddingBottom: 8,
          paddingTop: 5,
          position: 'absolute',
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="home"
        component={CitizenDashbord}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: focused ? COLOR.blue : COLOR.darkGray,
              }}
            >
              {TEXT.home()}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              resizeMode="contain"
              source={
                focused
                  ? require('../assets/home1.png')
                  : require('../assets/home.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />

      {/* Fake Center Button Placeholder */}
      <Tab.Screen
        name="sosbutton"
        component={View}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              style={styles.sosButtonContainer}
              onPress={() => navigation.navigate('createIncidentScreen')}
            >
              <Image
                source={require('../assets/sosImg.png')}
                style={{ width: WIDTH(20), height: WIDTH(20) }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Community Tab */}
      <Tab.Screen
        name="community"
        component={Community}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: focused ? COLOR.blue : COLOR.darkGray,
              }}
            >
              {TEXT.community()}
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <Image
              resizeMode="contain"
              source={
                focused
                  ? require('../assets/community1.png')
                  : require('../assets/community.png')
              }
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  sosButtonContainer: {
    top: -35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
