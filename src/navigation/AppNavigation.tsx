import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import SelectLanguage from '../screens/SelectLanguage';
import LoginScreen from '../screens/auth/LoginScreen';
import MainAppSelector from './MainAppSelector';
import OTPVerification from '../screens/auth/OTPVerification';
import PinLoginScreen from '../screens/auth/PinLoginScreen';
import PinResetScreen from '../screens/auth/PinResetScreen';
import CreateIncidentScreen from '../screens/citizen/CreateIncidentScreen';
import RespondersList from '../screens/citizen/RespondersList';
import Profile from '../screens/auth/Profile';
import OTPVerifyForPin from '../screens/auth/OTPVerifyForPin';
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
        <Stack.Screen name="pinLoginScreen" component={PinLoginScreen} />
        <Stack.Screen name="pinResetScreen" component={PinResetScreen} />
        <Stack.Screen name="mainAppSelector" component={MainAppSelector} />
        <Stack.Screen name="otpVerification" component={OTPVerification} />
        <Stack.Screen name="otpVerifyForPin" component={OTPVerifyForPin} />
        <Stack.Screen
          name="createIncidentScreen"
          component={CreateIncidentScreen}
        />
        <Stack.Screen name="respondersList" component={RespondersList} />
        <Stack.Screen name="profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

export type AppStackNavigationProp<T extends keyof AppStackParamList> =
  NativeStackNavigationProp<AppStackParamList, T>;

type AppStackParamList = {
  splashScreen: undefined;
  selectLanguage: undefined;
  loginScreen: undefined;
  mainAppSelector: undefined;
  otpVerification: { data: any };
  otpVerifyForPin: { data: any };
  pinLoginScreen: { data: any };
  pinResetScreen: { data: any };
  createIncidentScreen: undefined;
  respondersList: undefined;
  profile: undefined;
};
