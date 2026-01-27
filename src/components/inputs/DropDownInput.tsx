import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Controller, Control } from 'react-hook-form';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';

interface DropDownInputProps {
  name: string;
  label: string;
  control: Control<any>;
  rules?: any;
  items: { label: string; value: string }[];
  placeholder?: string;
  errors?: any;
  onSelect?: (value: any) => void;
  zIndex?: number;
}

const DropDownInput: React.FC<DropDownInputProps> = ({
  name,
  label,
  control,
  rules,
  items,
  placeholder,
  errors,
  onSelect,
  zIndex = 1000,
}) => {
  const [open, setOpen] = useState(false);
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const isRequired = !!rules?.required;

  const handleOpen = () => {
    Keyboard.dismiss();
    setOpen(true);
  };

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
            onOpen={handleOpen}
            setItems={setLocalItems}
            placeholder={placeholder}
            placeholderStyle={styles.placeholderStyle}
            style={[
              styles.dropdown,
              { borderColor: errors?.[name] ? 'red' : '#ccc' },
            ]}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.textStyle}
            selectedItemContainerStyle={styles.selectedItemContainerStyle}
            selectedItemLabelStyle={styles.selectedItemLabelStyle}
            zIndex={zIndex}
            listMode="SCROLLVIEW"
            arrowIconStyle={{ tintColor: COLOR.darkGray }}
            setValue={callback => {
              const newValue = callback(value);
              onChange(newValue);
              if (onSelect) onSelect(newValue);
              return newValue;
            }}
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
  container: { marginBottom: 16, backgroundColor: COLOR.white },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: { fontSize: 16, color: COLOR.textGrey, fontFamily: FONT.R_SBD_600 },
  requiredMark: {
    color: 'red',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdown: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    height: 46,
    paddingHorizontal: 10,
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    zIndex: 100,
  },
  dropdownContainer: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    zIndex: 2000,
  },
  textStyle: {
    fontSize: 16,
    color: COLOR.textGrey,
    fontFamily: FONT.R_REG_400,
    marginHorizontal: 6,
  },
  placeholderStyle: { fontSize: 16, color: COLOR.lightTextGrey },
  selectedItemContainerStyle: { backgroundColor: COLOR.blue, borderRadius: 4 },
  selectedItemLabelStyle: { color: '#fff', fontWeight: '500' },
  error: { color: 'red', fontSize: 12, marginTop: 4 },
});
