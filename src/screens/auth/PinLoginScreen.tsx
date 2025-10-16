import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../../components/OTPInput';

export default function OTPVerification() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(540);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  const handleNext = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    // Alert.alert('Success', `OTP Verified: ${otp}`);
    navigation.replace('mainAppSelector');
  };

  const handleForgotPin = () => {
    navigation.navigate('pinResetScreen');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={{ width: 100, height: 100, marginTop: 60 }}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Login</Text>

      <Text style={styles.description}>
        Please enter your PIN code to log in
      </Text>

      {/* Reusable OTP Component */}
      <OTPInput
        onChangeOTP={value => {
          setOtp(value);
          setError('');
        }}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: 'flex-end',
          alignSelf: 'flex-end',
        }}
        onPress={handleForgotPin}
      >
        <Text style={styles.forgotText}>Forgot PIN...?</Text>
      </TouchableOpacity>

      {/* <Text style={styles.timerText}>
        OTP will expire in:{' '}
        <Text style={styles.timerValue}>{formatTime()} minutes</Text>
      </Text> */}

      <TouchableOpacity
        style={[styles.nextButton, otp.length === 6 && styles.nextButtonActive]}
        onPress={handleNext}
      >
        <Text
          style={[
            styles.nextButtonText,
            otp.length === 6 && styles.nextButtonTextActive,
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.white },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 100,
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginTop: 30 },
  description: {
    fontSize: 16,
    color: '#525151',
    marginBottom: 20,
    fontWeight: '500',
    marginTop: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  phoneNumber: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  editIcon: { padding: 4 },
  editIconText: { fontSize: 16, color: '#9ca3af' },
  errorText: { fontSize: 13, color: '#ef4444', marginTop: 8 },
  timerText: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 24,
    marginTop: 20,
  },
  timerValue: { fontWeight: '600', color: '#1f2937' },
  nextButton: {
    width: 140,
    paddingVertical: 14,
    backgroundColor: '#d1d5db',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#4b5563' },
  nextButtonActive: { backgroundColor: COLOR.blue },
  nextButtonTextActive: { color: '#ffffff' },
  forgotText: {
    marginTop: 10,
    color: COLOR.blue,
    fontWeight: 700,
    fontSize: 14,
  },
});
