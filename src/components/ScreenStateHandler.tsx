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
  },
  noDataText: {
    fontSize: 18,
    color: COLOR.gray,
    textAlign: 'center',
  },
});
