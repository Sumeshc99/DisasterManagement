import { useNavigation, useRoute } from '@react-navigation/native';
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
import { useDispatch } from 'react-redux';
import { setUser, userToken } from '../../store/slices/authSlice';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import { HEIGHT } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';

export default function OTPVerification() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();
  const route = useRoute();

  const { showLoader, hideLoader } = useGlobalLoader();
  const showSnackbar = useSnackbar();

  const userData = (route?.params as { data?: any })?.data;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isResending, setIsResending] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timerKey, timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  const handleOtp = async () => {
    const body = {
      mobile: userData.data.mobile_no,
      otp: otp,
    };
    showLoader();
    ApiManager.verifyOtp(body)
      .then(resp => {
        if (resp?.data?.status) {
          dispatch(
            setUser({
              id: resp?.data?.data?.id,
              full_name: userData?.data?.full_name,
              mobile_no: resp?.data?.data?.mobile_no,
              email: resp?.data?.data?.email,
              role: resp?.data?.data?.role,
              tehsil: userData?.data?.tehsil,
              is_registered: resp?.data?.data?.is_registered,
            }),
          );
          dispatch(userToken(resp?.data?.token));
          navigation.replace('mainAppSelector');
        } else {
          showSnackbar('Invalid OTP', 'error');
        }
      })
      .catch(err => showSnackbar(err?.response?.data?.message, 'error'))
      .finally(() => hideLoader());
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    const body = { mobile: userData.data.mobile_no };

    showLoader();
    ApiManager.resendOtp(body)
      .then(resp => {
        if (resp?.data?.status) {
          setOtp('');
          setError('');
          setTimeLeft(600);
          setTimerKey(prev => prev + 1);
          showSnackbar('OTP resent successfully!', 'success');
        } else {
          showSnackbar(resp?.data?.message || 'Failed to resend OTP', 'error');
        }
      })
      .catch(err => {
        console.log('error', err.response);
        showSnackbar('Something went wrong', 'error');
      })
      .finally(() => {
        setIsResending(false);
        hideLoader();
      });
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.timerText}>
            {TEXT.otp_expire_in()}:{' '}
            <Text style={styles.timerValue}>
              {formatTime()} {TEXT.minutes()}
            </Text>
          </Text>
          {timeLeft <= 0 && (
            <Text onPress={handleResendOtp} style={styles.timerValue1}>
              {TEXT.resend_otp()}
            </Text>
          )}
        </View>

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
    paddingTop: HEIGHT(14),
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 30,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8C8C8C',
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  phoneNumber: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  editIcon: { padding: 4 },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, color: '#ef4444' },
  timerText: { color: '#4b5563', marginVertical: 24, gap: 10 },
  timerValue: { fontWeight: '600', color: '#1f2937' },
  timerValue1: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 18,
  },
  resendButton: {
    marginVertical: 24,
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
