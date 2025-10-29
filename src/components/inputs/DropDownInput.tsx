import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Controller, Control } from 'react-hook-form';

interface DropDownInputProps {
  name: string;
  label: string;
  control: Control<any>;
  rules?: any;
  items: { label: string; value: string }[];
  placeholder?: string;
  errors?: any;
}

const DropDownInput: React.FC<DropDownInputProps> = ({
  name,
  label,
  control,
  rules,
  items,
  placeholder,
  errors,
}) => {
  const [open, setOpen] = useState(false);
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const isRequired = !!rules?.required;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.requiredMark}>*</Text>}
      </View>

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <DropDownPicker
            open={open}
            value={value}
            items={localItems}
            setOpen={setOpen}
            setValue={callback => {
              const newValue = callback(value);
              onChange(newValue);
              return newValue;
            }}
            setItems={setLocalItems}
            placeholder={placeholder}
            placeholderStyle={styles.placeholderStyle}
            style={[
              styles.dropdown,
              { borderColor: errors?.[name] ? 'red' : '#ccc' },
            ]}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.textStyle}
          />
        )}
      />

      {errors?.[name] && (
        <Text style={styles.error}>{errors[name].message}</Text>
      )}
    </View>
  );
};

export default DropDownInput;

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
    color: '#333',
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  requiredMark: {
    color: 'red',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    borderRadius: 6,
    height: 50,
    zIndex: 100,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  textStyle: {
    fontSize: 16,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
