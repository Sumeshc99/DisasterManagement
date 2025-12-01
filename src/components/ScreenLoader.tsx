import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import { COLOR } from '../themes/Colors';

const ScreenLoader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={COLOR.blue} />
    </View>
  );
};

export default ScreenLoader;

const styles = StyleSheet.create({});
