import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { COLOR } from '../../../themes/Colors';
import FormTextInput from '../../../components/inputs/FormTextInput';
import DropDownInput from '../../../components/inputs/DropDownInput';
import DateInput from '../../../components/inputs/DateInput';

interface BasicInfoProps {
  control: Control<any>;
  errors: FieldErrors;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
}) => {
  return (
    <View style={styles.form}>
      <FormTextInput
        label="Full Name"
        name="fullName"
        control={control}
        editable={false}
        placeholder="Enter full name"
        rules={{
          required: 'Full name is required',
          minLength: { value: 3, message: 'Enter at least 3 characters' },
        }}
        error={errors.fullName?.message}
      />

      <FormTextInput
        label="Mobile Number"
        name="mobileNumber"
        control={control}
        editable={false}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
        rules={{
          required: 'Mobile number is required',
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Enter valid 10-digit number',
          },
        }}
        error={errors.mobileNumber?.message}
      />

      <FormTextInput
        label="Email Id"
        name="email"
        control={control}
        placeholder="Enter email id"
        keyboardType="email-address"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter valid email address',
          },
        }}
        error={errors.email?.message}
      />

      <FormTextInput
        label="District"
        name="district"
        control={control}
        editable={false}
        placeholder="Enter district"
        rules={{ required: 'District is required' }}
        error={errors.district?.message}
      />

      <FormTextInput
        label="City"
        name="city"
        control={control}
        placeholder="Enter city"
        rules={{ required: 'City is required' }}
        error={errors.city?.message}
      />

      <FormTextInput
        label="Tehsil"
        name="tehsil"
        control={control}
        editable={false}
        placeholder="Enter tehsil"
        rules={{ required: 'Tehsil is required' }}
        error={errors.tehsil?.message}
      />

      <DropDownInput
        label="Block"
        name="block"
        control={control}
        placeholder="Select block"
        items={blocks}
        rules={{ required: 'Block is required' }}
        errors={errors}
      />

      <FormTextInput
        label="Pin code"
        name="pincode"
        control={control}
        placeholder="Enter pin code"
        keyboardType="phone-pad"
        rules={{
          required: 'Pin code is required',
          pattern: {
            value: /^[0-9]{6}$/,
            message: 'Enter valid 6-digit pin code',
          },
        }}
        error={errors.pincode?.message}
      />

      <FormTextInput
        label="Address"
        name="address"
        control={control}
        placeholder="Enter address"
        rules={{ required: 'Address is required' }}
        error={errors.address?.message}
      />

      <DropDownInput
        label="Blood group"
        name="bloodGroup"
        control={control}
        placeholder="Select blood group"
        items={bloodGroups}
      />

      <DateInput
        name="dateOfBirth"
        label="Date of Birth"
        control={control}
        rules={{ required: 'Date of birth is required' }}
        errors={errors}
      />

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={() => ''}>
          <Text style={styles.submitButtonText}>Save as draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: COLOR.blue }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.submitButtonText, { color: COLOR.white }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BasicInfo;

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  submitButton: {
    backgroundColor: COLOR.white,
    borderWidth: 1,
    borderColor: COLOR.blue,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    width: 140,
  },
  submitButtonText: {
    color: COLOR.blue,
    fontSize: 16,
    fontWeight: '700',
  },
});

const blocks = [
  { label: 'Block 1', value: '1' },
  { label: 'Block 2', value: '2' },
  { label: 'Block 3', value: '3' },
  { label: 'Block 4', value: '4' },
  { label: 'Block 5', value: '5' },
];

const bloodGroups = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
];
