import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';

interface MediaOptionSheetProps {
  onCamera: () => void;
  onGallery: () => void;
}

const MediaOptionSheet = forwardRef<RBSheet, MediaOptionSheetProps>(
  ({ onCamera, onGallery }, ref) => {
    return (
      <RBSheet
        ref={ref}
        height={180}
        closeOnPressMask
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          <TouchableOpacity style={styles.optionButton} onPress={onCamera}>
            <Text style={styles.optionText}>Take a Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={onGallery}>
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  },
);

export default MediaOptionSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginVertical: 10,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    width: '90%',
    backgroundColor: COLOR.white,
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: COLOR.black,
    fontWeight: '500',
  },
});
