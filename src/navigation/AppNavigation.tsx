import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import SelectLanguage from '../screens/SelectLanguage';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPVerification from '../screens/auth/OTPVerification';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigation = () => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f5f5f5',
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="splashScreen"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 400,
        }}
      >
        <Stack.Screen name="splashScreen" component={SplashScreen} />
        <Stack.Screen name="selectLanguage" component={SelectLanguage} />
        <Stack.Screen name="loginScreen" component={LoginScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});

export type AppStackNavigationProp<T extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, T>;

type AppStackParamList = {
  splashScreen: undefined;
  selectLanguage: undefined;
  loginScreen: undefined;
  OTPVerification: undefined;
};
