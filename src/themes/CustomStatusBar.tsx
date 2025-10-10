import React from 'react';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomStatusBar = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ height: insets.top, backgroundColor: '#f6f6f6ff' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
    </View>
  );
};

export default CustomStatusBar;
