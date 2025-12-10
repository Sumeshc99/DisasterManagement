import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import { WIDTH } from '../themes/AppConst';
import { COLOR } from '../themes/Colors';

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
  const [otp, setOtp] = useState('');

  useEffect(() => {
    onChangeOTP(otp);
  }, [otp]);

  return (
    <View style={[styles.container, containerStyle]}>
      <OTPTextInput
        inputCount={length}
        handleTextChange={(code: string) => setOtp(code)}
        containerStyle={styles.otpRow}
        textInputStyle={styles.otpInput}
        tintColor={COLOR.blue}
        offTintColor="#ccc"
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
  },
  otpInput: {
    width: WIDTH(11),
    height: WIDTH(12),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 18,
    color: COLOR.textGrey,
    marginHorizontal: 8,
  },
});
