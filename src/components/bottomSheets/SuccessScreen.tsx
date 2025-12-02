import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { FONT, WIDTH } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';
import { CommonActions, useNavigation } from '@react-navigation/native';

interface Props {
  icon?: any;
  title?: string;
  height: number;
  description?: string;
  yesLabel?: string;
  noLabel?: string;
  onYes?: () => void;
  onNo?: () => void;
  type?: 'success' | 'cancel';
}

const SuccessScreen = forwardRef<React.ComponentRef<typeof RBSheet>, Props>(
  (
    {
      icon = require('../../assets/success.png'),
      description = TEXT.pin_reset_success(),
      height,
      yesLabel = TEXT.yes(),
      noLabel = TEXT.no(),
      onYes,
      onNo,
      type,
    },
    ref,
  ) => {
    const navigation = useNavigation();
    const showButtons = onYes || onNo;

    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={height}
        onClose={() => {
          type === 'cancel' &&
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'mainAppSelector' }],
              }),
            );
        }}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.iconWrapper}>
              <Image source={icon} style={styles.icon} />
            </View>

            <Text style={styles.description}>{description}</Text>

            {showButtons && (
              <View style={styles.buttonRow}>
                {onNo && (
                  <TouchableOpacity
                    style={[styles.button, styles.noButton]}
                    onPress={onNo}
                  >
                    <Text style={styles.noButtonText}>{noLabel}</Text>
                  </TouchableOpacity>
                )}

                {onYes && (
                  <TouchableOpacity
                    style={[styles.button, styles.yesButton]}
                    onPress={onYes}
                  >
                    <Text style={styles.yesButtonText}>{yesLabel}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
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
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    marginTop: 10,
  },
  description: {
    fontFamily: FONT.R_SBD_600,
    color: COLOR.darkGray,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    width: WIDTH(85),
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 50,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: '#eee',
  },
  yesButton: {
    backgroundColor: COLOR.blue,
  },
  noButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  yesButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SuccessScreen;
