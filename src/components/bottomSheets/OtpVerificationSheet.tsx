import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../OTPInput';
import { TEXT } from '../../i18n/locales/Text';

interface Props {
  onOtpVerified: () => void;
}

const OtpVerificationSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  Props
>(({ onOtpVerified }, ref) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setError('');
    onOtpVerified();
  };

  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={300}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        <View style={styles.dragIndicator} />

        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={() => (ref as any)?.current?.close()}
        >
          <Image
            source={require('../../assets/cancel.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{TEXT.otp_verification()}</Text>

        <View style={{ marginTop: 20, marginBottom: 30 }}>
          <Text style={styles.txt}>Please enter OTP</Text>
          <OTPInput
            onChangeOTP={value => {
              setOtp(value);
              setError('');
            }}
          />
        </View>

        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: COLOR.blue,
    fontWeight: '700',
    textAlign: 'center',
  },
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 25,
    position: 'relative',
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  txt: {
    fontWeight: '500',
    marginBottom: 4,
  },
  verifyButton: {
    backgroundColor: COLOR.blue,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OtpVerificationSheet;
