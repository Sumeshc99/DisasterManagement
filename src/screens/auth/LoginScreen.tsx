import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { HEIGHT } from '../../config/AppConst';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import Svg, { Path } from 'react-native-svg';

interface TehsilOption {
  label: string;
  value: string;
}

const LoginScreen = () => {
  const navigation = useNavigation<AppStackNavigationProp<'otpVerification'>>();
  const { t, i18n } = useTranslation();
  const [selectedLanguage] = React.useState<string>(i18n.language);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedTehsil, setSelectedTehsil] = useState<string>('');
  const [showTehsilDropdown, setShowTehsilDropdown] = useState<boolean>(false);

  const tehsilOptions: TehsilOption[] = [
    { label: 'Select tehsil', value: '' },
    { label: 'Nagpur', value: 'nagpur' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Pune', value: 'pune' },
    { label: 'Nashik', value: 'nashik' },
    { label: 'Thane', value: 'thane' },
  ];

  const handlePhoneChange = (text: string) => {
    if (text.length <= 10) {
      setPhoneNumber(text);
      if (text.length === 10) {
        Keyboard.dismiss();
      }
    }
  };

  const handleLogin = () => {
    if (!phoneNumber || !selectedTehsil) {
      Alert.alert('Please fill all required fields');
      return;
    }
    navigation.navigate('otpVerification');
  };

  const handleTehsilSelect = (value: string) => {
    setSelectedTehsil(value);
    setShowTehsilDropdown(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Please enter your Mobile</Text>
            <Text style={styles.title}>Number and Tehsil</Text>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Your Phone Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999999"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              {/* Tehsil Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Select Tehsil <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowTehsilDropdown(!showTehsilDropdown)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      !selectedTehsil && styles.placeholderText,
                    ]}
                  >
                    {selectedTehsil
                      ? tehsilOptions.find(t => t.value === selectedTehsil)?.label
                      : 'Select tehsil'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {showTehsilDropdown && (
                  <View style={styles.dropdownList}>
                    {tehsilOptions.map((option, index) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          index === tehsilOptions.length - 1 &&
                          styles.dropdownItemLast,
                        ]}
                        onPress={() => handleTehsilSelect(option.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <View style={styles.loginButtonContent}>
                  <View style={styles.userIcon}>
                    <Text style={styles.userIconText}>👤</Text>
                  </View>
                  <Text style={styles.loginButtonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>


          </ScrollView>
          {/* 👇 Wave as footer inside scroll */}
          <View style={styles.footerWave}>
            <Svg
              height="100"
              width="100%"
              viewBox="0 0 512 230"
              preserveAspectRatio="none"
            >
              <Path
                d="M0,180 C100,120 250,240 400,160 C470,120 512,50 512,50 L512,230 L0,230 Z"
                fill="#125FAA"
              />
            </Svg>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: HEIGHT(16),
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
    lineHeight: 32,
  },
  formContainer: {
    marginTop: 40,
  },
  inputGroup: {
    marginBottom: 24,
    position: 'relative',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#424242',
    marginBottom: 8,
  },
  required: {
    color: '#D32F2F',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333333',
  },
  placeholderText: {
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#757575',
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333333',
  },
  loginButton: {
    backgroundColor: '#1565C0',
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 16,
    alignItems: 'center',
    elevation: 8,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userIconText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerWave: {
    marginTop: 60,
  },
});

export default LoginScreen;
