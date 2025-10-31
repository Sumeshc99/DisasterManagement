import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { useForm } from 'react-hook-form';
import FormTextInput from '../inputs/FormTextInput';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';

interface Props {
  data?: any;
  submitData: (data: LoginFormData) => void;
}

interface LoginFormData {
  name: string;
  emgName: string;
  emgPhone: string;
}

const CompleteProfileSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  Props
>(({ data, submitData }, ref) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      name: '',
      emgName: '',
      emgPhone: '',
    },
  });

  const onSubmit = (formData: LoginFormData) => {
    submitData(formData);
  };

  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={480}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Please complete your profile</Text>
          <TouchableOpacity onPress={() => (ref as any)?.current?.close()}>
            <Image
              source={require('../../assets/cancel.png')}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Main User Phone */}
        <FormTextInput
          label="Full Name"
          name="name"
          control={control}
          placeholder="Enter your full name"
          rules={{
            required: 'Full name is required',
          }}
          error={errors.name?.message as string}
        />

        <Text style={styles.sectionTitle}>Emergency Contact Details</Text>
        {/* Emergency Contact Name */}
        <FormTextInput
          label="Full Name"
          name="emgName"
          control={control}
          placeholder="Enter emergency contact name"
          // rules={{
          //   required: 'Emergency contact name is required',
          // }}
          // error={errors.emgName?.message as string}
        />

        {/* Emergency Contact Mobile */}
        <FormTextInput
          label="Mobile Number"
          name="emgPhone"
          control={control}
          placeholder="Enter emergency contact number"
          keyboardType="number-pad"
          // rules={{
          //   required: 'Emergency mobile number is required',
          //   pattern: {
          //     value: /^[0-9]{10}$/,
          //     message: 'Enter a valid 10-digit number',
          //   },
          // }}
          // error={errors.emgPhone?.message as string}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLOR.blue,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 6,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: COLOR.blue,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 10,
    width: WIDTH(40),
    alignSelf: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CompleteProfileSheet;
