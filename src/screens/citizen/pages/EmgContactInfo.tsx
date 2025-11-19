import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import FormTextInput from '../../../components/inputs/FormTextInput';
import DropDownInput from '../../../components/inputs/DropDownInput';
import { COLOR } from '../../../themes/Colors';
import { TEXT } from '../../../i18n/locales/Text';
import { FONT, WIDTH } from '../../../themes/AppConst';

const relations = [
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Friend', value: 'friend' },
  { label: 'Other', value: 'other' },
];

interface EmgContactInfoProps {
  control: Control<any>;
  errors: any;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const EmgContactInfo: React.FC<EmgContactInfoProps> = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
  setValue,
  watch,
}) => {
  const document = watch('document');

  const handleImageUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets?.length) {
      const selected = { uri: result.assets[0].uri };
      setValue('document', selected, { shouldValidate: true });
    }
  };

  const removeDocument = () => {
    setValue('document', null, { shouldValidate: true });
  };

  const handleFormSubmit = (data: any) => {
    if (!data.document) {
      Alert.alert('Please upload one valid ID proof');
      return;
    }
    onSubmit(data);
  };

  return (
    <View style={styles.form}>
      {/* Upload Document */}
      <Text style={styles.label}>
        {TEXT.upload_document()} <Text style={styles.required}>*</Text>
      </Text>

      <Controller
        name="document"
        control={control}
        rules={{ required: 'Document is required' }}
        render={() => (
          <View style={styles.documentsContainer}>
            {document ? (
              <View style={styles.documentCard}>
                <View style={{ width: WIDTH(20) }}>
                  <Image
                    source={{ uri: document?.uri || document }}
                    style={styles.documentImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.removeDocButton}
                    onPress={removeDocument}
                  >
                    <Text style={styles.removeDocIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImageUpload}
              >
                <Text style={styles.uploadText}>{TEXT.upload_valid_id()}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      {errors.document && (
        <Text style={styles.errorText}>{errors?.document?.message}</Text>
      )}

      {/* Primary Contact */}
      <Text style={styles.sectionTitle}>
        {TEXT.emergency_contact_details()}
      </Text>

      <FormTextInput
        label={TEXT.primary_contact_name()}
        name="primaryName"
        control={control}
        placeholder={TEXT.enter_full_name()}
        rules={{ required: TEXT.enter_full_name() }}
        error={errors.primaryName?.message}
      />

      <DropDownInput
        label={TEXT.relation()}
        name="primaryRelation"
        control={control}
        placeholder={TEXT.Select_relation()}
        items={relations}
        rules={{ required: 'Relation is required' }}
        errors={errors}
      />

      <FormTextInput
        label={TEXT.primary_mobile_number()}
        name="primaryMobile"
        control={control}
        placeholder={TEXT.enter_primary_mobile_number()}
        keyboardType="phone-pad"
        maxLength={10}
        rules={{
          required: TEXT.phone_number_is_required(),
          pattern: {
            value: /^[0-9]{10}$/,
            message: TEXT.enter_valid_10_digit_number(),
          },
        }}
        error={errors.primaryMobile?.message}
      />

      <FormTextInput
        label={TEXT.alternate_mobile_number()}
        name="primaryAltMobile"
        control={control}
        placeholder={TEXT.alternate_mobile_number()}
        keyboardType="phone-pad"
        maxLength={10}
        rules={{
          pattern: {
            value: /^[0-9]{10}$/,
            message: TEXT.enter_valid_10_digit_number(),
          },
        }}
        error={errors.primaryAltMobile?.message}
      />

      {/* Secondary Contact */}
      <FormTextInput
        label={TEXT.secondary_contact_name()}
        name="secondaryName"
        control={control}
        placeholder={TEXT.enter_full_name()}
      />

      <DropDownInput
        label={TEXT.relation()}
        name="secondaryRelation"
        control={control}
        placeholder={TEXT.Select_relation()}
        items={relations}
      />

      <FormTextInput
        label={TEXT.secondary_mobile_number()}
        name="secondaryMobile"
        control={control}
        placeholder={TEXT.enter_mobile_number()}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <FormTextInput
        label={TEXT.alternate_mobile_number()}
        name="secondaryAltMobile"
        control={control}
        placeholder={TEXT.enter_alternate_mobile_number()}
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* Submit */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(handleFormSubmit)}
      >
        <Text style={styles.submitButtonText}>{TEXT.submit()}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmgContactInfo;

const styles = StyleSheet.create({
  form: { padding: 16 },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLOR.textGrey,
    marginBottom: 8,
  },
  required: { color: '#FF0000' },
  documentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  documentCard: {
    flex: 1,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLOR.blue,
    position: 'relative',
    overflow: 'hidden',
    padding: 10,
  },
  documentImage: { height: '100%', borderRadius: 4 },
  removeDocButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLOR.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeDocIcon: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  uploadButton: {
    flex: 1,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  uploadText: { fontSize: 14, color: '#666666', textAlign: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONT.R_MED_500,
    color: COLOR.blue,
    marginBottom: 16,
    marginTop: 16,
  },
  errorText: { color: '#FF0000', fontSize: 12 },
  submitButton: {
    backgroundColor: COLOR.blue,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
