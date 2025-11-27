import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  useWatch,
} from 'react-hook-form';
import { COLOR } from '../../../themes/Colors';
import FormTextInput from '../../../components/inputs/FormTextInput';
import DropDownInput from '../../../components/inputs/DropDownInput';
import DateInput from '../../../components/inputs/DateInput';
import { TEXT } from '../../../i18n/locales/Text';

interface BasicInfoProps {
  control: Control<any>;
  errors: FieldErrors;
  blockList: any;
  saveInDraft: Function;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  control,
  errors,
  blockList,
  saveInDraft,
  handleSubmit,
  onSubmit,
}) => {
  const formValues = useWatch({ control });

  return (
    <View style={styles.form}>
      <FormTextInput
        label={TEXT.full_name()}
        name="fullName"
        control={control}
        editable={false}
        placeholder={TEXT.enter_full_name()}
        rules={{ required: TEXT.enter_full_name() }}
        error={errors.fullName?.message}
      />

      <FormTextInput
        label={TEXT.mobile_number()}
        name="mobileNumber"
        control={control}
        editable={false}
        placeholder={TEXT.enter_phone_number()}
        keyboardType="phone-pad"
        rules={{
          required: TEXT.phone_number_is_required(),
          pattern: {
            value: /^[0-9]{10}$/,
            message: TEXT.enter_valid_10_digit_number(),
          },
        }}
        error={errors.mobileNumber?.message}
      />

      <FormTextInput
        label={TEXT.email_id()}
        name="email"
        control={control}
        placeholder={TEXT.enter_email_id()}
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
        label={TEXT.district()}
        name="district"
        control={control}
        editable={false}
        placeholder="Enter district"
        rules={{ required: TEXT.district_required() }}
        error={errors.district?.message}
      />

      <FormTextInput
        label={TEXT.city()}
        name="city"
        control={control}
        placeholder="Enter city"
        rules={{ required: TEXT.city_required() }}
        error={errors.city?.message}
      />

      <FormTextInput
        label={TEXT.tehsil()}
        name="tehsil"
        control={control}
        editable={false}
        placeholder="Enter tehsil"
        rules={{ required: 'Tehsil is required' }}
        error={errors.tehsil?.message}
      />

      <DropDownInput
        label={TEXT.block()}
        name="block"
        control={control}
        placeholder="Select block"
        items={blockList}
        rules={{ required: TEXT.block_required() }}
        errors={errors}
      />

      <FormTextInput
        label={TEXT.pincode()}
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
        label={TEXT.address()}
        name="address"
        control={control}
        placeholder="Enter address"
        rules={{ required: 'Address is required' }}
        error={errors.address?.message}
      />

      <DropDownInput
        label={TEXT.blood_group()}
        name="bloodGroup"
        control={control}
        placeholder="Select blood group"
        items={bloodGroups}
      />

      <DateInput
        name="dateOfBirth"
        label={TEXT.date_of_birth()}
        control={control}
        rules={{ required: 'Date of birth is required' }}
        errors={errors}
      />

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => saveInDraft(formValues)}
        >
          <Text style={styles.submitButtonText}>{TEXT.save_as_draft()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: COLOR.blue }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.submitButtonText, { color: COLOR.white }]}>
            {TEXT.next()}
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
  },
  submitButton: {
    borderWidth: 1,
    borderColor: COLOR.blue,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    width: 140,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: COLOR.blue,
    fontSize: 16,
    fontWeight: '700',
    alignContent: 'center',
  },
});

const blocks = [
  { label: 'Block 1', value: 1 },
  { label: 'Block 2', value: 2 },
  { label: 'Block 3', value: 3 },
  { label: 'Block 4', value: 4 },
  { label: 'Block 5', value: 5 },
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
