import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { TEXT } from '../../i18n/locales/Text';

interface Props {
  onUpdatePress: () => void;
}

const PasswordChanged = forwardRef<React.ComponentRef<typeof RBSheet>, Props>(
  ({ onUpdatePress }, ref) => {
    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={220}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          <TouchableOpacity
            style={styles.closeIconContainer}
            onPress={() => (ref as any)?.current?.close()}
          >
            <Image
              source={require('../../assets/cancel.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <Image
            source={require('../../assets/userImg.png')}
            style={styles.avatar}
          />

          <Text style={styles.reminderText}>{TEXT.profile_saved()}</Text>

          {/* <TouchableOpacity
          style={styles.updateButton}
          onPress={onUpdatePress}
          activeOpacity={0.8}
        >
          <Text style={styles.updateButtonText}>Update Profile</Text>
        </TouchableOpacity> */}
        </View>
      </RBSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 25,
    position: 'relative',
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
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
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  reminderText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 22,
    fontWeight: 500,
  },
  updateButton: {
    backgroundColor: COLOR.blue,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PasswordChanged;
