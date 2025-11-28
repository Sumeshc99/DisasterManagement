import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';
import { COLOR } from '../themes/Colors';
import { FONT } from '../themes/AppConst';

interface AlertModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onAcknowledge?: () => void;
  onViewDetails?: () => void;
  onClose?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title = 'IMPORTANT ALERT',
  message = 'Your decision is needed on pending incident requests. Take action now',
  onAcknowledge,
  onViewDetails,
  onClose,
}) => {
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    if (visible) {
      Sound.setCategory('Playback', true);

      const s = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Failed to load sound', error);
          return;
        }

        soundRef.current = s;

        s.play(() => {
          s.release();
          soundRef.current = null;
        });
      });
    } else {
      // Stop sound when modal closes
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.release();
        soundRef.current = null;
      }
    }
  }, [visible]);

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        stopSound();
        onClose && onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require('../assets/alert1.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.outlinedButton]}
                onPress={() => {
                  stopSound();
                  onAcknowledge && onAcknowledge();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.outlinedText]}>
                  Acknowledge
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.outlinedButton]}
                onPress={() => {
                  stopSound();
                  onViewDetails && onViewDetails();
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.outlinedText]}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#D64541',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: COLOR.textGrey,
    fontFamily: FONT.R_BOLD_700,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: COLOR.textGrey,
    fontFamily: FONT.R_SBD_600,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  outlinedButton: {
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  outlinedText: {
    color: '#000',
  },
});

export default AlertModal;
