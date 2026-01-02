import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { COLOR } from '../../themes/Colors';
import MediaOptionSheet from '../bottomSheets/MediaOptionSheet';
import { TEXT } from '../../i18n/locales/Text';

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
  media?: MediaAsset[];
  onChangeMedia?: (assets: MediaAsset[]) => void;
  onRemoveMedia?: (index: number) => void;
}

const FormMediaPicker: React.FC<FormMediaPickerProps> = ({
  label,
  name,
  control,
  rules,
  error,
  media = [],
  onChangeMedia,
  onRemoveMedia,
}) => {
  const isRequired = !!rules?.required;
  const sheetRef = useRef<any>(null);
  const isPickingRef = useRef(false); // 🔐 prevent double open

  const openSheet = useCallback(() => {
    if (isPickingRef.current) return;
    sheetRef.current?.open();
  }, []);

  const openCamera = async () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;

    sheetRef.current?.close();

    setTimeout(async () => {
      try {
        const result = await launchCamera({
          mediaType: 'photo',
          quality: 0.8,
          saveToPhotos: true,
        });

        if (result.didCancel || result.errorCode) {
          isPickingRef.current = false;
          return;
        }

        if (result.assets?.length) {
          onChangeMedia?.(result.assets);
        }
      } finally {
        isPickingRef.current = false;
      }
    }, 300);
  };

  const openGallery = async () => {
    if (isPickingRef.current) return;
    isPickingRef.current = true;

    sheetRef.current?.close();

    setTimeout(async () => {
      try {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 5,
        });

        if (result.didCancel || result.errorCode) {
          isPickingRef.current = false;
          return;
        }

        if (result.assets?.length) {
          onChangeMedia?.(result.assets);
        }
      } finally {
        isPickingRef.current = false;
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isRequired && <Text style={styles.requiredMark}>*</Text>}
      </View>

      {/* Controller */}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={() => (
          <TouchableOpacity
            style={[styles.uploadBox, error && styles.inputError]}
            onPress={openSheet}
            activeOpacity={0.8}
          >
            {media?.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.previewScroll}
              >
                {media.map((item: any, index) => (
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
                        <Text style={styles.removeText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.placeholderText}>
                {TEXT.capture_or_upload()}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <MediaOptionSheet
        ref={sheetRef}
        onCamera={openCamera}
        onGallery={openGallery}
      />
    </View>
  );
};

export default FormMediaPicker;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    color: COLOR.textGrey,
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
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  previewScroll: { marginTop: 4 },
  thumbnailWrapper: { position: 'relative', marginRight: 10 },
  previewImage: { width: 90, height: 90, borderRadius: 6 },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 2,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  inputError: { borderColor: 'red' },
  placeholderText: {
    fontSize: 16,
    color: COLOR.lightTextGrey,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
