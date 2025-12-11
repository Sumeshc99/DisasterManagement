import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLOR } from '../../themes/Colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootReducer';

interface Responder {
  id: string;
  name: string;
  distance: string; // e.g., "100 meters" or "1.3 km"
  address: string;
}

interface Props {
  responders: Responder[];
  onClose?: () => void;
}

const ResponderListSheet = forwardRef<
  React.ComponentRef<typeof RBSheet>,
  Props
>(({ responders, onClose }, ref) => {
  const { user, userToken } = useSelector((state: RootState) => state.auth);
  return (
    <RBSheet
      ref={ref}
      closeOnPressMask
      height={400}
      customStyles={{
        container: styles.sheetContainer,
        draggableIcon: { backgroundColor: 'transparent' },
      }}
    >
      <View style={styles.content}>
        <View style={styles.dragIndicator} />

        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={() => {
            (ref as any)?.current?.close();
            onClose && onClose();
          }}
        >
          <Image
            source={require('../../assets/cancel.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>Nearby Responders</Text>

        <FlatList
          data={responders}
          keyExtractor={item => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.responderItem}>
              <Text style={styles.responderName}>
                {item.name} ({item.distance})
              </Text>
              <Text style={styles.responderAddress}>{item.address}</Text>
            </View>
          )}
        />
      </View>
    </RBSheet>
  );
});

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
    paddingVertical: 15,
    position: 'relative',
  },
  dragIndicator: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
  },
  closeIcon: {
    width: 25,
    height: 25,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  responderItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  responderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  responderAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default ResponderListSheet;
