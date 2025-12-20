import React, { forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLOR } from '../../themes/Colors';

interface MediaAsset {
  uri?: string;
  fileSize?: number;
}

interface Props {
  media: MediaAsset[];
  onChange: (media: MediaAsset[]) => void;
}

const MAX_IMAGES = 2;
const MAX_SIZE = 5 * 1024 * 1024;

const CommentMediaPicker = forwardRef((props: Props, ref) => {
  const { media, onChange } = props;

  const pickImages = async () => {
    if (media.length >= MAX_IMAGES) {
      Alert.alert('Limit reached', 'You can upload only 2 images');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_IMAGES - media.length,
    });

    if (result.didCancel || !result.assets) return;

    const validImages = result.assets.filter(img => {
      if ((img.fileSize || 0) > MAX_SIZE) {
        Alert.alert('File too large', 'Each image must be under 5MB');
        return false;
      }
      return true;
    });

    onChange([...media, ...validImages]);
  };

  const removeImage = (index: number) => {
    const updated = [...media];
    updated.splice(index, 1);
    onChange(updated);
  };

  // Expose pickImages to parent via ref
  useImperativeHandle(ref, () => ({
    pickImages,
  }));

  return (
    <View>
      {media.length > 0 && (
        <ScrollView horizontal style={{ marginTop: 8 }}>
          {media.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.remove}
                onPress={() => removeImage(index)}
              >
                <Text style={{ color: '#fff' }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
});

export default CommentMediaPicker;

const styles = StyleSheet.create({
  imageWrapper: { marginRight: 10, position: 'relative' },
  image: { width: 80, height: 80, borderRadius: 8 },
  remove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 4,
  },
});
