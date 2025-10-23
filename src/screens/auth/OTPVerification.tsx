import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../../components/OTPInput';
import ApiManager from '../../apis/ApiManager';

export default function OTPVerification() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isResending, setIsResending] = useState(false);

  // 🔹 Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🔹 Format timer (MM:SS)
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  // 🔹 Login / OTP Verify function
  const handleOtp = async () => {
    const body = { mobile: '9841525240', tehsil: 1 };
    try {
      const resp = await ApiManager.userLogin(body);
      if (resp?.data?.status) {
        navigation.replace('mainAppSelector');
      }
    } catch (err) {
      // console.log('error', err.response);
    }
    navigation.replace('mainAppSelector');
  };

  // 🔹 Resend OTP API + restart timer
  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const body = { mobile: '9841525240' };
      const resp = await ApiManager.resendOtp(body);
      if (resp?.data?.status) {
        setOtp('');
        setError('');
        setTimeLeft(90);
      }
    } catch (err) {
      // console.log('resend error', err.response);
    } finally {
      setIsResending(false);
    }
  };

  // 🔹 Validate and move next
  const handleNext = () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    handleOtp();
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

        {/* OTP Input */}
        <OTPInput
          onChangeOTP={value => {
            setOtp(value);
            setError('');
          }}
        />

        {/* Error */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        ) : null}

        {/* Timer OR Resend Button */}
        {timeLeft > 0 ? (
          <Text style={styles.timerText}>
            OTP will expire in:{' '}
            <Text style={styles.timerValue}>{formatTime()}</Text>
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={isResending}
            style={styles.resendButton}
          >
            <Text style={styles.resendText}>
              {isResending ? 'Resending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        )}

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
  resendButton: {
    marginVertical: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLOR.blue,
  },
  resendText: { color: '#fff', fontWeight: '600' },
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
