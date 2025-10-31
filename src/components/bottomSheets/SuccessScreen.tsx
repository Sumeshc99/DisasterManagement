import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const SuccessScreen = forwardRef<React.ComponentRef<typeof RBSheet>>(
  (_, ref) => {
    return (
      <RBSheet
        ref={ref}
        closeOnPressMask
        height={300}
        customStyles={{
          container: styles.sheetContainer,
          draggableIcon: { backgroundColor: 'transparent' },
        }}
      >
        <View style={styles.content}>
          <View style={styles.dragIndicator} />
          <View style={styles.iconWrapper}>
            <Image
              source={require('../../assets/success.png')}
              style={styles.icon}
            />
            {/* </View> */}
          </View>

          <Text style={styles.message}>Your PIN is updated successfully</Text>
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
    paddingVertical: 25,
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 150,
    height: 150,
    // tintColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default SuccessScreen;
