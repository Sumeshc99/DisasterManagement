import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';

export default function OTPVerification() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const [timeLeft, setTimeLeft] = useState(540);

  React.useEffect(() => {
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

  const handleKeyPress = (index: number, value: any) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleNext = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    Alert.alert('Success', `OTP Verified: ${otpString}`);
    navigation.replace('mainAppSelector');
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* <View style={styles.logoBorder}> */}
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={{ width: 100, height: 100, marginTop: 60 }}
        />
        {/* </View> */}
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

      {/* OTP Input Fields */}
      <View style={styles.otpInputContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => (inputRefs.current[index] = el)}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={value => handleKeyPress(index, value)}
            placeholder=""
            placeholderTextColor="#ccc"
          />
        ))}
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 100, // ⬅️ increased from 40 to 100 for better vertical centering
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 40, // slightly more spacing
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 30, // slightly more space below logo
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40, // more breathing room before OTP inputs
    gap: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  editIcon: {
    padding: 4,
  },
  editIconText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  otpInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
  },
  timerText: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 24,
  },
  timerValue: {
    fontWeight: '600',
    color: '#1f2937',
  },
  nextButton: {
    width: 140,
    paddingVertical: 14,
    backgroundColor: '#d1d5db',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  nextButtonActive: {
    backgroundColor: COLOR.blue,
  },
  nextButtonTextActive: {
    color: '#ffffff',
  },
});
