import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
} from 'react-native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../../components/OTPInput';
import ApiManager from '../../apis/ApiManager';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import { HEIGHT } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';

export default function OTPVerifyForPin() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const route = useRoute();

  const { showLoader, hideLoader } = useGlobalLoader();
  const showSnackbar = useSnackbar();

  const userData = (route?.params as { data?: any })?.data;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(900);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    sendOtp();
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  const sendOtp = async () => {
    const body = {
      username: userData.data.mobile_no,
    };
    showLoader();
    ApiManager.forgetPin(body, userData.token)
      .then(resp => {
        if (resp?.data?.status) {
          showSnackbar('OTP sent to your mobile number', 'success');
        } else {
          showSnackbar('Invalid OTP', 'error');
        }
      })
      .catch(err => showSnackbar('Something went wrong', 'error'))
      .finally(() => hideLoader());
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    const body = { mobile: userData.data.mobile_no };
    ApiManager.resendOtp(body)
      .then(resp => {
        if (resp?.data?.status) {
          setOtp('');
          setError('');
          setTimeLeft(900);
        } else {
          showSnackbar(resp?.data?.message || 'Failed to resend OTP', 'error');
        }
      })
      .catch(err => console.log('error', err.response))
      .finally(() => {
        setIsResending(false), hideLoader();
      });
  };

  const handleOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    } else {
      const body = {
        mobile: userData.data.mobile_no,
        otp: otp,
      };
      showLoader();
      ApiManager.verifyOtp(body)
        .then(resp => {
          if (resp?.data?.status) {
            navigation.replace('pinResetScreen', { data: userData });
          } else {
            showSnackbar('Invalid OTP', 'error');
          }
        })
        .catch(err => showSnackbar('Invalid OTP', 'error'))
        .finally(() => hideLoader());
    }
  };

  // 🔹 Validate and move next
  const handleNext = () => {};

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

        <Text style={styles.title}>{TEXT.otp_verification()}</Text>
        <Text style={styles.description}>
          {TEXT.please_enter_otp_sent_to()}
        </Text>
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneNumber}>{userData.data.mobile_no}</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.editIcon}
          >
            <Image source={require('../../assets/edit.png')} />
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
            {TEXT.otp_expire_in()}:{' '}
            <Text style={styles.timerValue}>{formatTime()}</Text>
          </Text>
        ) : (
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={isResending}
            style={styles.resendButton}
          >
            <Text style={styles.resendText}>
              {isResending ? 'Resending...' : TEXT.resend_otp()}
            </Text>
          </TouchableOpacity>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, isOtpComplete && styles.nextButtonActive]}
          onPress={handleOtp}
          disabled={!isOtpComplete}
        >
          <Text
            style={[
              styles.nextButtonText,
              isOtpComplete && styles.nextButtonTextActive,
            ]}
          >
            {TEXT.next()}
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
    paddingTop: HEIGHT(16),
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
  phoneNumber: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  resendText: { color: COLOR.blue, fontWeight: '600' },
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
