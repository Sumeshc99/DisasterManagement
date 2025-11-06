import React from 'react';
import { View, StyleSheet } from 'react-native';
import OtpInputs from 'react-native-otp-inputs';
import { WIDTH } from '../themes/AppConst';

interface OTPInputProps {
  length?: number;
  onChangeOTP: (otp: string) => void;
  containerStyle?: object;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onChangeOTP,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <OtpInputs
        handleChange={(code: string) => onChangeOTP(code)}
        numberOfInputs={length}
        autofillFromClipboard={false}
        inputStyles={styles.otpInput}
        style={styles.otpRow}
      />
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otpInput: {
    width: WIDTH(11),
    height: WIDTH(12),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    marginHorizontal: 8,
  },
});
