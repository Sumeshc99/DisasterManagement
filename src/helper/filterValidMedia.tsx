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

  try {
    for (const asset of assets) {
      const isVideo = asset.type?.startsWith('video');

      // ✅ Image → always allowed
      if (!isVideo) {
        validAssets.push(asset);
        continue;
      }

      const originalSize = asset.fileSize ?? 0;
      console.log(`📹 Original size: ${bytesToMB(originalSize)} MB`);

      // ✅ Already under limit → accept directly
      if (originalSize <= MAX_VIDEO_SIZE) {
        validAssets.push(asset);
        continue;
      }

      // 🔥 Compress
      const compressedUri = await Video.compress(
        asset.uri!,
        { compressionMethod: 'auto' },
        () => {},
      );

      let filePath = compressedUri;

      // 🔥 ANDROID FIX: handle content://
      if (compressedUri.startsWith('content://')) {
        const tempPath = `${RNFS.CachesDirectoryPath}/${Date.now()}.mp4`;
        await RNFS.copyFile(compressedUri, tempPath);
        filePath = `file://${tempPath}`;
      }

      const stat = await RNFS.stat(filePath.replace('file://', ''));
      const compressedSize = Number(stat.size);

      console.log(`✅ Compressed size: ${bytesToMB(compressedSize)} MB`);

      // ❌ Still too large → reject
      if (compressedSize > MAX_VIDEO_SIZE) {
        if (showAlert) {
          Alert.alert(
            'Video too large',
            'Video must be under 10 MB after compression',
          );
        }
        continue;
      }

      validAssets.push({
        ...asset,
        uri: filePath,
        fileSize: compressedSize,
      });
    }
  } finally {
    hideLoader();
  }

  return validAssets;
};

export default filterValidMedia;
