import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'user_language';

const resources = {
  en: {
    translation: {
      selectLanguage: 'Select Language',
      next: 'Next',
      welcome: 'Welcome',
      // Add more translations
      home: 'Home',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
  },
  hi: {
    translation: {
      selectLanguage: 'भाषा चुनें',
      next: 'अगला',
      welcome: 'स्वागत है',
      home: 'होम',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      logout: 'लॉगआउट',
    },
  },
  mr: {
    translation: {
      selectLanguage: 'भाषा निवडा',
      next: 'पुढे',
      welcome: 'स्वागतम्',
      home: 'होम',
      profile: 'प्रोफाइल',
      settings: 'सेटिंग्स',
      logout: 'लॉगआउट',
    },
  },
};

// Save language to AsyncStorage
export const saveLanguage = async (languageCode: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Get saved language from AsyncStorage
export const getSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

export default i18n;
