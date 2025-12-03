import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';

const SuccessSheet = forwardRef((props: any, ref) => {
  const {
    message = TEXT.responder_assigned_success(),
    onClose,
    delay = 2000,
  } = props;

  return (
    <RBSheet
      ref={ref}
      height={300}
      customStyles={{
        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
        container: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', paddingTop: 25 }}>
        <Image
          source={require('../../assets/success.png')}
          style={{ width: 130, height: 130 }}
        />

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginTop: 10,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: COLOR.blue,
            paddingVertical: 12,
            width: WIDTH(55),
            borderRadius: 30,
            alignItems: 'center',
            marginTop: 25,
          }}
          onPress={() => {
            ref?.current?.close();
            onClose && onClose();
          }}
        >
          <Text style={{ fontSize: 16, color: '#fff', fontWeight: '600' }}>
            {TEXT.ok()}
          </Text>
        </TouchableOpacity>
      </View>
    </RBSheet>
  );
});

export default SuccessSheet;
