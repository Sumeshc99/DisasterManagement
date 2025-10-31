import React from 'react';
import { StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { HEIGHT, WIDTH } from '../themes/AppConst';
import { COLOR } from '../themes/Colors';
import AppNavigation from './AppNavigation';

const Drawer = createDrawerNavigator();

const SideDrawerNav = () => {
  return (
    <Drawer.Navigator
      initialRouteName="appNavigation"
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerType: 'front',
        drawerHideStatusBarOnOpen: true,
      }}
    >
      <Drawer.Screen name="appNavigation" component={AppNavigation} />
    </Drawer.Navigator>
  );
};

export default SideDrawerNav;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  profileSection: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    paddingHorizontal: WIDTH(2),
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    color: COLOR.black,
  },
  role: {
    color: '#555',
    fontSize: 13,
  },
  menuSection: {
    marginTop: HEIGHT(2),
    paddingHorizontal: WIDTH(1),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#004aad',
  },
  subMenuSection: {
    marginLeft: 20,
    marginBottom: 10,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    marginBottom: 8,
    borderRadius: 8,
    padding: 12,
    elevation: 1,
  },
  subMenuText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#004aad',
  },
});
