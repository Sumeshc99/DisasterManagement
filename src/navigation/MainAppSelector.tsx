import React, { Suspense } from 'react';
import { View, ActivityIndicator } from 'react-native';
import CitizenNav from './userNav/CitizenNav';

// Fallback loader
const FallbackLoader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const MainAppSelector = () => {
  if (!userType) {
    return <FallbackLoader />;
  }

  return (
    <Suspense fallback={<FallbackLoader />}>
      {userType === 'citizen' && <CitizenNav />}
    </Suspense>
  );
};

export default MainAppSelector;

const userType = 'citizen';
