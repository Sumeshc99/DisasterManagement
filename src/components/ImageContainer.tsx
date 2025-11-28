import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { FONT } from '../themes/AppConst';
import { COLOR } from '../themes/Colors';

const { width, height } = Dimensions.get('window');

const ImageContainer = ({ data }: any) => {
  const [visible, setVisible] = useState(false);

  const openGallery = () => {
    setVisible(true);
  };

  return (
    <View>
      <Text style={styles.title}>Image and Video</Text>

      <TouchableOpacity onPress={openGallery} style={styles.thumbnailWrapper}>
        <Image
          source={{ uri: data[0]?.blob_url }}
          style={styles.thumbnailImage}
        />

        {data.length > 1 && (
          <Text style={styles.imageCountText}>Image + {data.length - 1}</Text>
        )}
      </TouchableOpacity>

      <Modal visible={visible} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={styles.closeIconContainer}
          >
            <Image
              source={require('../assets/cancel.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <FlatList
            data={data}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.fullImageWrapper}>
                <Image
                  source={{ uri: item?.blob_url }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default ImageContainer;

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT.R_SBD_600,
    fontSize: 16,
    color: COLOR.textGrey,
  },
  thumbnailWrapper: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 4,
    height: 122,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  imageCountText: {
    position: 'absolute',
    bottom: 44,
    left: 14,
    fontFamily: FONT.R_SBD_600,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullImageWrapper: {
    width,
    height,
  },
  fullImage: {
    width,
    height,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
    elevation: 10,
    width: 24,
    height: 24,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 34,
    height: 34,
  },
});
