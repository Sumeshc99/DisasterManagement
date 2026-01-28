import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashBoardHeader from '../components/header/DashBoardHeader';
import { COLOR } from '../themes/Colors';
import RightDrawer from '../components/RightDrawer';

const InformationPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <DashBoardHeader drawer={drawerOpen} setDrawer={setDrawerOpen} />
      <View style={styles.mapContainer}>
        <Text>Information Page</Text>
      </View>

      <RightDrawer
        open={drawerOpen}
        changePass={() => {
          setDrawerOpen(false);
        }}
        onClose={() => setDrawerOpen(false)}
      />
    </SafeAreaView>
  );
};

export default InformationPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.blue },
  mapContainer: { flex: 1, backgroundColor: COLOR.white },
});
