import React from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { FONT } from '../themes/AppConst';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const BiometricAuth = ({ response }: any) => {
  const authenticate = async () => {
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert('Error', 'Biometric authentication not available');
        return;
      }

      const promptMessage =
        Platform.OS === 'ios'
          ? biometryType === ReactNativeBiometrics.FaceID
            ? 'Authenticate with Face ID'
            : 'Authenticate with Touch ID'
          : 'Authenticate with Fingerprint';

      const result = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel',
      });

      if (result.success) {
        response();
      } else {
        Alert.alert('Failed', 'Authentication cancelled');
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Login</Text>
      <Button title="Authenticate" onPress={authenticate} />
    </View>
  );
};

export default BiometricAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: FONT.R_MED_500,
    marginBottom: 20,
  },
});
