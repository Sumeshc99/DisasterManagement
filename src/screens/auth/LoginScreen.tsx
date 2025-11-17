import React, { useEffect, useState } from 'react';
import {
  Text,
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
import { FONT, HEIGHT, WIDTH } from '../../themes/AppConst';
import '../../../i18n';
import ApiManager from '../../apis/ApiManager';
import { useGlobalLoader } from '../../hooks/GlobalLoaderContext';
import { useForm } from 'react-hook-form';
import FormTextInput from '../../components/inputs/FormTextInput';
import DropDownInput from '../../components/inputs/DropDownInput';
import { useTranslation } from 'react-i18next';
import { TEXT } from '../../i18n/locales/Text';

interface LoginFormData {
  phone: string;
  tehsil: string;
}

const LoginScreen = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const { showLoader, hideLoader } = useGlobalLoader();
  const { t } = useTranslation();

  const [tahsilList, settahsilList] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      phone: '',
      tehsil: '',
    },
  });

  useEffect(() => {
    const getTahsil = () => {
      showLoader();
      ApiManager.tahsilList()
        .then(resp => {
          if (resp?.data?.success) {
            settahsilList(
              (resp?.data?.data?.tehsils || []).map((item: any) => ({
                label: item.Tehsil,
                value: item.id,
              })),
            );
          }
        })
        .catch(err => console.log('error', err.response))
        .finally(() => hideLoader());
    };

    getTahsil();
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    const { phone, tehsil } = data;

    const body = {
      mobile: phone,
      tehsil: tehsil,
    };

    showLoader();
    ApiManager.userLogin(body)
      .then(resp => {
        if (resp?.data?.status) {
          if (resp?.data?.data?.is_registered) {
            navigation.navigate('pinLoginScreen', { data: resp?.data });
          } else {
            navigation.navigate('otpVerification', { data: resp?.data });
          }
        } else {
          Alert.alert('Login Failed', resp?.data?.message || 'Unknown error');
        }
      })
      .catch(err => console.log('error', err.response))
      .finally(() => hideLoader());
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
              {TEXT.please_enter_your_mobile_telsil_name()}
            </Text>

            <FormTextInput
              name="phone"
              label={TEXT.your_phone_number()}
              control={control}
              placeholder={TEXT.enter_phone_number()}
              keyboardType="number-pad"
              rules={{
                required: TEXT.phone_number_is_required(),
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: TEXT.enter_valid_10_digit_number(),
                },
              }}
              error={errors.phone?.message as string}
            />

            <DropDownInput
              name="tehsil"
              label={TEXT.select_tehsil()}
              placeholder={TEXT.select_tehsil()}
              control={control}
              rules={{ required: TEXT.tehsil_is_required() }}
              items={tahsilList}
              errors={errors}
            />

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(handleLogin)}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/user.png')}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <Text style={styles.buttonText}>{TEXT.login()}</Text>
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
    fontFamily: FONT.R_SBD_600,
    color: COLOR.textGrey,
    textAlign: 'center',
    marginBottom: 30,
    width: WIDTH(80),
    alignSelf: 'center',
  },
  button: {
    marginTop: 30,
    flexDirection: 'row',
    backgroundColor: COLOR.blue,
    borderRadius: 35,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    width: 160,
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontFamily: FONT.R_BOLD_700 },
});

export default LoginScreen;
