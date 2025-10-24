import { StyleSheet } from 'react-native';
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import GetCurrentLocation from './config/GetCurrentLocation';
import { GlobalLoaderProvider } from './hooks/GlobalLoaderContext';
import { SnackbarProvider } from './hooks/SnackbarProvider';
import GlobalLoader from './components/GlobalLoader';

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
      <GlobalLoaderProvider>
        <SnackbarProvider>
          <GetCurrentLocation />
          <AppNavigation />
          <GlobalLoader />
        </SnackbarProvider>
      </GlobalLoaderProvider>
    </PaperProvider>
  );
};

export default MainIndex;

const styles = StyleSheet.create({});
