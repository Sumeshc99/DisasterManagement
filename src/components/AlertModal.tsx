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
import SystemSetting from 'react-native-system-setting';
import { COLOR } from '../themes/Colors';
import { FONT } from '../themes/AppConst';
import { TEXT } from '../i18n/locales/Text';

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
  title = TEXT.important_alert(),
  message = TEXT.your_decision(),
  onAcknowledge,
  onViewDetails,
  onClose,
}) => {
  const soundRef = useRef<Sound | null>(null);

  useEffect(() => {
    if (!visible) {
      stopSound();
      return;
    }

    SystemSetting.setVolume(1.0);
    Sound.setCategory('Playback', true);

    const sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log(TEXT.failed_load_sound(), error);
        return;
      }

      sound.setNumberOfLoops(-1);
      sound.play();
      soundRef.current = sound;
    });

    return () => stopSound();
  }, [visible]);

  const stopSound = () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        stopSound();
        onClose?.();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../assets/alert1.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.outlinedButton]}
                activeOpacity={0.8}
                onPress={() => {
                  stopSound();
                  onAcknowledge?.();
                }}
              >
                <Text style={[styles.buttonText, styles.outlinedText]}>
                  {TEXT.acknowledge()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.outlinedButton]}
                activeOpacity={0.8}
                onPress={() => {
                  stopSound();
                  onViewDetails?.();
                }}
              >
                <Text style={[styles.buttonText, styles.outlinedText]}>
                  {TEXT.view_details()}
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
    color: COLOR.textGrey,
  },
});

export default AlertModal;

// import React, { useEffect, useRef } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import Sound from 'react-native-sound';
// import SystemSetting from 'react-native-system-setting';
// import { COLOR } from '../themes/Colors';
// import { FONT } from '../themes/AppConst';
// import { TEXT } from '../i18n/locales/Text';

// interface AlertModalProps {
//   visible: boolean;
//   title?: string;
//   message?: string;
//   onAcknowledge?: () => void;
//   onViewDetails?: () => void;
//   onClose?: () => void;
// }

// const AlertModal: React.FC<AlertModalProps> = ({
//   visible,
//   title = TEXT.important_alert(),
//   message = TEXT.your_decision(),
//   onAcknowledge,
//   onViewDetails,
//   onClose,
// }) => {
//   const soundRef = useRef<Sound | null>(null);

//   useEffect(() => {
//     if (!visible) {
//       stopSound();
//       return;
//     }

//     SystemSetting.setVolume(1.0);
//     Sound.setCategory('Playback', true);

//     const playSound = () => {
//       const s = new Sound('sound.mp3', Sound.MAIN_BUNDLE, error => {
//         if (error) {
//           console.log(TEXT.failed_load_sound(), error);
//           return;
//         }

//         soundRef.current = s;

//         s.play(success => {
//           if (success && visible) {
//             s.release();
//             soundRef.current = null;

//             playSound();
//           }
//         });
//       });
//     };

//     playSound();

//     return () => stopSound();
//   }, [visible]);

//   const stopSound = () => {
//     if (soundRef.current) {
//       soundRef.current.stop();
//       soundRef.current.release();
//       soundRef.current = null;
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={() => {
//         stopSound();
//         onClose && onClose();
//       }}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <Image
//               source={require('../assets/alert1.png')}
//               style={styles.icon}
//               resizeMode="contain"
//             />
//           </View>

//           <View style={styles.body}>
//             <Text style={styles.title}>{title}</Text>
//             <Text style={styles.message}>{message}</Text>

//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={[styles.button, styles.outlinedButton]}
//                 onPress={() => {
//                   stopSound();
//                   onAcknowledge && onAcknowledge();
//                 }}
//                 activeOpacity={0.8}
//               >
//                 <Text style={[styles.buttonText, styles.outlinedText]}>
//                   {TEXT.acknowledge()}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.button, styles.outlinedButton]}
//                 onPress={() => {
//                   stopSound();
//                   onViewDetails && onViewDetails();
//                 }}
//                 activeOpacity={0.8}
//               >
//                 <Text style={[styles.buttonText, styles.outlinedText]}>
//                   {TEXT.view_details()}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     width: '85%',
//     borderRadius: 12,
//     backgroundColor: '#fff',
//     overflow: 'hidden',
//   },
//   header: {
//     backgroundColor: '#D64541',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 25,
//   },
//   icon: {
//     width: 40,
//     height: 40,
//     tintColor: '#fff',
//   },
//   body: {
//     paddingHorizontal: 20,
//     paddingVertical: 25,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 16,
//     color: COLOR.textGrey,
//     fontFamily: FONT.R_BOLD_700,
//     marginBottom: 10,
//   },
//   message: {
//     fontSize: 14,
//     color: COLOR.textGrey,
//     fontFamily: FONT.R_SBD_600,
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 15,
//   },
//   button: {
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderWidth: 1,
//   },
//   outlinedButton: {
//     borderColor: '#000',
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   outlinedText: {
//     color: COLOR.textGrey,
//   },
// });

// export default AlertModal;
