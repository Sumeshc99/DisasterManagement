import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { TEXT } from '../../i18n/locales/Text';

interface Props {
  onClose?: () => void;
}

const HelplineDetails = forwardRef<React.ComponentRef<typeof RBSheet>, Props>(
  ({ onClose }, ref) => {
    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={600}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          {/* Close Icon */}
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => {
              (ref as any)?.current?.close();
              onClose?.();
            }}
          >
            <Image
              source={require('../../assets/cancel.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>{TEXT.disaster_helpline_numbers()}</Text>
            <View style={styles.divider} />

            {/* Logo */}
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />

            {/* Details */}
            <Text style={styles.text}>
              <Text style={styles.bold}>Nagpur {TEXT.std_code()}:</Text> 0712
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>
                Nagpur District Collector Office COVID Control Room:
              </Text>{' '}
              0712-2562668 or 1077
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>COVID Helpline:</Text> 0712-2567021 /
              0712-2551866 / 18002333764
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Corona (COVID-19) Helpline:</Text>{' '}
              011-23978046 or 1075
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>{TEXT.std_code()}:</Text> 022
            </Text>

            {/* Important Numbers */}
            <Text style={[styles.bold, { marginTop: 10 }]}>
              {TEXT.important_numbers()}
            </Text>
            <Text style={styles.text}>
              • {TEXT.police()}: 100, 112 or 0712-2561222
            </Text>
            <Text style={styles.text}>• {TEXT.fire_service()}: 101</Text>
            <Text style={styles.text}>• {TEXT.ambulance_service()}: 102</Text>
            <Text style={styles.text}>• {TEXT.women_helpline()}: 1091</Text>
            <Text style={styles.text}>• {TEXT.child_helpline()}: 1098</Text>
          </ScrollView>
        </View>
      </RBSheet>
    );
  },
);

export default HelplineDetails;

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 30,
    position: 'relative',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 20,
    right: 5,
    zIndex: 1,
  },
  closeIcon: {
    width: 28,
    height: 28,
  },
  title: {
    fontSize: 18,
    color: COLOR.blue,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 12,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 6,
  },
  bold: {
    fontWeight: '700',
    color: COLOR.textGrey,
  },
});
