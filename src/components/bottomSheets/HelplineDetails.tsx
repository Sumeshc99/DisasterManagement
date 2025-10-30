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
              source={require('../assets/cancel.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Disaster Helpline Numbers</Text>
            <View style={styles.divider} />

            {/* Logo */}
            <Image source={require('../assets/logo.png')} style={styles.logo} />

            {/* Details */}
            <Text style={styles.text}>
              <Text style={styles.bold}>Nagpur STD Code:</Text> 0712
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
              <Text style={styles.bold}>STD Code:</Text> 022
            </Text>

            {/* Important Numbers */}
            <Text style={[styles.bold, { marginTop: 10 }]}>
              Important Numbers
            </Text>
            <Text style={styles.text}>• Police: 100, 112 or 0712-2561222</Text>
            <Text style={styles.text}>• Fire Service: 101</Text>
            <Text style={styles.text}>• Ambulance: 102</Text>
            <Text style={styles.text}>• Women Helpline: 1091</Text>
            <Text style={styles.text}>• Child Helpline: 1098</Text>
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
    paddingTop: 20,
    position: 'relative',
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    marginBottom: 8,
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
    color: '#000',
  },
});
