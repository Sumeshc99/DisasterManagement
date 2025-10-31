import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../OTPInput';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

interface Props {
  onUpdatePress: () => void;
}

const ChangePinSheet = forwardRef<React.ComponentRef<typeof RBSheet>, Props>(
  ({ onUpdatePress }, ref) => {
    const { user, userToken } = useSelector((state: RootState) => state.auth);

    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');

    const ChangeCurrentPin = async () => {
      const body = {
        username: user?.mobile_no,
        currentPin,
        newPin,
        confirmPin,
      };

      try {
        const resp: any = await ApiManager.changePin(body, userToken);
        if (resp?.data?.status) {
          setError('');
          onUpdatePress();
        }
      } catch (error) {
        console.log('Error changing pin:', error);
      }
    };

    const handleSendOtp = () => {
      if (!currentPin || !newPin || !confirmPin) {
        setError('All fields are required');
        return;
      }
      if (newPin !== confirmPin) {
        setError('New PIN and Confirm PIN do not match');
        return;
      }

      setError('');
      ChangeCurrentPin();
      // otpRef.current?.open();
    };

    return (
      <>
        <RBSheet
          ref={ref}
          closeOnPressMask
          height={500}
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

            <Text style={styles.title}>Change PIN</Text>

            <View style={{ gap: 10, marginTop: 30, marginBottom: 40 }}>
              <View>
                <Text style={styles.txt}>Current PIN</Text>
                <OTPInput
                  onChangeOTP={value => {
                    setCurrentPin(value);
                    setError('');
                  }}
                />
              </View>

              <View>
                <Text style={styles.txt}>New PIN</Text>
                <OTPInput
                  onChangeOTP={value => {
                    setNewPin(value);
                    setError('');
                  }}
                />
              </View>

              <View>
                <Text style={styles.txt}>Confirm PIN</Text>
                <OTPInput
                  onChangeOTP={value => {
                    setConfirmPin(value);
                    setError('');
                  }}
                />
              </View>
            </View>

            {error ? (
              <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleSendOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/* {showOtp && (
          <OtpVerificationSheet
            ref={otpRef}
            onOtpVerified={() => {
              otpRef.current?.close();
              (ref as any)?.current?.close();
              ChangeCurrentPin();
            }}
          />
        )} */}
      </>
    );
  },
);

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    color: COLOR.blue,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
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
  updateButton: {
    backgroundColor: COLOR.blue,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  txt: {
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default ChangePinSheet;
