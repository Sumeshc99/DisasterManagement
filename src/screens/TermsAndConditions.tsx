import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, { useState } from 'react';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONT, HEIGHT, WIDTH } from '../themes/AppConst';
import { COLOR } from '../themes/Colors';
import { TEXT } from '../i18n/locales/Text';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../navigation/AppNavigation';

const TermsAndConditions = () => {
  const navigation = useNavigation<AppStackNavigationProp<'splashScreen'>>();
  const [agree, setAgree] = useState(false);

  const { width } = useWindowDimensions();

  const htmlContent = TEXT.termsAndConditions();

  return (
    <ImageBackground
      source={require('../assets/bg2.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{ opacity: 0.95 }}
    >
      <StatusBar
        animated={true}
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: WIDTH(3),
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              padding: WIDTH(3),
            }}
          >
            <Image source={require('../assets/back.png')} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              color: COLOR.textGrey,
              paddingVertical: WIDTH(3),
              fontFamily: FONT.R_MED_500,
            }}
          >
            Legal Terms & Privacy
          </Text>
        </View>

        <View style={{ height: HEIGHT(62) }}>
          <ScrollView
            contentContainerStyle={{ padding: WIDTH(4) }}
            showsVerticalScrollIndicator={false}
          >
            <RenderHTML contentWidth={width} source={{ html: htmlContent }} />

            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <CheckBox
                value={agree}
                onValueChange={setAgree}
                tintColors={{ true: COLOR.blue, false: COLOR.textGrey }}
              />
              <Text style={{}}>
                I have read and agree to the app privacy policy
              </Text>
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: agree ? COLOR.blue : COLOR.lightTextGrey },
          ]}
          onPress={() => {
            if (agree) {
              console.log('Accepted');
              navigation.replace('mainAppSelector');
            }
          }}
          activeOpacity={agree ? 0.8 : 1}
          disabled={!agree}
        >
          <Text style={[styles.buttonText, { color: agree ? '#fff' : '#eee' }]}>
            {TEXT.complete()}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
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
