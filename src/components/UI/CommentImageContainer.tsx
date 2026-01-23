import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

interface Props {
  data: { blob_url: string; type?: string }[];
}

const CommentImageContainer = ({ data }: Props) => {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const isVideoFile = (item: any) => {
    if (item?.type) {
      return item.type.startsWith('video');
    }
    return /\.(mp4|mov|mkv|avi|webm)$/i.test(item?.blob_url);
  };

  const openPreview = (index: number) => {
    setActiveIndex(index);
    setVisible(true);
  };

  return (
    <>
      {/* Thumbnails */}
      <View style={styles.container}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => openPreview(index)}
          >
            <Image source={{ uri: item.blob_url }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Fullscreen preview */}
      <Modal visible={visible} transparent animationType="fade">
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          >
            <Image
              source={require('../../assets/cancel.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>

          <FlatList
            data={data}
            horizontal
            pagingEnabled
            initialScrollIndex={activeIndex}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index ?? 0);
              }
            }}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
            renderItem={({ item, index }) => {
              const isVideo = isVideoFile(item);

              return (
                <View style={styles.fullItem}>
                  {isVideo ? (
                    <Video
                      source={{ uri: item.blob_url }}
                      style={styles.fullMedia}
                      resizeMode="contain"
                      controls
                      paused={activeIndex !== index}
                    />
                  ) : (
                    <Image
                      source={{ uri: item.blob_url }}
                      style={styles.fullMedia}
                      resizeMode="contain"
                    />
                  )}
                </View>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default CommentImageContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullItem: {
    width,
    height,
  },
  fullMedia: {
    width,
    height,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 10,
    zIndex: 10,
  },
  closeIcon: {
    width: 32,
    height: 32,
  },
});
