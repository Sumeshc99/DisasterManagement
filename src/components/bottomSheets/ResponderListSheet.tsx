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

interface Responder {
  id: string;
  name: string;
  distance: string;
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
          renderItem={({ item }: any) => (
            <View style={styles.responderItem}>
              <Text style={styles.responderName}>
                {item.owner_full_name} ({item.distance_km} km)
              </Text>
              <Text style={styles.responderAddress}>{item.resource_type}</Text>
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
    top: 20,
    right: 20,
    borderRadius: 20,
  },
  closeIcon: {
    width: 30,
    height: 30,
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
