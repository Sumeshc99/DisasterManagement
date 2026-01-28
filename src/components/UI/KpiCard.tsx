import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';
import CitizenSvg from '../../assets/svg/image 3.svg';

const KpiCard = ({ value, label, icon: Icon }) => {
  return (
    <View style={styles.card}>
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon width={58} height={58} />
        </View>
      )}
      <View style={styles.textWrapper}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

export default KpiCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1.5,
  },

  value: {
    fontSize: 22,
    fontFamily: FONT.R_BOLD_700,
    color: COLOR.blue,
    marginBottom: 4,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: FONT.R_REG_400,
    color: '#968F8F',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  iconWrapper: {
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});
