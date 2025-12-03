import { Platform } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';

export const downloadPDF = (pdfUrl: string, onError?: (msg: string) => void) => {
  if (!pdfUrl) {
    onError && onError('PDF URL is not available');
    return;
  }

  const { dirs } = RNBlobUtil.fs;
  const downloadPath =
    Platform.OS === 'android'
      ? `${dirs.DownloadDir}/myfile_${Date.now()}.pdf`
      : `${dirs.DocumentDir}/myfile_${Date.now()}.pdf`;

  RNBlobUtil.config({
    fileCache: true,
    appendExt: 'pdf',
    path: downloadPath,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      title: 'Downloading PDF',
      description: 'Downloading PDF...',
      path: downloadPath,
      mime: 'application/pdf',
      mediaScannable: true,
    },
  })
    .fetch('GET', pdfUrl)
    .then(() => console.log('Saved to:', downloadPath))
    .catch(() => onError && onError('Failed to download PDF'));
};
