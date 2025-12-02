import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import OTPInput from '../OTPInput';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';
import { useSnackbar } from '../../hooks/SnackbarProvider';
import { TEXT } from '../../i18n/locales/Text';

interface Props {
  onUpdatePress: () => void;
}

const ChangePinSheet = forwardRef<React.ComponentRef<typeof RBSheet>, Props>(
  ({ onUpdatePress }, ref) => {
    const showSnackbar = useSnackbar();
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
        } else {
          setError(resp?.data?.error || TEXT.unable_change_pin());
        }
      } catch (error: any) {
        const apiError =
          error?.response?.data?.error || TEXT.somethingwent_whrong();
        console.log('Error changing pin:', apiError);

        setError(apiError);
        showSnackbar(apiError, 'error');
      }
    };

    const handleSendOtp = () => {
      if (!currentPin || !newPin || !confirmPin) {
        setError(TEXT.all_fields_required());
        return;
      }
      if (newPin !== confirmPin) {
        setError(TEXT.new_confirm_not_match());
        return;
      }

      setError('');
      ChangeCurrentPin();
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

            <Text style={styles.title}>{TEXT.change_pin()}</Text>

            <View style={{ gap: 10, marginTop: 30, marginBottom: 10 }}>
              <View>
                <Text style={styles.txt}>{TEXT.current_pin()}</Text>
                <OTPInput
                  onChangeOTP={value => {
                    setCurrentPin(value);
                    setError('');
                  }}
                />
              </View>

              <View>
                <Text style={styles.txt}>{TEXT.new_pin()}</Text>
                <OTPInput
                  onChangeOTP={value => {
                    setNewPin(value);
                    setError('');
                  }}
                />
              </View>

              <View>
                <Text style={styles.txt}>{TEXT.confirm_pin()}</Text>
                <OTPInput
                  onChangeOTP={value => {
                    setConfirmPin(value);
                    setError('');
                  }}
                />
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleSendOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>{TEXT.send_otp()}</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
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
  txt: {
    fontWeight: '500',
    marginBottom: 4,
  },
  updateButton: {
    backgroundColor: COLOR.blue,
    marginTop: 20,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default ChangePinSheet;
