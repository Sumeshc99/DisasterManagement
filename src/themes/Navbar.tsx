import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Navbar = () => {
  const insets = useSafeAreaInsets();
  const navBarHeight = insets.bottom > 0 ? insets.bottom : 0;

  return <View style={[styles.container, { height: navBarHeight }]} />;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Navbar;
