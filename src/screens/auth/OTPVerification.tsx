import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../../components/OTPInput';

export default function OTPVerification() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  const [otp, setOtp] = useState(''); // OTP as string
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(540); // 9 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
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
    Alert.alert('Success', `OTP Verified: ${otp}`);
    navigation.replace('mainAppSelector');
  };

  const isOtpComplete = otp.length === 6;

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
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            resizeMode="contain"
            style={{ width: 100, height: 100, marginTop: 60 }}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>OTP Verification</Text>

        {/* Description */}
        <Text style={styles.description}>Please enter the OTP sent to</Text>
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneNumber}>8626054838</Text>
          <TouchableOpacity style={styles.editIcon}>
            <Text style={styles.editIconText}>✎</Text>
          </TouchableOpacity>
        </View>

        {/* Reusable OTP Component */}
        <OTPInput
          onChangeOTP={value => {
            setOtp(value);
            setError('');
          }}
        />

        {/* Error Message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        ) : null}

        {/* Timer */}
        <Text style={styles.timerText}>
          OTP will expire in:{' '}
          <Text style={styles.timerValue}>{formatTime()} minutes</Text>
        </Text>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, isOtpComplete && styles.nextButtonActive]}
          onPress={handleNext}
          disabled={!isOtpComplete}
        >
          <Text
            style={[
              styles.nextButtonText,
              isOtpComplete && styles.nextButtonTextActive,
            ]}
          >
            Next
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
  description: { fontSize: 14, color: '#9ca3af', marginBottom: 6 },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  phoneNumber: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  editIcon: { padding: 4 },
  editIconText: { fontSize: 16, color: '#9ca3af' },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: '#ef4444' },
  timerText: { fontSize: 13, color: '#4b5563', marginVertical: 24 },
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
});
