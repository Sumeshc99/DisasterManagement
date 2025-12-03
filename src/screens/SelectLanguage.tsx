import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ImageBackground,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
import { FONT, HEIGHT, WIDTH } from '../themes/AppConst';
import { COLOR } from '../themes/Colors';
import i18n from '../i18n/i18n';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../store/slices/LanguageSlice';

const SelectLanguage = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages: any = [
    {
      id: 1,
      name: 'English',
      code: 'en',
      subText: '',
      icon: require('../assets/e.png'),
      icon1: require('../assets/e1.png'),
    },
    {
      id: 2,
      name: 'Marathi',
      code: 'mr',
      subText: 'मराठी',
      icon: require('../assets/h.png'),
      icon1: require('../assets/h1.png'),
    },
    {
      id: 3,
      name: 'Hindi',
      code: 'hi',
      subText: 'हिन्दी',
      icon: require('../assets/m.png'),
      icon1: require('../assets/m1.png'),
    },
  ];

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        // 1️⃣ Ask Location first
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (locationGranted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location Granted');

          // 2️⃣ Only after location → ask Camera
          const cameraGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );

          if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Camera Granted');
          }
        }
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    SelectLanguage(languages[0]);
  }, []);

  const SelectLanguage = (item: any) => {
    setSelectedLanguage(item.name);
    i18n.changeLanguage(item.code);
    dispatch(setLanguage(item.code));
  };

  const handleNext = () => {
    navigation.navigate('loginScreen');
  };

  return (
    <ImageBackground
      source={require('../assets/bg1.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.95 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLOR.blue} barStyle="light-content" />

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Image
            source={require('../assets/citizen/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Select Language</Text>

          <View style={styles.languageRow}>
            {languages.map((lang: any) => (
              <TouchableOpacity
                key={lang.id}
                style={[
                  styles.languageCard,
                  selectedLanguage === lang.name && styles.selectedCard,
                ]}
                onPress={() => SelectLanguage(lang)}
              >
                <View>
                  <Text
                    style={[
                      styles.languageText,
                      selectedLanguage === lang.name && styles.selectedText,
                    ]}
                  >
                    {lang.name}
                  </Text>

                  {lang.subText ? (
                    <Text
                      style={[
                        styles.subText,
                        selectedLanguage === lang.name && styles.selectedText,
                      ]}
                    >
                      {lang.subText}
                    </Text>
                  ) : null}
                </View>

                <Image
                  source={
                    selectedLanguage === lang.name ? lang.icon1 : lang.icon
                  }
                  style={styles.icon}
                />

                <View
                  style={[
                    styles.radioOuter,
                    selectedLanguage === lang.name && styles.radioSelected,
                  ]}
                >
                  {selectedLanguage === lang.name && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SelectLanguage;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: HEIGHT(6),
    paddingHorizontal: WIDTH(4),
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.R_SBD_600,
    color: COLOR.white,
    marginBottom: 30,
  },
  languageRow: {
    flexDirection: 'row',
    gap: WIDTH(4),
    marginTop: HEIGHT(10),
    flexWrap: 'wrap',
  },
  languageCard: {
    backgroundColor: '#dcdcdc',
    borderRadius: 12,
    width: WIDTH(44),
    flexDirection: 'row',
    alignItems: 'center',
    padding: WIDTH(4),
  },
  selectedCard: {
    backgroundColor: COLOR.blue,
  },
  languageText: {
    fontFamily: FONT.R_SBD_600,
    color: COLOR.textGrey,
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
    fontFamily: FONT.R_SBD_600,
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 'auto',
    marginRight: 25,
  },
  radioOuter: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#828282',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  radioSelected: {
    borderColor: '#fff',
  },
  nextButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: HEIGHT(10),
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: FONT.R_SBD_600,
  },
});
