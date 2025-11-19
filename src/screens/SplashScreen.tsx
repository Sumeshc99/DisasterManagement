import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootReducer';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();

  const { user } = useSelector((state: RootState) => state.auth as any);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (user?.id) {
        navigation.replace('mainAppSelector');
      } else {
        navigation.navigate('selectLanguage');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require('../assets/citizen/loading-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Animated.Image
            source={require('../assets/citizen/logo.png')}
            style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { flex: 1, width: width, height: height },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  logo: { width: 205, height: 205 },
});

export default SplashScreen;
