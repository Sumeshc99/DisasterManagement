import React, { forwardRef, useState } from 'react';
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
import MapView, { Marker } from 'react-native-maps';
import { useForm } from 'react-hook-form';
import { COLOR } from '../../themes/Colors';
import FormTextInput from '../inputs/FormTextInput';
import FormTextInput2 from '../inputs/FormTextInput2';
import LocationManual from '../LocationManual';

const { width, height } = Dimensions.get('window');

const IncidentAdress = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (_, ref: any) => {
    const [tab, settab] = useState(0);
    const [showLocation, setShowLocation] = useState(false);

    const [address, setAddress] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    console.log('aaa', address);
    console.log('bbb', selectedLocation);

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        country: 'India',
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

    const onSubmit = (data: any) => {
      console.log('✅ Confirmed Address:', { ...data, showLocation });
      ref?.current?.close();
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
            <Text style={styles.title}>Confirm Your Address</Text>
            <TouchableOpacity onPress={() => ref?.current?.close()}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginTop: 15 }}
          >
            {tab === 0 ? (
              <>
                <LocationManual
                  value={address}
                  onChangeText={setAddress}
                  onSelectLocation={loc => {
                    setSelectedLocation({
                      latitude: loc?.latitude,
                      longitude: loc?.longitude,
                      latitudeDelta: 0.02,
                      longitudeDelta: 0.02,
                    });
                  }}
                />
                {selectedLocation && (
                  <View style={styles.mapContainer}>
                    <MapView style={styles.map} region={selectedLocation}>
                      <Marker coordinate={selectedLocation} />
                    </MapView>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => settab(1)}
                >
                  <Text style={styles.buttonText}>Look Good</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={{ marginTop: 10 }}>
                <FormTextInput
                  label="Country/region"
                  name="country"
                  control={control}
                  editable={false}
                  placeholder="Country"
                  rules={{ required: 'Country is required' }}
                  error={errors.country?.message}
                />

                <FormTextInput
                  label="Detailed address"
                  name="flat"
                  control={control}
                  placeholder="Flat, house, etc."
                  rules={{ required: 'Country is required' }}
                  error={errors.flat?.message}
                />

                <FormTextInput2
                  label="Street address"
                  name="street"
                  control={control}
                  placeholder="Street address"
                  error={errors.street?.message}
                />

                <FormTextInput2
                  label="Nearby landmark (If applicable)"
                  name="landmark"
                  control={control}
                  placeholder="Nearby landmark"
                  error={errors.landmark?.message}
                />

                <FormTextInput2
                  label="City"
                  name="city"
                  control={control}
                  placeholder="City"
                  error={errors.city?.message}
                />

                <FormTextInput2
                  label="Division"
                  name="division"
                  control={control}
                  placeholder="Division"
                  error={errors.division?.message}
                />

                <FormTextInput2
                  label="State"
                  name="state"
                  control={control}
                  placeholder="State"
                  error={errors.state?.message}
                />

                <FormTextInput2
                  label="PIN code"
                  name="pincode"
                  control={control}
                  placeholder="PIN code"
                  keyboardType="numeric"
                  rules={{ required: 'PIN code is required' }}
                  error={errors.pincode?.message}
                />

                <View style={styles.coordRow}>
                  <FormTextInput
                    label="Latitude"
                    name="latitude"
                    control={control}
                    style={styles.coordInput}
                  />
                  <FormTextInput
                    label="Longitude"
                    name="longitude"
                    control={control}
                    style={styles.coordInput}
                  />
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
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.buttonText}>Look Good</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </RBSheet>
    );
  },
);

export default IncidentAdress;

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
    fontWeight: '700',
    color: '#000',
  },
  closeIcon: {
    fontSize: 18,
    color: '#444',
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordInput: {
    // width: '44%',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  map: {
    width: width - 32,
    height: height * 0.5,
  },
});
