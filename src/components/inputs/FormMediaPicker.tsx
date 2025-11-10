import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { COLOR } from '../../themes/Colors';

interface MediaAsset {
  uri?: string;
  type?: string;
  fileName?: string;
}

interface FormMediaPickerProps {
  label: string;
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  error?: string;
  onPickMedia: () => void;
  media?: MediaAsset[];
  onRemoveMedia?: (index: number) => void;
}

const FormMediaPicker: React.FC<FormMediaPickerProps> = ({
  label,
  name,
  control,
  rules,
  error,
  onPickMedia,
  media = [],
  onRemoveMedia,
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
        render={() => (
          <View>
            <TouchableOpacity
              style={[styles.uploadBox, error && styles.inputError]}
              onPress={onPickMedia}
              activeOpacity={0.8}
            >
              <Text style={styles.placeholderText}>
                Capture or upload images/videos
              </Text>
            </TouchableOpacity>

            {/* Thumbnails */}
            {media?.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.previewScroll}
              >
                {media.map((item, index) => (
                  <View key={index} style={styles.thumbnailWrapper}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.previewImage}
                    />
                    {onRemoveMedia && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemoveMedia(index)}
                      >
                        {/* <X size={16} color="#fff" /> */}
                        <Text>X</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormMediaPicker;

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
    color: '#000',
    fontWeight: '500',
  },
  requiredMark: {
    color: 'red',
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: COLOR.white,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewScroll: {
    marginTop: 10,
  },
  thumbnailWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
