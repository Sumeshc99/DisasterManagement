import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useGlobalLoader } from '../hooks/GlobalLoaderContext';

const GlobalLoader: React.FC = () => {
  const { loading } = useGlobalLoader();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={loading}
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GlobalLoader;
