import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  I18nManager,
} from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';

interface FormTextInputProps extends TextInputProps {
  label: string;
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  error?: any;
  multiline?: boolean;
  numberOfLines?: number;
  onRightIconPress?: () => void;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  label,
  name,
  control,
  rules,
  error,
  secureTextEntry,
  multiline = false,
  numberOfLines = 1,
  onRightIconPress,
  ...textInputProps
}) => {
  const isRequired = !!rules?.required;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.requiredMark}>*</Text>}
      </View>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[styles.inputWrapper, error && styles.inputError]}>
            <TextInput
              autoCapitalize="none"
              style={[styles.input, multiline && styles.multilineInput]}
              placeholder={`Enter ${label.toLowerCase()}`}
              placeholderTextColor="#999"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              secureTextEntry={secureTextEntry}
              multiline={multiline}
              numberOfLines={numberOfLines}
              textAlignVertical={multiline ? 'top' : 'center'}
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              {...textInputProps}
            />
          </View>
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  requiredMark: {
    color: 'red',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
  },
  multilineInput: {
    height: 120,
    paddingTop: 12,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
  iconWrapper: {
    paddingLeft: 8,
  },
});

export default FormTextInput;
