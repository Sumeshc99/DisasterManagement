import React, { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

interface ConfirmationSheetProps {
  icon?: ImageSourcePropType;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  iconColor?: string;
  height?: number;
}

const ConfirmationSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  ConfirmationSheetProps
>(
  (
    {
      icon = require('../../assets/success.png'),
      message,
      confirmText = 'Yes',
      cancelText = 'No',
      onConfirm,
      onCancel,
      iconColor = '#4CAF50',
      height = 340,
    },
    ref,
  ) => {
    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={height}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          {/* Drag handle */}
          <View style={styles.dragIndicator} />

          {/* Icon */}
          <View style={styles.iconWrapper}>
            <Image
              source={icon}
              style={[styles.icon, { tintColor: iconColor }]}
            />
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.noButton} onPress={onCancel}>
              <Text style={styles.noButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
              <Text style={styles.yesButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  },
);

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginTop: 10,
    marginBottom: 15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 25,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 70,
    height: 70,
  },
  message: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  noButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2F5EC9',
    borderRadius: 25,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#2F5EC9',
    borderRadius: 25,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  noButtonText: {
    color: '#2F5EC9',
    fontSize: 16,
    fontWeight: '600',
  },
  yesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmationSheet;
