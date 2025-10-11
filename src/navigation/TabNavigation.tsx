import { Text, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CitizenDashbord from '../screens/citizen/CitizenDashbord';
import Community from '../screens/citizen/Community';
import { COLOR } from '../config/Colors';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    jobSeekerTabs.length !== 0 && (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 66,
            paddingBottom: 8,
            paddingTop: 5,
          },
        }}
      >
        {jobSeekerTabs.map((item: any, index: number) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: focused ? COLOR.blue : COLOR.gray,
                  }}
                >
                  {item.label}
                </Text>
              ),
              tabBarIcon: ({ focused }) => (
                <Image
                  resizeMode="contain"
                  source={focused ? item.image : item.image2}
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    )
  );
};

export default TabNavigation;

const jobSeekerTabs = [
  {
    route: 'home',
    label: 'Home',
    component: CitizenDashbord,
    image: require('../assets/home1.png'),
    image2: require('../assets/home.png'),
  },
  {
    route: 'community',
    label: 'Community',
    component: Community,
    image: require('../assets/community1.png'),
    image2: require('../assets/community.png'),
  },
];
