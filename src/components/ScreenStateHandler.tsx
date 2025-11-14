import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLoader from './ScreenLoader';
import { COLOR } from '../themes/Colors';

interface Props {
  loading: boolean;
  isEmpty: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

const ScreenStateHandler: React.FC<Props> = ({
  loading,
  isEmpty,
  emptyMessage = 'Data not found',
  children,
}) => {
  if (loading) return <ScreenLoader />;

  if (isEmpty) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>{emptyMessage}</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default ScreenStateHandler;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLOR.white,
  },
  noDataText: {
    fontSize: 18,
    color: COLOR.darkGray,
    fontWeight: 500,
    textAlign: 'center',
  },
});
