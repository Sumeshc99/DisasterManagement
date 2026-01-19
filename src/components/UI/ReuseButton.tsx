import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { WIDTH } from '../../themes/AppConst';
// import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

interface ButtonProps {
  text: string;
  onPress: () => void;
  bgColor?: string;
  textColor?: string;
  disabled?: boolean;
  style?: any;
}

const ReuseButton: React.FC<ButtonProps> = ({
  text,
  onPress,
  bgColor = COLOR.blue,
  textColor = '#fff',
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: disabled ? '#A8A8A8' : bgColor },
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: WIDTH(38),
    borderRadius: WIDTH(100) * 0.08, // responsive pill-like radius
    paddingVertical: WIDTH(3.2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,

    // Shadow (Android)
    elevation: 3,
  },
  buttonText: {
    fontSize: WIDTH(3.5),
    fontWeight: '600',
  },
});

export default ReuseButton;
