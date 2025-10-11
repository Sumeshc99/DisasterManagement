import React, { Suspense, lazy, memo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import CitizenNav from './userNav/CitizenNav';
import ReceiverNav from './userNav/ReceiverNav';
import ResponderNav from './userNav/ResponderNav';

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
      {/* {userType === 'receiver' && <ReceiverNav />}
      {userType === 'ResponderNav' && <ResponderNav />} */}
    </Suspense>
  );
};

export default MainAppSelector;

const userType = 'citizen';
