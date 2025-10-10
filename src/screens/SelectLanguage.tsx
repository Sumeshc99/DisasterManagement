import React, { useState } from 'react';
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

const SelectLanguage = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    {
      id: 1,
      name: 'English',
      subText: '',
      icon: require('../assets/citizen/english-icon.png'),
    },
    {
      id: 2,
      name: 'Marathi',
      subText: 'मराठी',
      icon: require('../assets/citizen/hindi-icon.png'),
    },
    {
      id: 3,
      name: 'Hindi',
      subText: 'हिन्दी',
      icon: require('../assets/citizen/hindi-icon.png'),
    },
  ];

  const handleNext = () => {
    console.log('Selected language:', selectedLanguage);
    navigation.navigate('loginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1E4A92" barStyle="light-content" />

      {/* Blue Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/citizen/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Select Language</Text>
      </View>

      {/* Curved White Section */}
      <View style={styles.contentContainer}>
        <View style={styles.languageRow}>
          {languages.map(lang => (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.languageCard,
                selectedLanguage === lang.name && styles.selectedCard,
              ]}
              onPress={() => setSelectedLanguage(lang.name)}
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
                  <Text style={styles.subText}>{lang.subText}</Text>
                ) : null}
              </View>

              <Image source={lang.icon} style={styles.icon} />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F3F3' },
  header: {
    backgroundColor: '#1E4A92',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 80,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
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
  },
  selectedCard: {
    backgroundColor: '#1E4A92',
  },
  languageText: {
    fontWeight: 'bold',
    color: '#000',
  },
  selectedText: {
    color: '#fff',
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
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 40,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectLanguage;
