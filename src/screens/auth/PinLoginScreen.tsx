import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';

export default function PinLoginScreen() {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newValue = value.slice(-1);
    const updatedPin = [...pin];
    updatedPin[index] = newValue;
    setPin(updatedPin);
    setError('');

    if (newValue && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleNext = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 6) {
      setError('Please enter a valid 6-digit PIN');
      return;
    }

    Alert.alert('Success', `Logged in with PIN: ${enteredPin}`);
    navigation.replace('mainAppSelector');
  };

  const handleForgotPin = () => {
    navigation.navigate('pinResetScreen'); // replace with your reset screen name
  };

  const isComplete = pin.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/logo.png')}
          resizeMode="contain"
          style={styles.logo}
        />

        {/* Title */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Please enter your PIN code to log in
        </Text>

        {/* PIN Input */}
        <View style={styles.pinContainer}>
          {pin.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => (inputRefs.current[index] = el)}
              style={styles.pinInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={value => handlePinChange(index, value)}
            />
          ))}
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
          }}
          onPress={handleForgotPin}
        >
          <Text style={styles.forgotText}>Forgot PIN...?</Text>
        </TouchableOpacity>

        {/* Error */}
        {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, isComplete && styles.nextButtonActive]}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.nextButtonText,
              isComplete && styles.nextButtonTextActive,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Blue Wave */}
      {/* <View style={styles.waveContainer}>
        <View style={styles.waveShape} />
      </View> */}
    </View>
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
    paddingTop: 140,
    paddingBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  pinInput: {
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
  forgotText: {
    color: COLOR.blue,
    fontWeight: 700,
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginBottom: 10,
  },
  nextButton: {
    width: 140,
    paddingVertical: 14,
    backgroundColor: '#d1d5db',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  nextButtonActive: {
    backgroundColor: COLOR.blue,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  nextButtonTextActive: {
    color: '#ffffff',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 120,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  waveShape: {
    position: 'absolute',
    bottom: -20,
    width: '200%',
    height: 200,
    backgroundColor: COLOR.blue,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    transform: [{ scaleX: 0.6 }],
  },
});
