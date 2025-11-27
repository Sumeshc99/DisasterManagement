import React, { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  Platform,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FONT } from '../../themes/AppConst';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface SelfHelpBottomSheetProps {
  onClose: () => void;
}

const SelfHelpBottomSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  SelfHelpBottomSheetProps
>(({ onClose }, ref) => {
  const navigation = useNavigation();

  const makeCall = async (num: string) => {
    try {
      const cleaned = num.replace(/[^0-9+]/g, '');
      const url =
        Platform.OS === 'ios' ? `telprompt:${cleaned}` : `tel:${cleaned}`;

      console.log('Opening:', url);

      await Linking.openURL(url);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Unable to make call');
    }
  };

  const getResponders = (type: String) => {};

  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={650}
      onClose={() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'mainAppSelector' }],
          }),
        );
      }}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        <View style={styles.dragIndicator} />
        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={() => {
            (ref as any)?.current?.close(),
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'mainAppSelector' }],
                }),
              );
          }}
        >
          <Image
            source={require('../../assets/cancel.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Self-Help Options</Text>

        <Text style={styles.description}>
          While we alert your emergency contacts & notify nearby app users,
          please call below helpline numbers immediately.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => makeCall('112')}
        >
          <Image
            source={require('../../assets/callwhite.png')}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.primaryButtonText}>112</Text>
        </TouchableOpacity>

        <Text style={styles.alternateLabel}>Alternate call</Text>

        <View style={styles.alternateRow}>
          <TouchableOpacity
            style={styles.alternateButton}
            onPress={() => makeCall('100')}
          >
            <Image
              source={require('../../assets/callblue.png')}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.alternateButtonText}>100</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alternateButton}
            onPress={() => makeCall('108')}
          >
            <Image
              source={require('../../assets/callblue.png')}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.alternateButtonText}>108</Text>
          </TouchableOpacity>
        </View>

        {/* Labels for Police and Ambulance */}
        <View style={styles.labelsRow}>
          <Text style={styles.serviceLabel}>Police</Text>
          <Text style={styles.serviceLabel}>Ambulance</Text>
        </View>

        {/* Help Message */}
        <Text style={styles.description}>
          Please reach out to nearby services for help till we notify our
          Responders.
        </Text>

        {/* Service Cards */}
        <View style={styles.servicesGrid}>
          <TouchableOpacity
            onPress={() => getResponders('clinic')}
            style={styles.serviceCard}
          >
            <Image
              source={require('../../assets/hospi.png')}
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
            <Text style={styles.serviceCardText}>Clinic/Hospital</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getResponders('police')}
            style={styles.serviceCard}
          >
            <Image
              source={require('../../assets/police.png')}
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
            <Text style={styles.serviceCardText}>Police Station</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getResponders('ambulance')}
            style={styles.serviceCard}
          >
            <Image
              source={require('../../assets/amb.png')}
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
            <Text style={styles.serviceCardText}>Ambulance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getResponders('fire')}
            style={styles.serviceCard}
          >
            <Image
              source={require('../../assets/firev.png')}
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
            <Text style={styles.serviceCardText}>Fire Brigades</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
});

export default SelfHelpBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 20,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 22,
    color: '#525151',
    textAlign: 'center',
    fontFamily: FONT.R_SBD_600,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: FONT.R_REG_400,
  },
  primaryButton: {
    backgroundColor: '#0D5FB3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 12,
    width: 130,
    gap: 10,
  },
  callIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: FONT.R_SBD_600,
  },
  alternateLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: FONT.R_SBD_600,
  },
  alternateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  alternateButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0D5FB3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    width: 130,
    gap: 10,
  },
  alternateIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  alternateButtonText: {
    color: '#0D5FB3',
    fontSize: 16,
    fontFamily: FONT.R_SBD_600,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  serviceLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  helpMessage: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 24,
  },
  serviceCard: {
    width: '40%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  serviceCardText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
    textAlign: 'center',
  },

  cancelButton: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  cancelButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#FFFFFF',
    elevation: 6,
  },
  cancelIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  cancelText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
});
