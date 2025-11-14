import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  I18nManager,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';

interface DateInputProps {
  label?: string;
  name: string;
  control: any;
  rules?: any;
  placeholder?: string;
  errors?: any;
  bottom?: number;
  disabled?: boolean;
  minimumDate?: string;
}

const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DateInput: React.FC<DateInputProps> = ({
  label = 'Date of birth',
  name,
  control,
  rules,
  placeholder = 'YYYY-MM-DD',
  errors,
  bottom = 0,
  disabled = false,
  minimumDate = '',
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const openDatePicker = () => setShowPicker(true);

  const isRequired = !!rules?.required;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => {
        const handleDateChange = (
          event: any,
          selectedDate?: Date | undefined,
        ) => {
          setShowPicker(Platform.OS === 'ios');
          if (selectedDate) {
            const formattedDate = formatDateToYMD(selectedDate);
            onChange(formattedDate);
          }
        };

        return (
          <View style={{ marginBottom: 16 }}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{label}</Text>
              {isRequired && <Text style={styles.requiredMark}>*</Text>}
            </View>

            <TouchableOpacity
              style={[
                styles.inputContainer,
                { borderColor: errors?.[name] ? 'red' : '#ccc' },
              ]}
              onPress={openDatePicker}
              disabled={disabled}
              activeOpacity={0.8}
            >
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                editable={false}
                textAlign={I18nManager.isRTL ? 'right' : 'left'}
                pointerEvents="none"
              />
              <Text>📅</Text>
            </TouchableOpacity>

            {errors?.[name] && (
              <Text style={styles.error}>{errors[name].message}</Text>
            )}

            {showPicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                minimumDate={
                  minimumDate.length > 0 ? new Date(minimumDate) : undefined
                }
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>
        );
      }}
    />
  );
};

export default DateInput;

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requiredMark: {
    color: 'red',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#000',
    textAlign: 'left',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
