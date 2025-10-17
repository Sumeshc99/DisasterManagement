import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WIDTH } from '../config/AppConst';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
import WaveBackgroundHeader from './auth/WaveBackgroundHeader';
import { useTranslation } from 'react-i18next';
import { saveLanguage, getSavedLanguage } from '../../i18n';

const SelectLanguage = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages: any = [
    {
      id: 1,
      name: 'English',
      code: 'en',
      subText: '',
      icon: require('../assets/citizen/english-icon.png'),
    },
    {
      id: 2,
      name: 'Marathi',
      code: 'mr',
      subText: 'मराठी',
      icon: require('../assets/citizen/hindi-icon.png'),
    },
    {
      id: 3,
      name: 'Hindi',
      code: 'hi',
      subText: 'हिन्दी',
      icon: require('../assets/citizen/hindi-icon.png'),
    },
  ];

  // Load saved language on component mount
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    const savedLang = await getSavedLanguage();
    setSelectedLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  };

  const handleLanguageSelect = async (langCode: string) => {
    setSelectedLanguage(langCode);
    // Change language immediately
    await i18n.changeLanguage(langCode);
    // Save to AsyncStorage
    await saveLanguage(langCode);
  };

  const handleNext = () => {
    console.log('Selected language:', selectedLanguage);
    navigation.navigate('loginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1E4A92" barStyle="light-content" />

      {/* Blue Header */}
      <View>
        <WaveBackgroundHeader />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Title */}
        <Text style={styles.pageTitle}>{t('selectLanguage')}</Text>

        {/* Language Cards */}
        <View style={styles.languageRow}>
          {languages.map((lang: any) => (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.languageCard,
                selectedLanguage === lang.code && styles.selectedCard,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <View>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === lang.code && styles.selectedText,
                  ]}
                >
                  {lang.name}
                </Text>
                {lang.subText ? (
                  <Text
                    style={[
                      styles.subText,
                      selectedLanguage === lang.code && styles.selectedSubText,
                    ]}
                  >
                    {lang.subText}
                  </Text>
                ) : null}
              </View>

              <Image source={lang.icon} style={styles.icon} />
              <View
                style={[
                  styles.radioOuter,
                  selectedLanguage === lang.code && styles.radioSelected,
                ]}
              >
                {selectedLanguage === lang.code && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>{t('next')}</Text>
        </TouchableOpacity>

        {/* Current Language Info */}
        <Text style={styles.infoText}>
          Current: {selectedLanguage.toUpperCase()}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4A92',
    marginBottom: 30,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  languageCard: {
    backgroundColor: '#dcdcdcff',
    borderRadius: 12,
    width: WIDTH(42),
    flexDirection: 'row',
    padding: 12,
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#1E4A92',
  },
  languageText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  selectedSubText: {
    color: '#E0E0E0',
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginTop: 8,
  },
  radioOuter: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#828282ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  radioSelected: { borderColor: '#fff' },
  nextButton: {
    backgroundColor: '#1E4A92',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
});

export default SelectLanguage;