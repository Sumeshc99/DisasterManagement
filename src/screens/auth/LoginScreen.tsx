import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../navigation/AppNavigation';
import { COLOR } from '../../themes/Colors';
import { HEIGHT, WIDTH } from '../../themes/AppConst';
import { CustomDropdown } from '../../components/inputs/CustomDropdown';
import '../../../i18n';
import ApiManager from '../../apis/ApiManager';

const LoginScreen = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [phone, setPhone] = useState('');
  const [tehsil, setTehsil] = useState<string | null>(null);

  const [items, setItems] = useState([
    { label: 'Nagpur', value: 'nagpur' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Pune', value: 'pune' },
    { label: 'Nashik', value: 'nashik' },
    { label: 'Thane', value: 'thane' },
  ]);

  const handleLogin = () => {
    if (!phone || !tehsil) {
      Alert.alert('Validation error', 'Please fill all required fields');
      return;
    } else {
      const body = {
        mobile: '9841525240',
        tehsil: 1,
      };
      console.log('aaaaaazz');
      ApiManager.userLogin(body)
        .then(resp => {
          console.log('aaaaaa', resp.data);

          if (resp?.data?.status) {
            // navigation.navigate('otpVerification');
            navigation.navigate('pinLoginScreen');
          }
        })
        .catch(err => console.log('error', err.response));
    }
    navigation.navigate('otpVerification');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/bg2.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.95 }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: WIDTH(4),
              marginTop: HEIGHT(14),
            }}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>
              Please enter your Mobile Number and Tehsil
            </Text>

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />

            <CustomDropdown
              label="Select Tehsil"
              data={items}
              value={tehsil}
              setValue={setTehsil}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/user.png')}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  logo: { width: 100, height: 100, alignSelf: 'center', marginBottom: 30 },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    width: WIDTH(80),
    alignSelf: 'center',
  },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: COLOR.blue,
    borderRadius: 30,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});

export default LoginScreen;
