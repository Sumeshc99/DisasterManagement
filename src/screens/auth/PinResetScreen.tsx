import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../../components/OTPInput';
import { HEIGHT } from '../../themes/AppConst';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import ApiManager from '../../apis/ApiManager';

export default function PinResetScreen() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const route = useRoute();

  const { showLoader, hideLoader } = useGlobalLoader();
  const showSnackbar = useSnackbar();

  const userData = (route?.params as { data?: any })?.data;
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (newPin.length !== 6 || confirmPin.length !== 6) {
      setError('Please enter a valid 6-digit PIN in both fields.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match. Please re-enter.');
      return;
    }

    const body = {
      username: userData?.data?.mobile_no,
      newPin: newPin,
      confirmPin: confirmPin,
    };
    showLoader();
    ApiManager.resetPin(body, userData.token)
      .then(resp => {
        if (resp?.data?.status) {
          showSnackbar('PIN Changed successfully', 'success');
          navigation.replace('pinLoginScreen', { data: userData });
        } else {
          showSnackbar('Invalid PIN', 'error');
        }
      })
      .catch(err => console.log('aaa', err.response))
      .finally(() => hideLoader());
  };

  const isComplete = newPin.length === 6 && confirmPin.length === 6;

  return (
    <ImageBackground
      source={require('../../assets/bg2.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 0.95 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />

        {/* Title */}
        <Text style={styles.title}>PIN Reset</Text>
        <Text style={styles.description}>
          Securely reset your PIN in minutes.
        </Text>

        {/* New PIN */}
        <View style={styles.pinSection}>
          <Text style={styles.label}>New PIN</Text>
          <OTPInput
            onChangeOTP={value => {
              setNewPin(value);
              setError('');
            }}
          />
        </View>

        {/* Confirm PIN */}
        <View style={styles.pinSection}>
          <Text style={styles.label}>Confirm PIN</Text>
          <OTPInput
            onChangeOTP={value => {
              setConfirmPin(value);
              setError('');
            }}
          />
        </View>

        {/* Error Message */}
        {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isComplete && styles.submitButtonActive]}
          onPress={handleSubmit}
          disabled={!isComplete}
        >
          <Text
            style={[styles.submitText, isComplete && styles.submitTextActive]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    marginTop: HEIGHT(14),
  },
  logo: { width: 100, height: 100, marginBottom: 30 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 40 },
  pinSection: { marginBottom: 25, alignItems: 'center' },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  errorText: { color: '#ef4444', fontSize: 13, marginBottom: 10 },
  submitButton: {
    width: 140,
    paddingVertical: 14,
    backgroundColor: '#d1d5db',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonActive: { backgroundColor: COLOR.blue },
  submitText: { fontSize: 16, fontWeight: '600', color: '#4b5563' },
  submitTextActive: { color: '#ffffff' },
  description: {
    fontSize: 16,
    color: '#525151',
    marginBottom: 20,
    fontWeight: '500',
    marginTop: 10,
  },
});
