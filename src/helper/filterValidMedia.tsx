import { Alert } from 'react-native';
import { Video } from 'react-native-compressor';
import RNFS from 'react-native-fs';

const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

interface PickerAsset {
  uri?: string;
  type?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
}

const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

const filterValidMedia = async (
  assets: PickerAsset[],
  showLoader: () => void,
  hideLoader: () => void,
  showAlert: boolean = true,
): Promise<PickerAsset[]> => {
  const validAssets: PickerAsset[] = [];
  showLoader();
  for (const asset of assets) {
    const isVideo = asset.type?.startsWith('video');
    const originalSize = asset.fileSize ?? 0;

    // ✅ Image → always allowed
    if (!isVideo) {
      validAssets.push(asset);
      continue;
    }

    console.log(`📹 Original video size: ${bytesToMB(originalSize)} MB`);

    // ✅ Video under 10 MB → allowed
    if (originalSize <= MAX_VIDEO_SIZE) {
      validAssets.push(asset);
      continue;
    }

    // 🔥 Compress large video
    try {
      const compressedUri = await Video.compress(
        asset.uri!,
        { compressionMethod: 'auto' },
        progress => {
          // optional progress log
        },
      );

      // 🔍 Get compressed file size
      const fileStat = await RNFS.stat(compressedUri.replace('file://', ''));
      const compressedSize = Number(fileStat.size);

      console.log(`✅ Compressed video size: ${bytesToMB(compressedSize)} MB`);
      hideLoader();

      validAssets.push({
        ...asset,
        uri: compressedUri,
        fileSize: compressedSize,
      });
    } catch (error) {
      console.error('❌ Video compression failed', error);

      if (showAlert) {
        Alert.alert('Video too large', 'Unable to compress video below 10 MB');
      }
    }
  }

  return validAssets;
};

export default filterValidMedia;
