import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Modal, View, Text, StyleSheet } from 'react-native';

type InternetContextType = {
  isConnected: boolean;
};

const InternetContext = createContext<InternetContextType | undefined>(
  undefined,
);

export const InternetProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!(state.isConnected && state.isInternetReachable));
    });

    return () => unsubscribe();
  }, []);

  return (
    <InternetContext.Provider value={{ isConnected }}>
      {children}
      {!isConnected && <InternetModal />}
    </InternetContext.Provider>
  );
};

// export const useInternet = () => {
//   const context = useContext(InternetContext);
//   if (!context) {
//     throw new Error('useInternet must be used within an InternetProvider');
//   }
//   return context;
// };

const InternetModal = () => {
  return (
    <Modal transparent animationType="fade" visible={true}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.text}>🚫 No Internet Connection</Text>
          <Text style={styles.subText}>
            Please check your network settings.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
