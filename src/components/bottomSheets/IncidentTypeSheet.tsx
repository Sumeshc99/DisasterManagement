import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { FONT, WIDTH } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';
import DropDownInput from '../inputs/DropDownInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

const IncidentTypeSheet = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (props: any, ref) => {
    const navigation = useNavigation();

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: {
        insId: '',
        reason: '',
      },
    });

    const onSubmit = (data: any) => {
      console.log('Submitted data:', data);
      ref && (ref as { current: any } | null)?.current?.close();
      navigation.navigate('informationPage');
    };

    return (
      <RBSheet
        ref={ref}
        height={350}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 18,
            backgroundColor: '#fff',
          },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          <View style={styles.headerRow}>
            <Text style={styles.titleHeader}>Notifications</Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => (ref as { current: any } | null)?.current?.close()}
            >
              <Image
                source={require('../../assets/cancel.png')}
                style={{ width: WIDTH(8), height: WIDTH(8) }}
              />
            </TouchableOpacity>
          </View>

          <DropDownInput
            label={'Incident Type'}
            name="insId"
            control={control}
            placeholder={'Select incident type'}
            items={[
              { value: '1', label: 'Flood' },
              { value: '2', label: 'Earthquake' },
            ]}
            rules={{ required: TEXT.incident_id_required() }}
            errors={errors}
          />
        </View>
        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveText}>{TEXT.save()}</Text>
        </TouchableOpacity>
      </RBSheet>
    );
  },
);

export default IncidentTypeSheet;

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  titleHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    padding: 0,
  },

  saveBtn: {
    margin: WIDTH(4),
    backgroundColor: COLOR.blue,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    alignSelf: 'center',
    width: 160,
  },
  saveText: {
    color: COLOR.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
