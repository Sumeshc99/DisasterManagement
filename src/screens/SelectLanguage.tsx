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
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
import WaveBackgroundHeader from './auth/WaveBackgroundHeader';
import { WIDTH } from '../themes/AppConst';
import { COLOR } from '../themes/Colors';

const SelectLanguage = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    {
      id: 1,
      name: 'English',
      subText: '',
      icon: require('../assets/e.png'),
      icon1: require('../assets/e1.png'),
    },
    {
      id: 2,
      name: 'Marathi',
      subText: 'मराठी',
      icon: require('../assets/h.png'),
      icon1: require('../assets/h1.png'),
    },
    {
      id: 3,
      name: 'Hindi',
      subText: 'हिन्दी',
      icon: require('../assets/m.png'),
      icon1: require('../assets/m1.png'),
    },
  ];

  const handleNext = () => {
    console.log('Selected language:', selectedLanguage);
    navigation.navigate('loginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLOR.blue} barStyle="light-content" />

      {/* Blue Header */}
      <View style={{ flex: 1, backgroundColor: COLOR.white }}>
        <WaveBackgroundHeader />

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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.blue },
  // header: {
  //   backgroundColor: '#1E4A92',
  //   alignItems: 'center',
  //   paddingVertical: 40,
  // },
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
    paddingHorizontal: WIDTH(6),
  },
  languageRow: {
    flexDirection: 'row',
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
    backgroundColor: COLOR.blue,
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
    backgroundColor: COLOR.blue,
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
