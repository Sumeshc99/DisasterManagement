import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useForm } from 'react-hook-form';
import Geocoder from 'react-native-geocoding';
import { COLOR } from '../../themes/Colors';
import FormTextInput from '../inputs/FormTextInput';
import FormTextInput2 from '../inputs/FormTextInput2';
import LocationManual from '../LocationManual';
import { TEXT } from '../../i18n/locales/Text';
import { FONT } from '../../themes/AppConst';

const { height } = Dimensions.get('window');

Geocoder.init('AIzaSyDjFGPFuN3IMaMQU76874r-T1glz8dyupw', { language: 'en' });

interface IncidentAddressSheetProps {
  onSubmit?: (data: any) => void;
}

const IncidentAddressSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  IncidentAddressSheetProps
>(({ onSubmit }, ref) => {
  const [tab, settab] = useState(0);
  const [showLocation, setShowLocation] = useState(false);

  const [location, setLocation] = useState<any>({
    address: '',
    latitude: null,
    longitude: null,
  });

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: '',
      flat: '',
      street: '',
      landmark: '',
      city: '',
      division: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: '',
    },
  });

  useEffect(() => {
    if (location.latitude && location.longitude) {
      (async () => {
        try {
          const geo = await Geocoder.from(
            location.latitude,
            location.longitude,
          );
          const addrComp = geo.results[0]?.address_components || [];

          const get = (type: string) =>
            addrComp.find((c: any) => c.types.includes(type))?.long_name || '';

          setValue('country', get('country'));
          setValue('state', get('administrative_area_level_1'));
          setValue(
            'city',
            get('locality') || get('administrative_area_level_2'),
          );
          setValue('division', get('sublocality') || get('neighborhood'));
          setValue('pincode', get('postal_code'));
          setValue('street', get('route'));
          setValue('flat', location.address || '');
          setValue('latitude', String(location.latitude));
          setValue('longitude', String(location.longitude));
        } catch (err) {
          console.warn('Geocode parse failed:', err);
        }
      })();
    } else {
      reset({
        country: '',
        flat: '',
        street: '',
        landmark: '',
        city: '',
        division: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: '',
      });
    }
  }, [location, reset, setValue]);

  const handleFormSubmit = (data: any) => {
    const finalData = { ...data, showLocation };
    if (onSubmit) {
      onSubmit(finalData);
    }
    (ref as any)?.current?.close?.();
  };

  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={height * 0.85}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        <View style={styles.dragIndicator} />

        <View style={styles.headerRow}>
          <Text style={styles.title}>{TEXT.confirm_address()}</Text>
          <TouchableOpacity onPress={() => (ref as any)?.current?.close?.()}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginTop: 15 }}>
          {tab === 0 ? (
            <>
              <LocationManual
                location={location}
                onChangeLocation={setLocation}
              />

              <TouchableOpacity style={styles.button} onPress={() => settab(1)}>
                <Text style={styles.buttonText}>{TEXT.look_good()}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <FormTextInput
                label={TEXT.country_region()}
                name="country"
                control={control}
                editable={false}
                placeholder={TEXT.country_region()}
                rules={{ required: 'Country is required' }}
                error={errors.country?.message}
              />

              <FormTextInput
                label={TEXT.detailed_address()}
                name="flat"
                control={control}
                placeholder={TEXT.flat_house()}
                rules={{ required: 'Address is required' }}
                error={errors.flat?.message}
              />

              <FormTextInput2
                label={TEXT.street_address()}
                name="street"
                control={control}
                placeholder={TEXT.street_address()}
                error={errors.street?.message}
              />

              <FormTextInput2
                label="Nearby landmark (If applicable)"
                name="landmark"
                control={control}
                placeholder={TEXT.nearby_landmark()}
                error={errors.landmark?.message}
              />

              <FormTextInput2
                label="City"
                name="city"
                control={control}
                placeholder={TEXT.city()}
                error={errors.city?.message}
              />

              <FormTextInput2
                label="Division"
                name="division"
                control={control}
                placeholder={TEXT.division()}
                error={errors.division?.message}
              />

              <FormTextInput2
                label="State"
                name="state"
                control={control}
                placeholder={TEXT.state()}
                error={errors.state?.message}
              />

              <FormTextInput2
                label="PIN code"
                name="pincode"
                control={control}
                placeholder={TEXT.pincode()}
                keyboardType="numeric"
                rules={{ required: TEXT.pin_code_required() }}
                error={errors.pincode?.message}
              />

              <View style={styles.coordRow}>
                <View style={{ flex: 1 }}>
                  <FormTextInput2
                    label="Latitude"
                    name="latitude"
                    control={control}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FormTextInput2
                    label="Longitude"
                    name="longitude"
                    control={control}
                  />
                </View>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  Show your specific location
                </Text>
                <Switch
                  value={showLocation}
                  onValueChange={setShowLocation}
                  thumbColor={showLocation ? COLOR.blue : '#f4f3f4'}
                  trackColor={{ false: '#ddd', true: '#a3c4f3' }}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(handleFormSubmit)}
              >
                <Text style={styles.buttonText}>{TEXT.confirm()}</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </RBSheet>
  );
});

export default IncidentAddressSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: COLOR.white,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONT.R_BOLD_700,
    color: COLOR.textGrey,
  },
  closeIcon: {
    fontSize: 18,
    color: '#444',
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  button: {
    backgroundColor: COLOR.blue,
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
