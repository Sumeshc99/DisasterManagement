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
import { FONT, WIDTH } from '../../themes/AppConst';
import { CommonActions, useNavigation } from '@react-navigation/native';
import HospitalSvg from '../../assets/svg/Hospital (2).svg';
import PoliceSvg from '../../assets/svg/Police.svg';
import AmbulanceSvg from '../../assets/svg/Ambulance.svg';
import FireBrigadesSvg from '../../assets/svg/FireBrigades.svg';
import { TEXT } from '../../i18n/locales/Text';
import ApiManager from '../../apis/ApiManager';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

interface SelfHelpBottomSheetProps {
  data: any;
  list: any;
  setList: Function;
  onClose: () => void;
}

const SelfHelpBottomSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  SelfHelpBottomSheetProps
>(({ data, list, setList, onClose }, ref) => {
  const navigation = useNavigation();
  const { user, userToken } = useSelector((state: RootState) => state.auth);

  const makeCall = async (num: string) => {
    try {
      const cleaned = num.replace(/[^0-9+]/g, '');
      const url =
        Platform.OS === 'ios' ? `telprompt:${cleaned}` : `tel:${cleaned}`;
      await Linking.openURL(url);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Unable to make call');
    }
  };

  const getResponders = async (type: string) => {
    try {
      const body = {
        tehsil_id: data?.tehsil_id,
        resource_type: type,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      const response = await ApiManager.getRespondersByTehsilAndResource(
        body,
        userToken,
      );

      if (response.data.success) {
        setList(response?.data?.responders || []);
        onClose();
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={650}
      onClose={() => {
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: 'mainAppSelector' }],
        //   }),
        // );
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

        <Text style={styles.title}>{TEXT.self_help_options()}</Text>

        <Text style={styles.description}>{TEXT.helpline_message()}</Text>

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

        <Text style={styles.alternateLabel}>{TEXT.emergency()}</Text>

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
          <Text style={styles.serviceLabel}>{TEXT.police()}</Text>
          <Text style={styles.serviceLabel}>{TEXT.ambulance()}</Text>
        </View>

        {/* Help Message */}
        <Text style={styles.description}>{TEXT.reach_nearby_services()}</Text>

        {/* Service Cards */}
        <View style={styles.servicesGrid}>
          <TouchableOpacity
            onPress={() => getResponders('Clinic')}
            style={styles.serviceCard}
          >
            <HospitalSvg height={WIDTH(20)} width={WIDTH(20)} />

            <Text style={styles.serviceCardText}>{TEXT.clinic_hospital()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getResponders('Police')}
            style={styles.serviceCard}
          >
            <PoliceSvg height={WIDTH(20)} width={WIDTH(20)} />
            <Text style={styles.serviceCardText}>{TEXT.police_station()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getResponders('Ambulance')}
            style={styles.serviceCard}
          >
            <AmbulanceSvg height={WIDTH(20)} width={WIDTH(20)} />
            <Text style={styles.serviceCardText}>{TEXT.ambulance()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getResponders('Fire')}
            style={styles.serviceCard}
          >
            <FireBrigadesSvg height={WIDTH(20)} width={WIDTH(20)} />
            <Text style={styles.serviceCardText}>{TEXT.fire_brigade()}</Text>
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
    marginBottom: 6,
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
