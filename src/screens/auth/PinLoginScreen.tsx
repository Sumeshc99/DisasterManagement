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
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../../components/OTPInput';
import { FONT, HEIGHT } from '../../themes/AppConst';
import ApiManager from '../../apis/ApiManager';
import { useDispatch } from 'react-redux';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import { setUser, userToken } from '../../store/slices/authSlice';
import { TEXT } from '../../i18n/locales/Text';
import BiometricAuth from '../../components/BiometricAuth';

export default function OTPVerification() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();
  const route = useRoute();

  const { showLoader, hideLoader } = useGlobalLoader();
  const showSnackbar = useSnackbar();

  const userData = (route?.params as { data?: any })?.data;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(540);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = async (type?: string) => {
    if (type !== 'biometric') {
      if (otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
      } else {
        getUserData();
      }
    } else {
      showSnackbar(TEXT.pin_verified(), 'success');
      dispatch(
        setUser({
          id: userData?.data?.id,
          full_name: userData?.data?.full_name,
          mobile_no: userData?.data?.mobile_no,
          email: userData?.data?.email,
          role: userData?.data?.role,
          tehsil: userData?.data?.tehsil,
          is_registered: userData?.data?.is_registered,
        }),
      );
      dispatch(userToken(userData?.token));
      navigation.replace('mainAppSelector');
    }
  };

  const getUserData = async () => {
    const body = {
      mobile: userData.data.mobile_no,
      pin: otp,
    };
    showLoader();
    ApiManager.verifyPin(body, userData.token)
      .then(resp => {
        if (resp?.data?.status) {
          showSnackbar(TEXT.pin_verified(), 'success');
          dispatch(
            setUser({
              id: resp?.data?.data?.id,
              full_name: userData?.data?.full_name,
              mobile_no: resp?.data?.data?.mobile_no,
              email: resp?.data?.data?.email,
              role: resp?.data?.data?.role,
              tehsil: userData?.data?.tehsil,
              is_registered: userData?.data?.is_registered,
            }),
          );
          dispatch(userToken(userData?.token));
          navigation.replace('mainAppSelector');
        } else {
          showSnackbar('Please enter correct pin', 'error');
        }
      })
      .catch(err => showSnackbar('Please enter correct pin', 'error'))
      .finally(() => hideLoader());
  };

  const handleForgotPin = () => {
    navigation.replace('otpVerifyForPin', { data: userData });
  };

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
            source={require('../../assets/appLogo1.png')}
            resizeMode="contain"
            style={{ width: 100, height: 100, marginTop: 60 }}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{TEXT.login()}</Text>

        <Text style={styles.description}>{TEXT.please_enter_pin_code()}</Text>

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
          <Text style={styles.forgotText}>{TEXT.forgot_pin()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            otp.length === 6 && styles.nextButtonActive,
          ]}
          disabled={otp.length < 6 && true}
          onPress={() => handleNext('otp')}
        >
          <Text
            style={[
              styles.nextButtonText,
              otp.length === 6 && styles.nextButtonTextActive,
            ]}
          >
            {TEXT.next()}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={{ marginTop: 40 }}>
          <Image
            style={{ width: 80, height: 80 }}
            source={require('../../assets/fingerPrint.png')}
          />
        </TouchableOpacity> */}
        <View style={{ flex: 1, marginTop: 30 }}>
          <BiometricAuth response={() => handleNext('biometric')} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: HEIGHT(14),
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: FONT.R_SBD_600,
    color: COLOR.textGrey,
    marginTop: 30,
  },
  description: {
    fontSize: 16,
    color: '#525151',
    marginBottom: 20,
    fontFamily: FONT.R_MED_500,
    marginTop: 20,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  phoneNumber: {
    fontSize: 16,
    fontFamily: FONT.R_SBD_600,
    color: COLOR.textGrey,
  },
  editIcon: { padding: 4 },
  editIconText: { fontSize: 16, color: '#9ca3af' },
  errorText: { fontSize: 13, color: '#ef4444', marginTop: 8 },
  timerText: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 24,
    marginTop: 20,
  },
  timerValue: { fontFamily: FONT.R_SBD_600, color: '#1f2937' },
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
    fontFamily: FONT.R_SBD_600,
    color: COLOR.textGrey,
  },
  nextButtonActive: { backgroundColor: COLOR.blue },
  nextButtonTextActive: { color: '#ffffff' },
  forgotText: {
    marginTop: 10,
    color: COLOR.blue,
    fontWeight: 700,
    fontSize: 14,
  },
});
