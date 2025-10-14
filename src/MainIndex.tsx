import { StyleSheet } from 'react-native';
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import GetCurrentLocation from './config/GetCurrentLocation';

const MainIndex = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };

  return (
    <PaperProvider theme={theme}>
      {/* <GetCurrentLocation /> */}
      <AppNavigation />
    </PaperProvider>
  );
};

export default MainIndex;

const styles = StyleSheet.create({});
