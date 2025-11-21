import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';

interface MediaOptionSheetProps {
  onCamera: () => void;
  onGallery: () => void;
}

const MediaOptionSheet = forwardRef<any, MediaOptionSheetProps>(
  ({ onCamera, onGallery }, ref) => {
    return (
      <RBSheet
        ref={ref}
        height={200}
        closeOnPressMask
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />
          <Text style={styles.optionText}>Please upload the photo</Text>
          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => (ref as any)?.current?.close()}
          >
            <Image
              source={require('../../assets/cancel.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 40,
            }}
          >
            <TouchableOpacity style={styles.optionButton} onPress={onCamera}>
              <Image source={require('../../assets/camera.png')} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={onGallery}>
              <Image source={require('../../assets/galary.png')} />
            </TouchableOpacity>
          </View>
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
    marginVertical: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    width: 70,
    height: 70,
    backgroundColor: COLOR.white,
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 20,
    borderWidth: 2,
    borderColor: COLOR.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 20,
    color: COLOR.textGrey,
    fontFamily: FONT.R_BOLD_700,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
});
